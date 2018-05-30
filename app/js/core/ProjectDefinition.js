/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */

/**
 * Base class
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.ProjectDefinition = function (options) {
    this.ID = options.ID || null;
    this.ProjectTitle = options.ProjectTitle || null;
    this.DefaultMapID = options.DefaultMapID || null;
    this.LocalFilePath = options.LocalFilePath || null;
    this.LocalTilePath = options.LocalTilePath || null;
    this.LocalDatabaseName = options.LocalDatabaseName || null;
    this.DataServiceUrl = options.DataServiceUrl || null;
    this.GeometryServiceUrl = options.GeometryServiceUrl || null;
    this.SubProjectInfos = options.SubProjectInfos || null;
    this.EngineeringMaps = options.EngineeringMaps || null;
};

iS3.ProjectDefinition.load = function(data) {
    var definition = new iS3.ProjectDefinition({});
    $.extend(definition, data);

    if (data.EngineeringMaps !== null) {
        for (var key in data.EngineeringMaps) {
            definition.EngineeringMaps[key] = iS3.EngineeringMap.load(data.EngineeringMaps[key]);
        }
    }

    return definition;
};