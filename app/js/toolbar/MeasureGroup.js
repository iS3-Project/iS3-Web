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
iS3.toolbar.MeasureGroup = function (options) {

    iS3.ToolGroup.call(this, options);

    this.parentObj = options.parentObj;
    this.layertree = options.parentObj.layertree;
    this.init();
};
iS3.inherits(iS3.toolbar.MeasureGroup, iS3.ToolGroup);

/**
 * Initialization function
 */
iS3.toolbar.MeasureGroup.prototype.init = function () {
    this.loadLineStringMeasure().loadPolygonMeasure();
};

/**
 * Format length output.
 *
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
iS3.toolbar.MeasureGroup.formatLength = function (line) {

    // 6378137 is the radius of earth
    var wgs84Sphere = new ol.Sphere(6378137);
    var length = 0;
    var coordinates = line.getCoordinates();
    var sourceProj = iS3Project.getMap().getView().getProjection();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
        var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
        length += wgs84Sphere.haversineDistance(c1, c2);
    }
    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) + ' ' + 'm';
    }
    return output;
};

/**
 * Format area output.
 *
 * @param {ol.geom.Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
iS3.toolbar.MeasureGroup.formatArea = function (polygon) {
    var wgs84Sphere = new ol.Sphere(6378137);
    var sourceProj = iS3Project.getMap().getView().getProjection();
    var geom = /** @type {ol.geom.Polygon} */(polygon.clone().transform(
        sourceProj, 'EPSG:4326'));
    var coordinates = geom.getLinearRing(0).getCoordinates();
    var area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
    }
    return output;
};

/**
 * Create element
 *
 * @return {Element} Element
 */
iS3.toolbar.MeasureGroup.createMeasureTooltipElement = function () {
    var measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-measure-tip';
    return measureTooltipElement;
};

/**
 * Create measure tool tip
 *
 * @param {Element} measureTooltipElement Measure tool element
 * @return {ol.Overlay} Overlay
 */
iS3.toolbar.MeasureGroup.createMeasureTooltip = function (measureTooltipElement) {
    var measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    iS3Project.getMap().addOverlay(measureTooltip);
    return measureTooltip;
};

/**
 * Load line string measure
 *
 * @return {iS3.toolbar.MeasureGroup} Group
 */
iS3.toolbar.MeasureGroup.prototype.loadLineStringMeasure = function () {
    var layertree = this.layertree;

    var lineStringDraw = new ol.interaction.Draw({
        type: 'LineString',
        source: layertree.getDrawingLayer().getSource()
    });
    var lineStringMeasure = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.measureLinestringTip,
        className: 'ol-lineString-measure',
        interaction: lineStringDraw
    });
    lineStringMeasure.id = 'lineStringMeasure';

    var listener;
    var measureTooltipElement;
    var measureTooltip;
    lineStringDraw.on('drawstart', function (evt) {
        measureTooltipElement = iS3.toolbar.MeasureGroup.createMeasureTooltipElement();
        measureTooltip = iS3.toolbar.MeasureGroup.createMeasureTooltip(measureTooltipElement);
        /** @type {ol.Coordinate|undefined} */
        var tipCoord = evt.coordinate;
        listener = evt.feature.getGeometry().on('change', function (evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.LineString) {
                output = iS3.toolbar.MeasureGroup.formatLength(geom);
                tipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tipCoord);
        });

    }, this);

    lineStringDraw.on('drawend', function () {
        measureTooltip.setOffset([0, -7]);
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        measureTooltipElement = iS3.toolbar.MeasureGroup.createMeasureTooltipElement();
        measureTooltip = iS3.toolbar.MeasureGroup.createMeasureTooltip(measureTooltipElement);
        ol.Observable.unByKey(listener);
    }, this);

    lineStringMeasure.on('change:active', function () {
        if (!this.get('active')) {
            layertree.map.getOverlays().clear();
            layertree.getDrawingLayer().getSource().clear();
        }
    });
    this.add(lineStringMeasure);
    return this;
};

/**
 * Load polygon measure
 *
 * @return {iS3.toolbar.MeasureGroup} Group
 */
iS3.toolbar.MeasureGroup.prototype.loadPolygonMeasure = function () {
    var layertree = this.layertree;
    var thisCpy = this;

    var polygonDraw = new ol.interaction.Draw({
        type: 'Polygon',
        source: layertree.getDrawingLayer().getSource()
    });
    var polygonMeasure = new ol.control.Interaction({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.measurePolygonTip,
        className: 'ol-polygon-measure',
        interaction: polygonDraw
    });
    polygonMeasure.id = 'polygonMeasure';

    var listener;
    var measureTooltipElement;
    var measureTooltip;
    polygonDraw.on('drawstart', function (evt) {
        measureTooltipElement = iS3.toolbar.MeasureGroup.createMeasureTooltipElement();
        measureTooltip = iS3.toolbar.MeasureGroup.createMeasureTooltip(measureTooltipElement);
        /** @type {ol.Coordinate|undefined} */
        var tipCoord = evt.coordinate;
        listener = evt.feature.getGeometry().on('change', function (evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.Polygon) {
                output = iS3.toolbar.MeasureGroup.formatArea(geom);
                tipCoord = geom.getInteriorPoint().getCoordinates();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tipCoord);
        });

    }, this);

    polygonDraw.on('drawend', function () {
        measureTooltip.setOffset([0, -7]);
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        measureTooltipElement = iS3.toolbar.MeasureGroup.createMeasureTooltipElement();
        measureTooltip = iS3.toolbar.MeasureGroup.createMeasureTooltip(measureTooltipElement);
        ol.Observable.unByKey(listener);
    }, this);

    polygonMeasure.on('change:active', function () {
        if (!this.get('active')) {
            layertree.map.getOverlays().clear();
            layertree.getDrawingLayer().getSource().clear();
        }
    });
    this.add(polygonMeasure);
    return this;
};
