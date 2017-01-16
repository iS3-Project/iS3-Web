/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals ol */

iS3.style = function () {

};

iS3.style.componentToHex = function (c) {
    var hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

iS3.style.rgbToHex = function (r, g, b) {
    return '#' + iS3.style.componentToHex(r) + iS3.style.componentToHex(g) + iS3.style.componentToHex(b);
};

iS3.style.hexToRgb = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

var defaultStyle;

iS3.style.getDefault = function () {
    if (defaultStyle) {
        return defaultStyle;
    }
    var fill = new ol.style.Fill({
        color: 'rgba(255,255,255,0.4)'
    });
    var stroke = new ol.style.Stroke({
        color: '#3399CC',
        width: 1.0
    });
    var fill2 = new ol.style.Fill({
        color: 'rgba(0,0,0,1.0)'
    });
    var stroke2 = new ol.style.Stroke({
        color: 'rgba(0,0,0,1.0)',
        width: 0.1
    });
    return defaultStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: fill2,
            stroke: stroke2,
            radius: 2
        }),
        fill: fill,
        stroke: stroke
    });
};

var defaultSelectedStyle;

iS3.style.getDefaultSelected = function () {
    if (defaultSelectedStyle) {
        return defaultSelectedStyle;
    }
    var fill = new ol.style.Fill({
        color: 'rgba(255,255,255,0.4)'
    });
    var stroke = new ol.style.Stroke({
        color: '#3399CC',
        width: 2.0
    });

    var fill2 = new ol.style.Fill({
        color: '#1E90FF'
    });
    var stroke2 = new ol.style.Stroke({
        color: 'rgba(255,255,255,0.4)',
        width: 0.1
    });
    return defaultSelectedStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: fill2,
            stroke: stroke2,
            radius: 5
        }),
        fill: fill,
        stroke: stroke
    });
};

var transparentStyle;

iS3.style.getTransparent = function () {
    if (transparentStyle) {
        return transparentStyle;
    }
    return transparentStyle = new ol.style.Style();
};

iS3.style.getHighlight = function (color) {
    var fill = new ol.style.Fill({
        color: color
    });
    var rgb = iS3.style.hexToRgb(color);
    var bufferstroke = new ol.style.Stroke({
        color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.2)',
        width: 10.0
    });
    var stroke = new ol.style.Stroke({
        color: color,
        width: 2.0
    });
    return new ol.style.Style({
        image: new ol.style.Circle({
            fill: fill,
            stroke: bufferstroke,
            radius: 3
        }),
        fill: fill,
        stroke: stroke
    });
};

iS3.style.getHighlightSelected = function (color) {
    var fill = new ol.style.Fill({
        color: color
    });
    var rgb = iS3.style.hexToRgb('#FF0000');
    var bufferstroke = new ol.style.Stroke({
        color: 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',0.2)',
        width: 10.0
    });
    var highlight = new ol.style.Stroke({
        color: '#FF0000',
        width: 2.0
    });
    return new ol.style.Style({
        image: new ol.style.Circle({
            fill: fill,
            stroke: bufferstroke,
            radius: 3
        }),
        fill: fill,
        stroke: highlight
    });
};

iS3.style.getFill = function (color) {
    return new ol.style.Fill({
        color: color
    });
};

iS3.style.getStroke = function (color, width) {
    return new ol.style.Stroke({
        color: color,
        width: width
    });
};

iS3.style.getCircle = function (fill, stroke, radius) {
    return new ol.style.Circle({
        fill: fill,
        stroke: stroke,
        radius: radius
    });
};

iS3.style.getSquare = function (fill, stroke, radius) {
    return new ol.style.RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: radius,
        rotation: 0,
        angle: Math.PI / 4
    });
};

iS3.style.getTriangle = function (fill, stroke, radius) {
    return new ol.style.RegularShape({
        fill: fill,
        stroke: stroke,
        points: 3,
        radius: radius,
        rotation: 0,
        angle: 0
    });
};

iS3.style.getStar = function (fill, stroke, radius) {
    return new ol.style.RegularShape({
        fill: fill,
        stroke: stroke,
        points: 5,
        radius: radius,
        radius2: radius / 2,
        angle: 0
    });
};

iS3.style.getHexagon = function (fill, stroke, radius) {
    return new ol.style.RegularShape({
        fill: fill,
        stroke: stroke,
        points: 6,
        radius: radius,
        rotation: 0,
        angle: 0
    });
};

iS3.style.getX = function (fill, stroke, radius) {
    return new ol.style.RegularShape({
        fill: fill,
        stroke: stroke,
        points: 4,
        radius: radius,
        radius2: radius / 5,
        angle: Math.PI / 4
    });
};

iS3.style.setTransparent = function (color, transparent) {
    var rgb = iS3.style.hexToRgb(color);
    return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + transparent + ')';
};