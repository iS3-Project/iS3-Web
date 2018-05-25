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
    if(iS3Project.domains == null) return;

    var thisCpy = this;

    var tabItemDiv = document.createElement('div');
    tabItemDiv.setAttribute('class', 'semantic-full ui mini top attached tab segment active');
    tabItemDiv.setAttribute('data-tab', 'first');
    tabItemDiv.setAttribute('id', 'dt-geo');
    thisCpy.containerDiv.appendChild(tabItemDiv);

    var tabDiv = document.createElement('div');
    tabDiv.setAttribute('class', 'ui mini bottom attached tabular menu');
    thisCpy.containerDiv.appendChild(tabDiv);

    var item1 = document.createElement('div');
    item1.setAttribute('class', 'semantic-menu item active');
    item1.setAttribute('data-tab', 'first');
    item1.textContent = 'Geology';
    tabDiv.appendChild(item1);

    $('.menu .item')
        .tab()
    ;

    $(function() {
        $('#dt-geo').jstree({
            'core' : {
                "animation" : 200,
                'data' : [
                    {   "text" : "Root node",
                        "icon" : "sitemap icon",
                        "state" : {"opened" : true },
                        "children" : [
                        { "text" : "Child node 1", "icon" : 'anchor icon'},
                        { "text" : "Child node 2", "icon" : 'anchor icon'}
                    ]
                    }
                ]
            },
            "plugins" : ["wholerow"]
        });
    });
};
