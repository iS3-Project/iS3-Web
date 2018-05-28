/**
 * Created by linxd on 2018/5/19.
 */

iS3.Tree = function (options) {
    // member
    this.Name = options.Name || null;
    this.DisplayName = options.DisplayName || null;
    this.Description = options.Description || null;
    this.RefDomainName = options.RefDomainName || null;
    this.RefObjsName = options.RefObjsName || null;
    this.Filter = options.Filter || null;
    this.Sort = options.Sort || null;
    this.Children = options.Children || null;

    // helper
    this.containerDiv = document.getElementById(options.target);

    this.init();
};

iS3.Tree.load = function (data) {
    var root = new iS3.Tree({});
    $.extend(root, data);
    if (data.Children !== null && data.Children.length !== 0) {
        for (var key in data.Children) {
            root.Children[key] = iS3.Tree.load(data.Children[key]);
        }
    }
    return root;
};

iS3.Tree.prototype.init = function(){

};

