/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals ol */

var iS3Project = window.iS3Project;

/**
 * Construction function
 *
 * @param {Array} options Options
 * @constructor
 */
function iS3(options) {

}

/**
 * Construction function
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.Project = function (options) {

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
    this._config = new iS3.Config({json: options.config});

    iS3Project = this;
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
    if (layertree instanceof iS3.layertree) {
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
    if (toolbar instanceof iS3.toolbar) {
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