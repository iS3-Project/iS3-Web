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
iS3.toolbar = function (options) {

};

/**
 * Construction function
 *
 * @param {Object} options Options
 * @constructor
 */
iS3.toolbar.Toolbar = function (options) {
    'use strict';

    if (!(this instanceof iS3.toolbar.Toolbar)) {
        throw new Error('toolBar must be constructed with the new keyword.');
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
    this.buttons = options.buttons;
    this.containerDiv = document.getElementById(options.target);
    this.layertree = options.parentObj.getLayertree();
    this.message = options.parentObj.getMessage();
    this.groups = new iS3.ToolGroupCollection({});

    this.init();
};

/**
 * Initialization function
 */
iS3.toolbar.Toolbar.prototype.init = function () {
    var thisCpy = this;
    this.buttons.forEach(function (name) {
        thisCpy.addGroup(name);
    });
};

/**
 * Add group
 *
 * @param {string} name Name
 * @return {boolean} Success
 */
iS3.toolbar.Toolbar.prototype.addGroup = function (name) {
    var lang = iS3Project.getConfig().lang;

    switch (name) {
        case 'zoomGroup':
            this.addToolGroup(new iS3.toolbar.Toolbar.ZoomGroup({
                parentObj: this,
                id: 'zoomGroup',
                name: lang.zoomGroupName
            }));
            break;
        case 'selectGroup':
            this.addToolGroup(new iS3.toolbar.Toolbar.SelectGroup({
                parentObj: this,
                id: 'selectGroup',
                name: lang.selectGroupName
            }));
            break;
        case 'drawGroup':
            this.addToolGroup(new iS3.toolbar.Toolbar.DrawGroup({
                parentObj: this,
                id: 'drawGroup',
                name: lang.drawGroupName
            }));
            break;
        case 'measureGroup':
            this.addToolGroup(new iS3.toolbar.Toolbar.MeasureGroup({
                parentObj: this,
                id: 'measureGroup',
                name: lang.measureGroupName
            }));
            break;
        case 'queryGroup':
            this.addToolGroup(new iS3.toolbar.Toolbar.QueryGroup({
                parentObj: this,
                id: 'queryGroup',
                name: lang.queryGroupName
            }));
            break;
        case 'customGroup':
            this.addToolGroup(new iS3.toolbar.Toolbar.CustomGroup({
                parentObj: this,
                id: 'customGroup',
                name: lang.customGroupName
            }));
            break;
        case 'testGroup':
            this.addToolGroup(new iS3.toolbar.Toolbar.TestGroup({parentObj: this, id: 'testGroup', name: 'test'}));
            break;
        default:
            return false;
    }
};

/**
 * Add control to map
 *
 * @param {ol.control.Control} control Control
 * @return {iS3.toolbar.Toolbar} Return toolbar
 */
iS3.toolbar.Toolbar.prototype.addControl = function (control) {
    if (!(control instanceof ol.control.Control)) {
        throw new Error('Only controls can be added to the toolbar.');
    }
    if (control.get('type') === 'toggle') {
        control.on('change:active', function () {
            if (control.get('active')) {
                this.groups.getAllTools().forEach(function (controlToDisable) {
                    if (controlToDisable.get('type') === 'toggle' && controlToDisable !== control) {
                        controlToDisable.set('active', false);
                    }
                });
            }
        }, this);
    }
    control.setTarget(this.containerDiv);
    this.map.addControl(control);
    return this;
};

/**
 * Remove control from map
 *
 * @param {ol.control.Control} control Control
 * @return {iS3.toolbar.Toolbar} Return toolbar
 */
iS3.toolbar.Toolbar.prototype.removeControl = function (control) {
    this.controls.remove(control);
    this.map.removeControl(control);
    return this;
};

/**
 * Add tool group
 *
 * @param {iS3.ToolGroup} group Group
 * @return {iS3.toolbar.Toolbar} Return toolbar
 */
iS3.toolbar.Toolbar.prototype.addToolGroup = function (group) {
    if (!group || group.getTools().length === 0) {
        return this;
    }
    this.groups.add(group);
    var nameSpan = document.createElement('span');
    nameSpan.className = 'group-name';
    nameSpan.textContent = group.name + ':';
    this.containerDiv.appendChild(nameSpan);
    for (var i = 0; i < group.getTools().length; i++) {
        this.addControl(group.getTools()[i]);
    }
    return this;
};
