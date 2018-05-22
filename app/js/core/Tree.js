/**
 * Created by linxd on 2018/5/19.
 */

iS3.Tree = function (options) {
    console.log('test');
    // member
    this.name = options.name || null;
    this.displayName = options.displayName || null;
    this.description = options.description || null;
    this.refDomainName = options.refDomainName || null;
    this.refObjsName = options.refObjsName || null;
    this.filter = options.filter || null;
    this.sort = options.sort || null;
    this.objectsView = options.objectsView || null;
    this.refObjs = options.refObjs || null;
    this.children = options.children || null;

    // helper
    this.containerDiv = document.getElementById(options.target);

    this.init();
};

iS3.Tree.prototype.init = function(){
    $.get(iS3Project.getConfig().proxy + '/api/project/tree/SHML12')
        .done(function (tree) {
            console.log(tree);
        });
};

