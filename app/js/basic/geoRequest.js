/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals iS3Project */
/* globals ol */

/**
 * The construction function
 */
iS3.geoRequest = function () {

};

/**
 * Query a feature in the tile layer using coordinate
 *
 * @param {ol.coordinate} coordinate The Openlayer coordinate
 * @param {ol.layer} layer The Openlayer layer
 * @param {Function} callback Callback function
 */
iS3.geoRequest.queryFeatureFromTile = function (coordinate, layer, callback) {
    var map = iS3Project.getMap();
    var viewResolution = /** @type {number} */ (map.getView().getResolution());
    var mapProj = map.getView().getProjection();
    var url = layer.getSource().getGetFeatureInfoUrl(
        coordinate, viewResolution, mapProj.getCode(),
        {'INFO_FORMAT': 'application/json'});

    var parser = new ol.format.GeoJSON();
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var features = parser.readFeatures(request.responseText, {
                featureProjection: mapProj
            });
            if (features.length > 0) {
                callback(features[0]);
            }
        }
    };
};

/**
 * Query features in the tile layer using bounding box
 *
 * @param {iS3.LayerDef} layerDef The layer definition
 * @param {ol.extent} extent Then Openlayer extent
 * @param {Function} callback Callback function
 */
iS3.geoRequest.bboxFeaturesFromTile = function (layerDef, extent, callback) {
    var map = iS3Project.getMap();
    var mapProj = map.getView().getProjection();
    var url = layerDef.server + '/wfs?service=WFS'
        + '&version=1.1.0&request=GetFeature&typename=' + layerDef.name
        + '&outputFormat=application/json&srsname=' + mapProj.getCode()
        + '&bbox=' + extent.join(',') + ',' + mapProj.getCode();

    var parser = new ol.format.GeoJSON();
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var features = parser.readFeatures(request.responseText, {
                featureProjection: mapProj
            });
            callback(features);
        }
    };
};

/**
 * Query GeoJson format of features in the tile layer using bounding box
 *
 * @param {iS3.LayerDef} layerDef The layer definition
 * @param {ol.extent} extent Then Openlayer extent
 * @param {Function} callback Callback function
 */
iS3.geoRequest.bboxGeoJsonFromTile = function (layerDef, extent, callback) {
    var map = iS3Project.getMap();
    var mapProj = map.getView().getProjection();
    var url = layerDef.server + '/wfs?service=WFS'
        + '&version=1.1.0&request=GetFeature&typename='
        + layerDef.name
        + '&outputFormat=application/json&srsname='
        + mapProj.getCode() + '&bbox=' + extent.join(',') + ',' + mapProj.getCode();

    var parser = new ol.format.GeoJSON();
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.send();

    request.onreadystatechange = function () {

        if (request.readyState === 4 && request.status === 200) {
            callback(request.responseText);
        }
    };
};

/**
 * Query features in the tile layer using polygon
 *
 * @param {iS3.LayerDef} layerDef The layer definition
 * @param {ol.geom} polygon Polygon
 * @return {Promise} The jquery Deferred's Promise object
 */
iS3.geoRequest.polygonFeaturesFromTile = function (layerDef, polygon) {

    var jdeferred = $.Deferred;
    var deferred = jdeferred();

    iS3.geoRequest.getWFSInfo(layerDef).done(function (layerInfo) {
        var mapProj = iS3Project.getMap().getView().getProjection().getCode();

        var featObject = new ol.format.WFS().writeGetFeature({
            featureNS: layerInfo.featureNS,
            featurePrefix: layerDef.featurePrefix,
            featureTypes: [layerInfo.featureType],
            srsName: mapProj,
            outputFormat: 'application/json',
            filter: new ol.format.filter.Intersects(
                'wkb_geometry',
                polygon,
                mapProj)
        });
        var serializer = new XMLSerializer();
        var featString = serializer.serializeToString(featObject);

        $.ajax({
            url: layerDef.server + '/wfs?service=wfs',
            type: 'POST',
            headers: {
                'Content-Type': 'text/xml'
            },
            data: featString
        }).done(function (data) {
            var features = new ol.format.GeoJSON().readFeatures(data, {
                featureProjection: mapProj
            });
            deferred.resolve(features);
        });
    });

    return deferred.promise();
};

/**
 * Submit the geoserver transact wfs
 *
 * @param {iS3.LayerDef} layerDef The layer definition
 * @param {ol.feature[]} features The submitted features
 * @param {string} mode The submitted type
 */
iS3.geoRequest.transactWFS = function (layerDef, features, mode) {
    iS3.geoRequest.getWFSInfo(layerDef).done(function (layerInfo) {
        console.log(layerInfo);
        var WFSTSerializer = new ol.format.WFS();
        var options = {
            featureType: layerInfo.featureType,
            featureNS: layerInfo.featureNS,
            // gmlOptions: {srsName: 'EPSG:3857'}
            gmlOptions: {srsName: iS3Project.getMap().getView().getProjection().getCode()}
        };
        var featObject;
        switch (mode) {
            case 'insert':
                featObject = WFSTSerializer.writeTransaction(features, null, null, options);
                break;
            case 'update':
                featObject = WFSTSerializer.writeTransaction(null, features, null, options);
                break;
            case 'delete':
                featObject = WFSTSerializer.writeTransaction(null, null, features, options);
                break;
        }
        var serializer = new XMLSerializer();
        var featString = serializer.serializeToString(featObject);

        var proxy = iS3Project.getConfig().proxy;

        var jdeferred = $.Deferred;
        var deferred = jdeferred();

        $.post(proxy + '/proxy/geoserver/transact-wfs', featString)
            .done(function (data) {
                var layer = iS3Project.getLayertree().getLayerById(layerDef.id);
                if (layer instanceof ol.layer.Tile) {
                    var source = layer.getSource();
                    var params = source.getParams();
                    params.t = new Date().getMilliseconds();
                    source.updateParams(params);
                }
                deferred.resolve();
            });

        return deferred.promise();
    });
};

/**
 * Get layer definition information
 *
 * @param {iS3.LayerDef} layerDef The layer definition
 * @return {Promise} The jquery Deferred's Promise object
 */
iS3.geoRequest.getWFSInfo = function (layerDef) {
    var result = {};
    var layerInfo = layerDef.name.split(/:/);
    result.featureType = layerInfo[1];
    var url = layerDef.server + '/wfs?REQUEST=GetCapabilities&SERVICE=wfs';
    var jdeferred = $.Deferred;
    var deferred = jdeferred();
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'text'
    }).done(function (data) {
        var patt = new RegExp('xmlns:' + layerInfo[0] + '=".+?"');
        var matchs = data.match(patt);
        result.featureNS = matchs[0].split(/"/)[1];
        layerDef.featureType = result.featureType;
        layerDef.featureNS = result.featureNS;
        deferred.resolve(result);
    });
    return deferred.promise();
};

/**
 * Get wms layer attribute headers
 *
 * @param {iS3.LayerDef} layerDef The layer definition
 * @param {Function} callback Callback function
 */
iS3.geoRequest.getLayerHeader = function (layerDef, callback) {
    if (!layerDef.headers && layerDef.headers.length > 0) {
        callback(layerDef.headers);
    } else {
        var url = layerDef.server + '/wfs?' + 'SERVICE=WFS&REQUEST=GetFeature&TYPENAME='
            + layerDef.name + '&VERSION=1.1.0&outputFormat=application%2Fjson&maxFeatures=1';
        var parser = new ol.format.GeoJSON();
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var features = parser.readFeatures(request.responseText);
                if (features.length === 1) {
                    var attributes = features[0].getProperties();
                    for (var i in attributes) {
                        if (iS3.domTool.isNumber(attributes[i])) {
                            layerDef.headers.push({name: i, type: 'number'});
                        } else {
                            layerDef.headers.push({name: i, type: 'string'});
                        }
                    }
                    callback(layerDef.headers);
                }
            }
        };
    }
};

/**
 * Transfer Geojson format to Shape format
 *
 * @param {string} GeoJson The GeoJson string
 * @param {string} shpName The name of output shape file
 */
iS3.geoRequest.geojsonToShp = function (GeoJson, shpName) {
    var params = {
        json: GeoJson,
        outputName: shpName + '.zip'
    };
    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', 'http://ogre.adc4gis.com/convertJson');

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);
            form.appendChild(hiddenField);
        }
    }
    form.submit();
};

/**
 * Transfer shape file to GeoJson string
 *
 * @param {document.file} file Input file
 * @param {Array} options Options
 * @param {Function} callback Callback function
 */
iS3.geoRequest.shapeToGeojson = function (file, options, callback) {
    var formdata = new FormData();
    formdata.append('upload', file);
    formdata.append('targetSrs', options.targetSrs.getCode());
    $.ajax({
        url: 'https://ogre.adc4gis.com/convert',
        data: formdata,
        type: 'POST',
        processData: false,
        contentType: false,
        success: function (msg) {
            callback(msg);
        },
        error: function (msg) {
            console.log('Error: ' + msg);
        }
    });
};