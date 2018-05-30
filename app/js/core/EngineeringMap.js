/**
 * Created by linxd on 2018/5/30.
 */

iS3.EngineeringMap = function (options) {
    this.MapID = null;
    this.LocalTileFileName1 = null;
    this.LocalTileFileName2 = null;
    this.LocalMapFileName = null;
    this.LocalGeoDbFileName = null;
    this.MapUrl = null;
    this.XMax = null;
    this.XMin = null;
    this.YMax = null;
    this.YMin = null;
    this.MinimumResolution = null;
    this.MapRotation = null;
    this.Calibrated = null;
    this.Scale = null;
    this.ScaleX = null;
    this.ScaleY = null;
    this.ScaleZ = null;

    this.LocalGdbLayersDef = null;
};

iS3.EngineeringMap.LayerDef = function (options) {
    this.Name = null;
    this.IsVisible = null;
};

iS3.EngineeringMap.load = function(data) {
    var map = new iS3.EngineeringMap({});
    $.extend(map, data);
    return map;
};