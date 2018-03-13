/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals ol */

/**
 * Construction function
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.format.Shapefile = function (options) {

};

/**
 * It will be little different when reading .shapefile.
 * The shape file must include the .shp, .dbf, .prj file
 * and all of them must be packed in .zip file
 * It is first converted to geojson type using a web app, http://ogre.adc4gis.com
 * Then the geojson is converted to features using ol.format.GeoJSON
 *
 * @param {string} source Source
 * @param {Object} options Options
 * @param {Function} callback Callback
 */
iS3.format.Shapefile.prototype.readFeatures = function (source, options, callback) {
    iS3.geoRequest.shapeToGeojson(source, options, function (geojson) {
        var format = new ol.format.GeoJSON();
        var features = format.readFeatures(geojson, {
            dataProjection: options.targetSrs,
            featureProjection: options.targetSrs
        });
        callback(features);
    });
};

/**
 * Shape file write to features
 *
 * @param {ol.feature[]} features Features
 * @param {Object} options Options
 */
iS3.format.Shapefile.prototype.writeFeatures = function (features, options) {
    var jsonParser = new ol.format.GeoJSON();
    iS3.geoRequest.geojsonToShp(jsonParser.writeFeatures(features), 'output', options);
};