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
iS3.toolbar.TestGroup = function (options) {

    iS3.ToolGroup.call(this, options);

    this.parentObj = options.parentObj;
    this.layertree = options.parentObj.layertree;
    this.init();
};
iS3.inherits(iS3.toolbar.TestGroup, iS3.ToolGroup);

/**
 * Initialization function
 */
iS3.toolbar.TestGroup.prototype.init = function () {
    var layertree = this.layertree;

    this.loadTest();
};

/**
 * Load test
 *
 * @return {iS3.toolbar.TestGroup} Group
 */
iS3.toolbar.TestGroup.prototype.loadTest = function () {
    var thisCpy = this;
    var test = new iS3.toolbar.BasicControl({
        label: 'T',
        tipLabel: 'Test',
        className: 'iS3-test ol-unselectable ol-control',
        trigger: function () {
            thisCpy.test(thisCpy.layertree);
        }
    });
    test.id = 'test';
    this.add(test);
    return this;
};

/**
 * Test function
 *
 * @param {ol.layertree.Layertree} layertree Layertree
 */
iS3.toolbar.TestGroup.prototype.test = function (layertree) {
    var layer = layertree.getLayerById(layertree.selectedLayer.id);
    var features = layer.getSource().getFeatures();
    var panob = new iS3.format.PanotimeB();
    var json = panob.toJson(features);
    /*
    $.post('http://localhost/v1/test', {
        json: json
    });
    */
    console.log(json);
};
