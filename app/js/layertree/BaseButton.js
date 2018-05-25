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
    buttonElem.className = 'ui button';
    // buttonElem.title = options.elemTitle;
    buttonElem.setAttribute('data-tooltip', options.elemTitle || 'Custom interaction');
    buttonElem.setAttribute('data-position', 'bottom left');
    buttonElem.setAttribute('data-variation', 'mini');

    var icon = document.createElement('i');
    var iconName = null;
    if (options.elemName == 'addwms')
        iconName = 'th icon';
    if (options.elemName == 'addwfs')
        iconName = 'clone icon';
    if (options.elemName == 'newlayer')
        iconName = 'plus icon';
    if (options.elemName == 'addinput')
        iconName = 'upload icon';
    if (options.elemName == 'outputlayer')
        iconName = 'download icon';
    if (options.elemName == 'deletelayer')
        iconName = 'trash icon';

    icon.className = iconName;

    buttonElem.appendChild(icon);
    this.button = buttonElem;
};
