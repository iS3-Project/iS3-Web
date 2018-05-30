/**
 * Created by linxd on 2018/5/19.
 */

/* globals ol */

var iS3Project = window.iS3Project;

/**
 * Construction function
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.Project = function (options) {

    // helper
    /**
     * @type {ol.Map}
     * @private
     */
    this._map = options.map || null;

    /**
     * @type {iS3.layertree}
     * @private
     */
    this._layertree = options.layertree || null;

    /**
     * @type {iS3.toolbar}
     * @private
     */
    this._toolbar = options.toolbar || null;

    /**
     * @type {document.element}
     * @private
     */
    this._message = options.message || null;

    this._datatree = options.datatree || null;

    this._data = options.data || null;

    /**
     * All the layer information. key format:'server:store:name', value: {iS3.layertree.layerDef}
     * @type {Array}
     * @private
     */
    this._layerDefs = {};

    /**
     * @type {iS3.config}
     * @private
     */
    var config = options.config || null;
    this._config = new iS3.Config({config: config});

    iS3Project = this;

    // map to iS3-Desktop
    this.projDef = null;
    this.domains = null;

    // DGObject selection event
    this.selectedID = null;
    this.selectDGObjectEventEmitter = new ol.Observable();
    this.init();
};

iS3.Project.prototype.init = function() {
    var thisCpy = this;
    $.get(iS3Project.getConfig().proxy + '/api/project/definition/' + iS3Project.getConfig().CODE)
        .done(function(data) {
            if (iS3.util.checkData(data)) {
                thisCpy.projDef = iS3.ProjectDefinition.load(data.data);
                thisCpy.initMap();
            }
        });

    $.get(iS3Project.getConfig().proxy + '/api/project/domain/' + iS3Project.getConfig().CODE)
        .done(function(data) {
            thisCpy.domains = {};
            if (iS3.util.checkData(data)) {
                for(var key in data.data) {
                    thisCpy.domains[key] = iS3.Domain.load(data.data[key]);
                }
            }
            iS3Project.getDatatree().init();
        })
        .fail(function() {
            thisCpy.domains = {};
            iS3Project.getDatatree().init();
        });
};

iS3.Project.prototype.initMap = function() {

    var thisCpy = this;
    var url = iS3Project.getConfig().server + '/wms?REQUEST=GetCapabilities&SERVICE=WMS';
    var request = new XMLHttpRequest();

    // deal with the layer information
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            thisCpy.parseCapability(request.responseText);

            var maps = thisCpy.projDef.EngineeringMaps;
            var map = null;
            for (var key in maps) {
                if (maps[key].MapID === 'BaseMap') {
                    map = maps[key];
                    break;
                }
            }

            var layertree = thisCpy.getLayertree();
            var CODE = iS3Project.getConfig().CODE;

            var extent = ol.extent.createEmpty();

            for (var key in map.LocalGdbLayersDef) {
                var id = iS3Project.getConfig().server + ':' + CODE.toLowerCase() + ':'
                    + map.LocalGdbLayersDef[key].Name.toLowerCase();
                var layerDef = iS3Project.getLayerDefs()[id];
                if (layerDef === null) continue;

                extent = ol.extent.extend(extent, ol.proj.transformExtent(layerDef.extent, layerDef.projection,
                    layertree.map.getView().getProjection()));
                var params = {
                    url: iS3Project.getConfig().server + '/wms',
                    params: {
                        LAYERS: layerDef.name,
                        FORMAT: 'image/png',
                        VERSION: '1.1.0'
                    },
                    wrapX: false
                };
                var layer = new ol.layer.Tile({
                    source: new ol.source.TileWMS(params)
                });

                // the unique identification of layer, layerDiv and layerDef
                layer.set('id', id);
                layertree.map.addLayer(layer);
            }

            if (extent instanceof ol.geom.SimpleGeometry
                || (Object.prototype.toString.call(extent) === '[object Array]'
                && extent.length === 4)) {
                layertree.map.getView().fit(extent, layertree.map.getSize());
            }
        }
    };

    request.open('GET', url, true);
    request.send();
};

iS3.Project.prototype.parseCapability = function(xml) {
    var layertree = iS3Project.getLayertree();
    var parser = new ol.format.WMSCapabilities();
    try {
        var capabilities = parser.read(xml);
        var currentProj = layertree.map.getView().getProjection().getCode();
        var crs;
        if (capabilities.version === '1.3.0') {
            crs = capabilities.Capability.Layer.CRS;
        } else {
            crs = [currentProj];
            messageText += ' Warning! Projection compatibility could not be checked due to version mismatch ('
                + capabilities.version + ').';
        }

        var layers = capabilities.Capability.Layer.Layer;
        if (layers.length > 0 && crs.indexOf(currentProj) > -1) {
            for (var i = 0; i < layers.length; i += 1) {
                var layerDef = new iS3.LayerDef({});
                layerDef.id = iS3Project.getConfig().server + ':' + layers[i].Name;
                layerDef.server = iS3Project.getConfig().server;
                layerDef.featurePrefix = layers[i].Name.split(':')[0];
                layerDef.name = layers[i].Name;
                for (var key in layers[i].BoundingBox) {
                    if (layers[i].BoundingBox[key].crs.includes('EPSG')) {
                        layerDef.projection = ol.proj.get(layers[i].BoundingBox[key].crs);
                        layerDef.extent = layers[i].BoundingBox[key].extent;
                        continue;
                    }
                }
                layerDef.featureType = layers[i].Name.split(':')[1];
                layerDef.featureNS = iS3Project.getConfig().server;
                iS3Project.getLayerDefs()[layerDef.id] = layerDef;
            }
        }
    } catch (error) {
        console.log(error.message);
    } finally {
    }
};

/**
 * Get map
 *
 * @return {ol.Map} Return map
 */
iS3.Project.prototype.getMap = function () {
    return this._map;
};

/**
 * Set map
 *
 * @param {ol.Map} map Map
 */
iS3.Project.prototype.setMap = function (map) {
    if (map instanceof ol.Map) {
        this._map = map;
    } else {
        throw new Error('map must be an instance of ol.Map');
    }
};

/**
 * Get layer tree
 *
 * @return {iS3.layertree} Return layertree
 */
iS3.Project.prototype.getLayertree = function () {
    return this._layertree;
};

/**
 * Set layertree
 *
 * @param {iS3.layertree} layertree Layertree
 */
iS3.Project.prototype.setLayertree = function (layertree) {
    if (layertree instanceof iS3.layertree.Layertree) {
        this._layertree = layertree;
    } else {
        throw new Error('layertree must be an instance of iS3.layertree');
    }
};

/**
 * Get toolbar
 *
 * @return {iS3.toolbar} Return toolbar
 */
iS3.Project.prototype.getToolbar = function () {
    return this._toolbar;
};

/**
 * Set toolbar
 *
 * @param {iS3.toolbar} toolbar Toolbar
 */
iS3.Project.prototype.setToolbar = function (toolbar) {
    if (toolbar instanceof iS3.toolbar.Toolbar) {
        this._toolbar = toolbar;
    } else {
        throw new Error('toolbar must be an instance of iS3.toolbar');
    }
};

/**
 * Get message bar
 *
 * @return {document.element} Message bar
 */
iS3.Project.prototype.getMessage = function () {
    return this._message;
};

/**
 * Set message bar
 *
 * @param {document.element} message Message
 */
iS3.Project.prototype.setMessage = function (message) {
    this._message = message;
};

iS3.Project.prototype.getDatatree = function () {
    return this._datatree;
};

iS3.Project.prototype.setDatatree = function (datatree) {
    this._datatree = datatree;
};

iS3.Project.prototype.getData = function () {
    return this._data;
};

iS3.Project.prototype.setData = function (data) {
    this._data = data;
};

/**
 * Get Layer definitions
 *
 * @return {Array} Layer definitions
 */
iS3.Project.prototype.getLayerDefs = function () {
    return this._layerDefs;
};

/**
 * Get config
 *
 * @return {iS3.Config}
 */
iS3.Project.prototype.getConfig = function () {
    return this._config;
};