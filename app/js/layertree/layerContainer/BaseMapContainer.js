/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */

/**
 * Construction function
 *
 * @param {Object} options Options
 * @constructor
 */
iS3.layertree.BaseMapContainer = function (options) {
    iS3.layertree.basicContainer.call(this, options);
};
iS3.inherits(iS3.layertree.BaseMapContainer, iS3.layertree.BasicContainer);

/**
 * Initial function
 *
 * @return {Element} Container
 */
iS3.layertree.BaseMapContainer.prototype.init = function () {
    this.enableDraggable().addLayerTitle().addVisibleCheckbox().addOpacityBar();
    return this.container;
};
