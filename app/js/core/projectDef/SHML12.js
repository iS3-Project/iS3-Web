/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals iS3Project */
/* globals ol */

/**
 * Construction function
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.ProjectDef.SHML12 = function (options) {
    iS3.ProjectDef.call(this, options);
};
iS3.inherits(iS3.ProjectDef.SHML12, iS3.ProjectDef);

/**
 * Initialize
 */
iS3.ProjectDef.prototype.init = function () {
    this.addLayers();
    this.zoomToLayer();
};

/**
 * Add layers
 */
iS3.ProjectDef.prototype.addLayers = function () {
    var server = iS3Project.getConfig().server;
    var map = iS3Project.getMap();

    var layerSta = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: server + '/wms',
            params: {
                LAYERS: 'iS3:des_sta',
                FORMAT: 'image/png',
                VERSION: '1.1.0'
            },
            wrapX: false
        })
    });
    layerSta.set('id', server + ':' + 'iS3:des_sta');
    map.addLayer(layerSta);

    var layerBor = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: server + '/wms',
            params: {
                LAYERS: 'iS3:des_bhl',
                FORMAT: 'image/png',
                VERSION: '1.1.0'
            },
            wrapX: false
        })
    });
    layerBor.set('id', server + ':' + 'iS3:des_bhl');
    map.addLayer(layerBor);

    var layerTun = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: server + '/wms',
            params: {
                LAYERS: 'iS3:des_tun',
                FORMAT: 'image/png',
                VERSION: '1.1.0'
            },
            wrapX: false
        })
    });
    layerTun.set('id', server + ':' + 'iS3:des_tun');
    map.addLayer(layerTun);

    var layerRing = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: server + '/wms',
            params: {
                LAYERS: 'iS3:des_rin',
                FORMAT: 'image/png',
                VERSION: '1.1.0'
            },
            wrapX: false
        })
    });
    layerRing.set('id', server + ':' + 'iS3:des_rin');
    map.addLayer(layerRing);
};

/**
 * Zoom to layer
 */
iS3.ProjectDef.prototype.zoomToLayer = function () {
    var map = iS3Project.getMap();
    var extent = [13522906, 3664742, 13524657, 3665575.75];
    map.getView().fit(extent, map.getSize());
};
