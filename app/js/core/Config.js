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
iS3.Config = function (options) {

    var json = options.config || null;

    if (!json) {
        return;
    }
    this.server = json['server'];
    this.proxy = json['proxy'];

    switch (json['lang']) {
        case 'CN':
            this.lang = new iS3.LangCN();
            break;
        case 'EN':
            this.lang = new iS3.LangEN();
            break;
        default:
            break;
    }
};