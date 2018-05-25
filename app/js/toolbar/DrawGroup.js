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
iS3.toolbar.DrawGroup = function (options) {
    iS3.ToolGroup.call(this, options);

    this.layertree = options.parentObj.layertree;
    this.init();
};
iS3.inherits(iS3.toolbar.DrawGroup, iS3.ToolGroup);

/**
 * Initialization function
 */
iS3.toolbar.DrawGroup.prototype.init = function () {
    var thisCpy = this;
    var layertree = this.layertree;
    this.activeFeatures = new ol.Collection();

    layertree.selectEventEmitter.on('change', function () {
        var layer = layertree.getLayerById(layertree.selectedLayer.id);
        if (layer instanceof ol.layer.Vector) {
            this.getTools().forEach(function (control) {
                control.setDisabled(false);
            });
            var layerType = layer.get('type');
            if (!layerType) {
                thisCpy.getTools()[3].setDisabled(true).set('active', false);
                thisCpy.getTools()[4].setDisabled(true).set('active', false);
            }
            if (layerType !== 'point' && layerType !== 'geomcollection') {
                thisCpy.getTools()[0].setDisabled(true).set('active', false);
            }
            if (layerType !== 'line' && layerType !== 'geomcollection') {
                thisCpy.getTools()[1].setDisabled(true).set('active', false);
            }
            if (layerType !== 'polygon' && layerType !== 'geomcollection') {
                thisCpy.getTools()[2].setDisabled(true).set('active', false);
            }
            setTimeout(function () {
                thisCpy.activeFeatures.clear();
                thisCpy.activeFeatures.extend(layer.getSource().getFeatures());
            }, 0);
        } else {
            this.getTools().forEach(function (control) {
                control.set('active', false);
                control.setDisabled(true);
            });
        }
    }, this);

    this.loadDrawPoint().loadDrawLine().loadDrawPolygon().loadRemoveFeature().loadDragFeature();
};

/**
 * Load draw point
 *
 * @return {iS3.toolbar.DrawGroup}
 */
iS3.toolbar.DrawGroup.prototype.loadDrawPoint = function () {
    var drawPoint = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.addPointsTip,
        className: 'ol-addpoint',
        interaction: ol.control.Interaction.handleEvents(this, new ol.interaction.Draw({
            type: 'Point',
            snapTolerance: 1
        }), 'point')
    }).setDisabled(true);
    drawPoint.id = 'drawPoint';
    this.add(drawPoint);
    return this;
};

/**
 * Load draw line
 *
 * @return {iS3.toolbar.DrawGroup}
 */
iS3.toolbar.DrawGroup.prototype.loadDrawLine = function () {
    var drawLine = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.addLinesTip,
        className: 'ol-addline',
        interaction: ol.control.Interaction.handleEvents(this, new ol.interaction.Draw({
            type: 'LineString',
            snapTolerance: 1
        }), 'line')
    }).setDisabled(true);
    drawLine.id = 'drawLine';
    this.add(drawLine);
    return this;
};

/**
 * Load draw polygon
 *
 * @return {iS3.toolbar.DrawGroup}
 */
iS3.toolbar.DrawGroup.prototype.loadDrawPolygon = function () {
    var drawPolygon = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.addPolygonsTip,
        className: 'ol-addpolygon',
        interaction: ol.control.Interaction.handleEvents(this, new ol.interaction.Draw({
            type: 'Polygon',
            snapTolerance: 1
        }), 'polygon')
    }).setDisabled(true);
    drawPolygon.id = 'drawPolygon';
    this.add(drawPolygon);
    return this;
};

/**
 * Load remove feature
 *
 * @return {iS3.toolbar.DrawGroup}
 */
iS3.toolbar.DrawGroup.prototype.loadRemoveFeature = function () {
    var removeFeature = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.removeFeaturesTip,
        className: 'ol-removefeat',
        interaction: new ol.interaction.RemoveFeature({
            features: this.activeFeatures
        })
    }).setDisabled(true);
    removeFeature.id = 'removeFeature';
    this.add(removeFeature);
    return this;
};

/**
 * Load drag feature
 */
iS3.toolbar.DrawGroup.prototype.loadDragFeature = function () {
    var dragFeature = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.dragFeaturesTip,
        className: 'ol-dragfeat',
        interaction: new ol.interaction.DragFeature({
            features: this.activeFeatures
        })
    }).setDisabled(true);
    dragFeature.id = 'dragFeature';
    this.add(dragFeature);
};

/**
 * Remove feature
 *
 * @param {Object} options Options
 * @constructor
 */
ol.interaction.RemoveFeature = function (options) {
    ol.interaction.Pointer.call(this, {
        handleDownEvent: function (evt) {
            this.set('deleteCandidate', evt.map.forEachFeatureAtPixel(evt.pixel,
                function (feature, layer) {
                    if (this.get('features').getArray().indexOf(feature) !== -1) {
                        return feature;
                    }
                }, this
            ));
            return !!this.get('deleteCandidate');
        },
        handleUpEvent: function (evt) {
            evt.map.forEachFeatureAtPixel(evt.pixel,
                function (feature, layer) {
                    if (feature === this.get('deleteCandidate')) {
                        layer.getSource().removeFeature(feature);
                        this.get('features').remove(feature);
                    }
                }, this
            );
            this.set('deleteCandidate', null);
        }
    });
    this.setProperties({
        features: options.features,
        deleteCandidate: null
    });
};
ol.inherits(ol.interaction.RemoveFeature, ol.interaction.Pointer);

/**
 * Drag feature
 *
 * @param {Object} options Options
 * @constructor
 */
ol.interaction.DragFeature = function (options) {
    ol.interaction.Pointer.call(this, {
        handleDownEvent: function (evt) {
            this.set('draggedFeature', evt.map.forEachFeatureAtPixel(evt.pixel,
                function (feature, layer) {
                    if (this.get('features').getArray().indexOf(feature) !== -1) {
                        return feature;
                    }
                }, this
            ));
            if (this.get('draggedFeature')) {
                this.set('coords', evt.coordinate);
            }
            return !!this.get('draggedFeature');
        },
        handleDragEvent: function (evt) {
            var deltaX = evt.coordinate[0] - this.get('coords')[0];
            var deltaY = evt.coordinate[1] - this.get('coords')[1];
            this.get('draggedFeature').getGeometry().translate(deltaX, deltaY);
            this.set('coords', evt.coordinate);
        },
        handleUpEvent: function (evt) {
            this.setProperties({
                coords: null,
                draggedFeature: null
            });
        }
    });
    this.setProperties({
        features: options.features,
        coords: null,
        draggedFeature: null
    });
};
ol.inherits(ol.interaction.DragFeature, ol.interaction.Pointer);
