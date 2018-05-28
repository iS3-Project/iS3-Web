/**
 * Created by linxd on 2018/5/19.
 */

iS3.DGObjectsDefinition = function(options) {
    this.Type = null;
    this.Name = null;
    this.HasGeometry = null;
    this.GISLayerName = null;
    this.TableNameSQL = null;
    this.DefNamesSQL = null;
    this.ConditionSQL = null;
    this.OrderSQL = null;
};

iS3.DGObjectsDefinition.load = function (data) {
    var dgsDef = new iS3.DGObjectsDefinition({});
    $.extend(dgsDef, data);
    return dgsDef;
};

iS3.DGObjects = function (options) {

};
