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
iS3.toolbar.CustomGroup = function (options) {

    iS3.ToolGroup.call(this, options);

    this.parentObj = options.parentObj;
    this.layertree = options.parentObj.layertree;
    this.init();
};
iS3.inherits(iS3.toolbar.CustomGroup, iS3.ToolGroup);

/**
 * Initialization function
 */
iS3.toolbar.CustomGroup.prototype.init = function () {
    var thisCpy = this;
    var gisQuality = new iS3.toolbar.GisQualityControl(thisCpy.parentObj);
    gisQuality.id = 'gisQuality';
    this.add(gisQuality);
};
