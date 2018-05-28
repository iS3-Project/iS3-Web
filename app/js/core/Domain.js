/**
 * Created by linxd on 2018/5/19.
 */

iS3.Domain = function (options) {
    this.parent = null;
    this.type = null;
    this.name = null;
    this.root = null;
    this.objsDefinitions = null;
};

iS3.Domain.DomainType = {
    Unknown: 'unknown',
    Geology: 'geology',
    Surroundings: 'surroundings',
    Structure: 'structure',
    Design: 'design',
    Construction: 'construction',
    Monitoring: 'monitoring',
    Maintenance: 'maintenance',
    Tdisease: 'Tdisease'
};

iS3.Domain.load = function(data) {
    var domain = new iS3.Domain({});
    $.extend(domain, data);
    if (data.objsDefinitions !== null) {
        for (var key in data.objsDefinitions) {
            domain.objsDefinitions[key] = iS3.DGObjectsDefinition.load(data.objsDefinitions[key]);
        }
    }

    if (data.root !== null) {
        this.root = iS3.Tree.load(data.root);
    }

    return domain;
};