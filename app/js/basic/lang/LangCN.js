/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */

iS3.LangCN = function () {
    // common
    this.cancel = '取消';
    this.save = '保存';
    this.delete = '删除';
    this.edit = '编辑';
    this.close = '关闭';
    this.add = '添加';
    this.type = '类型';
    this.apply = '应用';
    this.submit = '提交';
    this.reset = '复原';
    this.filter = '过滤';
    this.carDay = '车天';
    this.auto = '自动';
    this.markSelected = '标记选中';
    this.targetLayer = '目标图层';
    this.inputFile = '输入文件';
    this.outputFile = '输出文件';
    this.export = '输出';

    // layertree
    this.addwmsTitle = '添加栅格图层';
    this.addwfsTitle = '添加矢量图层';
    this.newlayerTitle = '新建空图层';
    this.addInputTitle = '导入图层';
    this.outputLayerTitle = '导出图层';
    this.removeLayerTitle = '删除图层';
    // layertree buttom
    // wms
    this.serverURL = '服务器URL';
    this.checkForLayers = '查询图层';
    this.layerName = '图层名字';
    this.addLayer = '添加图层';
    this.format = '格式';
    // new empty
    this.displayName = '显示名字';

    // panopoint name
    this.qualifiedPoints = '合格点';
    this.pictureDeletedPoints = '图片删除点';
    this.isolatedDeletedPoints = '孤立点';
    this.repeatedDeletedPoints = '重复点';
    this.linkDeletedPoints = 'Link删除点';
    this.allPanopoints = '所有轨迹点';

    // toolbar
    this.zoomGroupName = '缩放';
    this.selectGroupName = '选择';
    this.drawGroupName = '绘图';
    this.measureGroupName = '测量';
    this.queryGroupName = '查询';
    this.customGroupName = '自定义';
    // zoom group
    this.pan = '移动';
    this.zoomToFullTip = '显示所有图层';
    this.zoomToLayerTip = '缩放到图层';
    this.zoomToSelectedTip = '缩放到选择元素';
    // select group
    this.clickSelectTip = '选择元素';
    this.boxSelectTip = '矩形选择元素';
    this.polygonSelectTip = '多边形选择元素';
    this.removeSelectionTip = '取消选择元素';
    // draw group
    this.addPointsTip = '添加点';
    this.addLinesTip = '添加线';
    this.addPolygonsTip = '添加多边形';
    this.removeFeaturesTip = '元素删除';
    this.dragFeaturesTip = '元素拖动';
    // measure group
    this.measureLinestringTip = '测量长度';
    this.measurePolygonTip = '测量面积';
    // query group
    this.queryAttributeTip = '查询元素属性';
    // custom
    this.gisQualifiedTip = 'GIS质检（ ctrl+q ）';
};
