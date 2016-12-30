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
 * @param {Object} options Options
 * @constructor
 */
iS3.toolbar.Projection = function (options) {

    var thisCpy = this;
    var projSwitcher = document.createElement('select');
    var plateCarree = document.createElement('option');
    plateCarree.value = 'EPSG:4326';
    plateCarree.textContent = 'EPSG:4326';
    projSwitcher.appendChild(plateCarree);
    var webMercator = document.createElement('option');
    webMercator.value = 'EPSG:3857';
    webMercator.textContent = 'EPSG:3857';
    projSwitcher.appendChild(webMercator);
    projSwitcher.addEventListener('change', function (evt) {
        var view = thisCpy.getMap().getView();
        var oldProj = view.getProjection();
        var newProj = ol.proj.get(this.value);
        var newView = new ol.View({
            center: ol.proj.transform(view.getCenter(), oldProj, newProj),
            zoom: view.getZoom(),
            projection: newProj,
            extent: newProj.getExtent()
        });
        thisCpy.getMap().setView(newView);
        thisCpy.getMap().getLayers().forEach(function (layer) {
            thisCpy.changeLayerProjection(layer, oldProj, newProj);
        });
    });
    ol.control.Control.call(this, {
        element: projSwitcher,
        target: options.target
    });
    this.set('element', projSwitcher);
};
ol.inherits(iS3.toolbar.Projection, ol.control.Control);

/**
 * Set map
 *
 * @param {ol.map} map Map
 */
iS3.toolbar.Projection.prototype.setMap = function (map) {
    ol.control.Control.prototype.setMap.call(this, map);
    if (map !== null) {
        this.get('element').value = map.getView().getProjection().getCode();
    }
};

/**
 * Change layer projection
 *
 * @param {ol.layer} layer Layer
 * @param {pl.projection} oldProj Old projection
 * @param {pl.projection} newProj New projection
 */
iS3.toolbar.Projection.prototype.changeLayerProjection = function (layer, oldProj, newProj) {
    if (layer instanceof ol.layer.Group) {
        layer.getLayers().forEach(function (subLayer) {
            this.changeLayerProjection(subLayer, oldProj, newProj);
        });
    } else if (layer instanceof ol.layer.Tile) {
        var tileLoadFunc = layer.getSource().getTileLoadFunction();
        layer.getSource().setTileLoadFunction(tileLoadFunc);
    } else if (layer instanceof ol.layer.Vector) {
        var features = layer.getSource().getFeatures();
        for (var i = 0; i < features.length; i += 1) {
            features[i].getGeometry().transform(oldProj, newProj);
        }
    }
};