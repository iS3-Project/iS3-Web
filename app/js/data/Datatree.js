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

    this.selectedTree = null;
    this.selectEventEmitter = new ol.Observable();

    this.init();
};

/**
 * Initialization function
 */
iS3.datatree.Datatree.prototype.init = function () {
    var thisCpy = this;
    if(iS3Project.domains == null) return;

    if (Object.keys(iS3Project.domains).length === 0) {
        this.createExampleTree();
        return;
    }

    var active = true;

    for (var key in iS3Project.domains) {
        this.createTreePanel(iS3Project.domains[key], active);
        active = false;
    }

    var tabDiv = document.createElement('div');
    tabDiv.setAttribute('class', 'ui mini bottom attached tabular menu');
    tabDiv.setAttribute('id', 'datatree-container');
    this.containerDiv.appendChild(tabDiv);

    var active = true;

    for (var key in iS3Project.domains) {
        this.createTab(iS3Project.domains[key], active);
        this.createTree(iS3Project.domains[key]);
        active = false;
    }

    thisCpy.selectEventEmitter.on('change', function () {
        console.log(thisCpy.selectedTree.Name);
    }, thisCpy);

    $('.menu .item').tab();

};

iS3.datatree.Datatree.prototype.createTreePanel = function(domain, active) {
    var thisCpy = this;

    var tabItemDiv = document.createElement('div');
    if (active)
        tabItemDiv.setAttribute('class', 'semantic-full ui mini top attached tab segment active');
    else
        tabItemDiv.setAttribute('class', 'semantic-full ui mini top attached tab segment');
    tabItemDiv.setAttribute('data-tab', domain.name);
    tabItemDiv.setAttribute('id', 'datatree-' + domain.name);
    thisCpy.containerDiv.appendChild(tabItemDiv);
};

iS3.datatree.Datatree.prototype.createTab = function(domain, active) {
    var tabDiv = document.getElementById('datatree-container');

    var item = document.createElement('div');
    if (active)
        item.setAttribute('class', 'semantic-menu item active');
    else
        item.setAttribute('class', 'semantic-menu item');
    item.setAttribute('data-tab', domain.name);
    item.textContent = domain.name;
    tabDiv.appendChild(item);
};

iS3.datatree.Datatree.prototype.createTree = function(domain) {
    var thisCpy = this;
    $('#datatree-' + domain.name).jstree({
        "core": {
            "animation" : 200,
            "check_callback": true,
            "data": false
        }
    });

    $('#datatree-' + domain.name).bind(
        "select_node.jstree", function(evt, data){
            thisCpy.selectedTree = data.node.original.refTree;
            thisCpy.selectEventEmitter.changed();
        }
    );

    this.createNode(domain.name, '#', domain.root);
};

iS3.datatree.Datatree.prototype.createNode = function(name, parent, root) {
    if (root === null) return;

    var id = $('#datatree-' + name).jstree().create_node(parent, {
        "text": root.DisplayName,
        "icon" : 'sitemap icon',
        "state" : {"opened" : true },
        "refTree" : root
    }, "last", function() {

    });

    if (root.Children.length === 0) return;
    for (var key in root.Children) {
        this.createNode(name, id, root.Children[key]);
    }
};

iS3.datatree.Datatree.prototype.createExampleTree = function() {
    var thisCpy = this;

    var tabItemDiv = document.createElement('div');
    tabItemDiv.setAttribute('class', 'semantic-full ui mini top attached tab segment active');
    tabItemDiv.setAttribute('data-tab', 'first');
    tabItemDiv.setAttribute('id', 'dt-geo');
    thisCpy.containerDiv.appendChild(tabItemDiv);

    var tabItemDiv2 = document.createElement('div');
    tabItemDiv2.setAttribute('class', 'semantic-full ui mini top attached tab segment');
    tabItemDiv2.setAttribute('data-tab', 'second');
    tabItemDiv2.setAttribute('id', 'dt-str');
    thisCpy.containerDiv.appendChild(tabItemDiv2);

    var tabDiv = document.createElement('div');
    tabDiv.setAttribute('class', 'ui mini bottom attached tabular menu');
    thisCpy.containerDiv.appendChild(tabDiv);

    var item1 = document.createElement('div');
    item1.setAttribute('class', 'semantic-menu item active');
    item1.setAttribute('data-tab', 'first');
    item1.textContent = 'Empty';
    tabDiv.appendChild(item1);

    var item2 = document.createElement('div');
    item2.setAttribute('class', 'semantic-menu item');
    item2.setAttribute('data-tab', 'second');
    item2.textContent = 'Empty2';
    tabDiv.appendChild(item2);

    $('.menu .item')
        .tab()
    ;

    $(function() {
        $('#dt-geo').jstree({
            'core' : {
                "animation" : 200,
                'data' : [
                    {   "text" : "Empty Root",
                        "icon" : "sitemap icon",
                        "state" : {"opened" : true },
                        "children" : [
                            { "text" : "Empty child 1", "icon" : 'anchor icon'},
                            { "text" : "Empty child 2", "icon" : 'anchor icon'}
                        ]
                    }
                ]
            },
            "plugins" : ["wholerow"]
        });
    });

    $(function() {
        $('#dt-str').jstree({
            'core' : {
                "animation" : 200,
                'data' : [
                    {   "text" : "Empty Root",
                        "icon" : "sitemap icon",
                        "state" : {"opened" : true },
                        "children" : [
                            { "text" : "Empty child 3", "icon" : 'anchor icon'},
                            { "text" : "Empty child 4", "icon" : 'anchor icon'}
                        ]
                    }
                ]
            },
            "plugins" : ["wholerow"]
        });
    });
};
