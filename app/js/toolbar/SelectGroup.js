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
iS3.toolbar.SelectGroup = function (options) {

    iS3.ToolGroup.call(this, options);

    this.parentObj = options.parentObj;
    this.layertree = options.parentObj.layertree;
    this.init();
};
iS3.inherits(iS3.toolbar.SelectGroup, iS3.ToolGroup);

/**
 * Initialization function
 */
iS3.toolbar.SelectGroup.prototype.init = function () {
    var layertree = this.layertree;
    this.selectInteraction = new ol.interaction.Select({
        style: iS3.style.getDefaultSelected(),
        layers: function (layer) {
            if (layertree.selectedLayer) {
                if (layer === layertree.getLayerById(layertree.selectedLayer.id)) {
                    return true;
                }
            }
            return false;
        },
        wrapX: false
    });
    this.parentObj.map.addInteraction(this.selectInteraction);
    this.selectInteraction.setActive(false);
    this.parentObj.selectInteraction = this.selectInteraction;

    layertree.selectEventEmitter.on('change', function () {
        var layer = layertree.getLayerById(layertree.selectedLayer.id);
        if (layer instanceof ol.layer.Vector) {
            this.getTools()[0].setDisabled(false);
        } else {
            this.getTools()[0].set('active', false);
            this.getTools()[0].setDisabled(true);
        }
    }, this);

    this.loadSingleSelect().loadBoxSelect().loadPolygonSelect().loadDeselect();
};

/**
 * Load single select
 *
 * @return {iS3.toolbar.SelectGroup} Group
 */
iS3.toolbar.SelectGroup.prototype.loadSingleSelect = function () {
    var selectSingle = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.clickSelectTip,
        className: 'ol-singleselect ol-unselectable ol-control',
        interaction: this.selectInteraction
    }).setDisabled(true);
    selectSingle.id = 'singleSelect';
    this.add(selectSingle);
    return this;
};

/**
 * Load box select
 *
 * @return {iS3.toolbar.SelectGroup} Group
 */
iS3.toolbar.SelectGroup.prototype.loadBoxSelect = function () {
    var layertree = this.layertree;
    var thisCpy = this;
    var boxInteraction = new ol.interaction.DragBox();
    var selectMulti = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.boxSelectTip,
        className: 'ol-multiselect ol-unselectable ol-control',
        interaction: boxInteraction
    });
    selectMulti.id = 'boxSelect';
    boxInteraction.on('boxend', function (evt) {
        thisCpy.selectInteraction.getFeatures().clear();
        var extent = boxInteraction.getGeometry().getExtent();
        if (this.layertree.selectedLayer) {
            var source = layertree.getLayerById(layertree.selectedLayer.id).getSource();
            if (source instanceof ol.source.Vector) {
                source.forEachFeatureIntersectingExtent(extent, function (feature) {
                    thisCpy.selectInteraction.getFeatures().push(feature);
                });
            } else if (source instanceof ol.source.Tile) {
                var layerDef = layertree.getLayerDefById(layertree.selectedLayer.id);
                iS3.geoRequest.bboxFeaturesFromTile(layerDef, extent,
                    function (features) {
                        for (var i = 0; i < features.length; i++) {
                            var geomentryBox = boxInteraction.getGeometry();
                            if (iS3.topology.polyIntersectsPoly(geomentryBox, features[i].getGeometry()) === true) {
                                thisCpy.selectInteraction.getFeatures().push(features[i]);
                            }
                        }
                    });
            }
        }
    }, this);
    this.add(selectMulti);
    return this;
};

/**
 * Load polygon select
 *
 * @return {iS3.toolbar.SelectGroup} Group
 */
iS3.toolbar.SelectGroup.prototype.loadPolygonSelect = function () {
    var layertree = this.layertree;
    var thisCpy = this;
    var polygonDraw = new ol.interaction.Draw({
        type: 'Polygon',
        snapTolerance: 1
    });
    var polygonSelect = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.polygonSelectTip,
        className: 'ol-polygonselect ol-unselectable ol-control',
        interaction: polygonDraw
    });
    polygonSelect.id = 'polygonSelect';

    polygonDraw.on('drawend', function (evt) {
        thisCpy.selectInteraction.getFeatures().clear();
        if (!layertree.selectedLayer) {
            return;
        }
        var extent = evt.feature.getGeometry().getExtent();
        var geomDraw = evt.feature.getGeometry();
        var selectedSource = layertree.getLayerById(layertree.selectedLayer.id).getSource();
        if (selectedSource instanceof ol.source.Vector) {
            selectedSource.forEachFeatureInExtent(extent, function (f) {
                if (iS3.topology.polyIntersectsPoly(geomDraw, f.getGeometry()) === true) {
                    thisCpy.selectInteraction.getFeatures().push(f);
                }
            });
        } else if (selectedSource instanceof ol.source.Tile) {
            var layerDef = layertree.getLayerDefById(layertree.selectedLayer.id);

            iS3.geoRequest.polygonFeaturesFromTile(layerDef, geomDraw).done(function (features) {
                for (var i = 0; i < features.length; i++) {
                    thisCpy.selectInteraction.getFeatures().push(features[i]);
                }
            });
        }
    }, this);
    this.add(polygonSelect);
    return this;
};

/**
 * Load deselect
 *
 * @return {iS3.toolbar.SelectGroup} Group
 */
iS3.toolbar.SelectGroup.prototype.loadDeselect = function () {
    var thisCpy = this;
    var deselectControl = new iS3.toolbar.BasicControl({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.removeSelectionTip,
        className: 'ol-deselect ol-unselectable ol-control',
        trigger: function () {
            thisCpy.selectInteraction.getFeatures().clear();
        }
    });
    deselectControl.id = 'deselect';
    this.add(deselectControl);
    return this;
};
