/**
 * Created by linxd on 2018/5/20.
 */

iS3.datatree = function (options) {

};

/**
 * Construction function
 *
 * @param {Object} options Options
 * @constructor
 */
iS3.datatree.Datatree = function (options) {
    'use strict';

    if (!(this instanceof iS3.datatree.Datatree)) {
        throw new Error('datatree must be constructed with the new keyword.');
    } else if (typeof options === 'object' && options.parentObj && options.target) {
        if (!(options.parentObj.getMap() instanceof ol.Map)) {
            throw new Error('Please provide a valid OpenLayers 3 map object.');
        }
        var div = document.getElementById(options.target);
        if (div === null || div.nodeType !== 1) {
            throw new Error('Please provide a valid element id.');
        }
    } else {
        throw new Error('Invalid parameter(s) provided.');
    }

    this.map = options.parentObj.getMap();
    this.containerDiv = document.getElementById(options.target);
    this.layertree = options.parentObj.getLayertree();
    this.message = options.parentObj.getMessage();

    this.init();
};

/**
 * Initialization function
 */
iS3.datatree.Datatree.prototype.init = function () {
    var thisCpy = this;

};
