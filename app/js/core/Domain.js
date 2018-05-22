/**
 * Created by linxd on 2018/5/19.
 */

iS3.Domain = function (options) {
    this.parent = null;
    this.type = null;
    this.name = null;
    this.root = null;
}

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