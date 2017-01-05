/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals ol */

/**
 * Construction function
 * The status codes for the panopoints are as follow
 * 0: qualified panopoints
 * 1: picture deleted points
 * 2: isolated deleted points
 * 3: repeated deleted points
 * 4: link deleted points
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.format.PanotimeB = function (options) {
    this.name = options ? options.name : null;
    this.headers = [
        {name: 'captureid', type: 'string'},
        {name: 'date', type: 'string'},
        {name: 'time', type: 'string'},
        {name: 'flag', type: 'string'},
        {name: 'xxx', type: 'number', fixed: 9},
        {name: 'yyy', type: 'number', fixed: 9},
        {name: 'nexxx', type: 'number', fixed: 9},
        {name: 'northdeg', type: 'number', fixed: 9},
        {name: 'speed', type: 'number', fixed: 2},
        {name: 'kydate_id', type: 'string'},
        {name: 'x', type: 'number', fixed: 0},
        {name: 'y', type: 'number', fixed: 0},
        {name: 'z', type: 'number', fixed: 3},
        {name: 'h_ell', type: 'number', fixed: 3},
        {name: 'vnorth', type: 'number', fixed: 3},
        {name: 'veast', type: 'number', fixed: 3},
        {name: 'vup', type: 'number', fixed: 3},
        {name: 'pitch', type: 'number', fixed: 3},
        {name: 'roll', type: 'number', fixed: 3},
        {name: 'q', type: 'number', fixed: 0},
        {name: 'gpstime', type: 'string'},
        {name: 'scale', type: 'number', fixed: 3},
        {name: 's_f', type: 'number', fixed: 3},
        {name: 'viewtype', type: 'number', fixed: 0},
        {name: 'dis', type: 'string'},
        {name: 'dis_time', type: 'string'},
        {name: 'av', type: 'string'},
        {name: 'tv', type: 'string'},
        {name: 'iso', type: 'string'},
        {name: 'wb', type: 'string'}
    ];
};

/**
 * Read features from panotimeb
 *
 * @param {string} source Input panotimeb
 * @param {Object} options Options
 * @return {ol.feature[]} The Openlayer features
 */
iS3.format.PanotimeB.prototype.readFeatures = function (source, options) {
    var headers = this.headers;
    var lines = source.split(/[\r\n]+/g);
    var features = [];
    var idName = this.name.substr(0, this.name.lastIndexOf('.'));
    for (var i = 1; i < lines.length; i++) {
        if (lines[i] === '' || lines[i].substring(0, 1) === '#' || lines[i].substring(0, 1) === ' ') {
            continue;
        }

        var properties = lines[i].replace('//', '').replace(/]\//g, '] ').replace(/,/g, ' ').split(' ');
        var id = idName + '.' + i;

        // geometry information
        var geometry = new ol.geom.Point([parseFloat(properties[4]), parseFloat(properties[5])]);
        var newFeature = new ol.Feature();
        newFeature.setId(id);
        newFeature.setGeometryName('wkb_geometry');
        newFeature.setGeometry(geometry);
        newFeature.getGeometry().transform(options.dataProjection, options.featureProjection);

        // attribute information
        for (var j = 0; j < properties.length; j++) {
            if (headers[j].type === 'string') {
                newFeature.set(headers[j].name, properties[j]);
            } else {
                newFeature.set(headers[j].name, parseFloat(properties[j]));
            }
        }

        // add status column
        newFeature.set('status', 0);
        features.push(newFeature);
    }
    return features;
};

/**
 * Write panotimeb to features
 *
 * @param {ol.feature[]} features Features
 * @param {Object} options Options
 * @return {string} PanotimeB
 */
iS3.format.PanotimeB.prototype.writeFeatures = function (features, options) {
    function featureCompare(feature1, feature2) {
        return parseInt(feature1.get('captureid'), 10) - parseInt(feature2.get('captureid'), 10);
    }

    features.sort(featureCompare);
    var headers = this.headers;
    var lines = [];
    lines.push('#captureID,date,time,flag,xxx,yyy,NExxx,northDeg,Speed,kydate_id,x,y,z,H-Ell,VNorth,VEast,'
        + 'VUp,Pitch,Roll,Q,gpstime,scale,s-f,viewtype//dis,time,Av,Tv,ISO,WB');
    for (var i = 0; i < features.length; i++) {
        if (features[i].get('status') !== 0) {
            continue;
        }

        var line = [];
        for (var j = 0; j < 4; j++) {
            if (headers[j].type === 'string') {
                line.push(features[i].get(headers[j].name));
            } else {
                line.push(features[i].get(headers[j].name).toFixed(headers[j].fixed));
            }
        }

        line.push(features[i].get(headers[4].name));
        line.push(features[i].get(headers[5].name));

        for (j = 6; j < 8; j++) {
            if (headers[j].type === 'string') {
                line.push(features[i].get(headers[j].name));
            } else {
                line.push(features[i].get(headers[j].name).toFixed(headers[j].fixed));
            }
        }

        var speed = features[i].get(headers[8].name).toFixed(2).toString();
        line.push(('00000' + speed).substr(-5));

        for (j = 9; j < 24; j++) {
            if (headers[j].type === 'string') {
                line.push(features[i].get(headers[j].name));
            } else {
                line.push(features[i].get(headers[j].name).toFixed(headers[j].fixed));
            }
        }

        var tmp = [
            '//', features[i].get(headers[24].name),
            '/', features[i].get(headers[25].name),
            '/', features[i].get(headers[26].name),
            ',', features[i].get(headers[27].name),
            ',', features[i].get(headers[28].name),
            ',', features[i].get(headers[29].name)
        ];
        line.push(tmp.join(''));
        lines.push(line.join(' '));
    }
    return lines.join('\r\n');
};

/**
 * Panotimeb to Json
 *
 * @param {ol.feature[]} features Features
 * @param {Object} options Options
 * @return {string} Json
 */
iS3.format.PanotimeB.prototype.toJson = function (features, options) {
    var result = [];
    var headers = this.headers;
    var hstatus = 'status';
    var hcardaySeries = 'carday_series';
    var hkeydate = 'keydate';

    for (var i = 0; i < features.length; i++) {
        var tmp = {};
        for (var j = 0; j < headers.length; j++) {
            tmp[headers[j].name] = features[i].get(headers[j].name);
        }

        if (features[i].get(hcardaySeries)) {
            tmp[hcardaySeries] = features[i].get(hcardaySeries);
        } else {
            tmp[hcardaySeries] = 0;
        }

        if (features[i].get(hstatus)) {
            tmp[hstatus] = features[i].get(hstatus);
        } else {
            tmp[hstatus] = 0;
        }

        if (features[i].get(hkeydate)) {
            tmp[hkeydate] = features[i].get(hkeydate);
        } else {
            tmp[hkeydate] = features[i].get('kydate_id').split('_')[0].toLowerCase();
        }

        result.push(tmp);
    }
    return JSON.stringify(result);
};

/**
 * Get projection of panotimeb
 *
 * @param {string} source Panotimeb string
 * @return {ol.proj.Projection} Projection
 */
iS3.format.PanotimeB.prototype.readProjection = function (source) {
    return ol.proj.get('EPSG:4326');
};