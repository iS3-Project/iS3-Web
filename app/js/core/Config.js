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
    /**
     * GeoServer url configuration
     */
    /**
     * This url is for local testing
     * @type {string}
     */
    // this.server = 'http://localhost:8080/geoserver';

    /**
     * This url is for server in room 802
     * @type {string}
     */
    // this.server = 'http://10.21.0.43:9090/geoserver';

    /**
     * This url is for 5th floor machine
     * @type {string}
     */
    // this.server = 'http://172.18.54.142:9090/geoserver';

    /**
     * This url is for remote server of boundless
     * @type {string}
     */
    // this.server = 'http://demo.opengeo.org/geoserver';

    /**
     * Language configruration
     * @type {iS3.langEN}
     * @type {iS3.langCN}
     */
    // this.lang = new iS3.langEN();
    // this.lang = new iS3.langCN();

    /**
     * Project definition
     * @type {iS3.projectDef}
     */
    // this.projectDef = new iS3.projectDef.SHML12();

    var json = options.json;
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