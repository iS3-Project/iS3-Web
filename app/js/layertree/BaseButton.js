/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals ol */

/**
 * Construction function
 *
 * @param {Object} options Options
 * @constructor
 */
iS3.layertree.BaseButton = function (options) {

    var buttonElem = document.createElement('button');
    buttonElem.className = options.elemName;
    buttonElem.title = options.elemTitle;

    this.button = buttonElem;
};
