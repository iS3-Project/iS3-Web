/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */

/**
 * Construction function
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.LayerDef = function (options) {

    /**
     * format: server:workspace:layername
     * @type {string}
     */
    this.id = options.id || null;

    /**
     * @type {server}
     */
    this.server = options.server || null;

    /**
     * format: workspace
     * @type {string}
     */
    this.featurePrefix = options.featurePrefix || null;

    /**
     * format: workspace:layername
     * @type {string}
     */
    this.name = options.name || null;

    /**
     * @type {ol.proj.Projection}
     */
    this.projection = options.projection || null;

    /**
     * @type {ol.extent}
     */
    this.extent = options.extent || null;

    this.layertype = options.layertype || null;

    /**
     * format: abazhou_panopoints
     * @type {string}
     */
    this.featureType = options.featureType || null;

    /**
     * format: http://geoserver.org/webgis
     * @type {string}
     */
    this.featureNS = options.featureNS || null;

    this.headers = options.headers || [];
};

iS3.LayerDef.layerType = {
    BASE_MAP: 'basemap',

    // All panotime points of a city
    PANOPOINT: 'panopoint',

    // panotimeB file input
    PANOTIMEB: 'panotimeb',

    // unknown and undefined layer
    UNKNOWN: 'unknown'
};
