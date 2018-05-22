/**
 * Created by linxd on 2018/5/19.
 */

iS3.DGObject = function (options) {
    this.id = options.id || null;
    this.name = options.name || null;
    this.fullname = options.fullname || null;
    this.desc = options.desc || null;
    this.res = options.res || null;
    this.rawData = options.rawData || null;
    this.shp = options.shp || null;
    this.parent = options.parent || null;
}
