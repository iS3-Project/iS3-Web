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
iS3.ToolGroup = function (options) {

    if (!options.hasOwnProperty('id')) {
        throw new Error('Please provide id of a tool group.');
    }

    this._id = options.id;
    this._tools = [];
    this.name = options.name || 'unnamed';
};

/**
 * Add tool to group
 *
 * @param {ol.control.Control} tool Tool
 */
iS3.ToolGroup.prototype.add = function (tool) {
    if (!tool.hasOwnProperty('id')) {
        throw new Error('The added tool should has an id attribute.');
    }
    if (this.getTools().hasOwnProperty(tool.id)) {
        throw new Error('The id of added tool is existed.');
    }
    this.getTools().push(tool);
};

/**
 * Get id
 *
 * @return {string} id
 */
iS3.ToolGroup.prototype.getId = function () {
    return this._id;
};

/**
 * Get tools
 *
 * @return {Array}
 */
iS3.ToolGroup.prototype.getTools = function () {
    return this._tools;
};

/**
 * Construction function
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.ToolGroupCollection = function (options) {
    this._groups = [];
};

/**
 * Add group
 *
 * @param {iS3.ToolGroup} group Group
 */
iS3.ToolGroupCollection.prototype.add = function (group) {
    if (!group.getId()) {
        throw new Error('The added group should has an id attribute.');
    }
    if (this._groups.hasOwnProperty(group.getId())) {
        throw new Error('The id of added group is existed.');
    }
    this._groups.push(group);
};

/**
 * Get all tools
 *
 * @return {Array}
 */
iS3.ToolGroupCollection.prototype.getAllTools = function () {
    var tools = [];
    this._groups.forEach(function (group) {
        group.getTools().forEach(function (tool) {
            tools.push(tool);
        });
    });
    return tools;
};

