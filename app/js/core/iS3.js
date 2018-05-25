/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/**
 * Construction function
 *
 * @param {Array} options Options
 * @constructor
 */
function iS3(options) {

}

iS3.Main = function (options) {
    this.config = options.config || null;

    this.init();
};

iS3.Main.prototype.init = function () {

    var main = this;
    // initial project, global variable
    var iS3Project = new iS3.Project({config: main.config});

    // initial projection options
    //        var projControl = new iS3.toolbar.Projection({
    //            target: 'projection'
    //        });

    // initial map
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                preload: Infinity,
                source: new ol.source.OSM({
                    wrapX: false
                }),
                visible: true,
                id: 'Local:Local:OpenStreet Map',
                layertype: iS3.LayerDef.layerType.BASE_MAP
            }),
            new ol.layer.Tile({
                preload: Infinity,
                source: new ol.source.BingMaps({
                    key: 'AuZqkxV8gt-r1OwAN_2QnolUWIc5wcL-m3ncZJMD-h9LdGcIBHO7FXnThf1Ct-8z',
                    imagerySet: 'Aerial',
                    wrapX: false
                }),
                visible: false,
                id: 'Local:Local:Bing Map',
                layertype: iS3.LayerDef.layerType.BASE_MAP
            }),
            new ol.layer.Vector({
                source: new ol.source.Vector({
                    wrapX: false
                }),
                id: 'Local:Local:Drawing Layer'
            })
        ],
        interactions: ol.interaction.defaults({
            dragPan: false
        }),
        controls: [
            // Define some new controls
            new ol.control.MousePosition({
                coordinateFormat: function (coordinates) {
                    var coordX = coordinates[0].toFixed(3);
                    var coordY = coordinates[1].toFixed(3);
                    return coordX + ', ' + coordY;
                },
                target: 'coordinates'
            }),
//                    projControl
        ],
        view: new ol.View({
            center: [0, 0],
            zoom: 3
        }),
        loadTilesWhileAnimating: true,
        loadTilesWhileInteracting: true
    });
    iS3Project.setMap(map);

    // initial message output
    var message = document.getElementById('messageBar') || document.createElement('span');
    var observer = new MutationObserver(function (mutations) {
        if (mutations[0].target.textContent) {
            var oldText = mutations[0].target.textContent;
            var timeoutFunction = function () {
                if (oldText !== mutations[0].target.textContent) {
                    oldText = mutations[0].target.textContent;
                    setTimeout(timeoutFunction, 10000);
                } else {
                    oldText = '';
                    mutations[0].target.textContent = '';
                }
            };
            setTimeout(timeoutFunction, 10000);
        }
    });
    observer.observe(message, {childList: true});
    iS3Project.setMessage(message);

    // initial layertree
    var layertree = new iS3.layertree.Layertree({
        parentObj: iS3Project,
        target: 'layertree',
        buttons: ['addwms', 'newlayer', 'addinput', 'outputlayer', 'deletelayer']

    });

    layertree.createRegistry(map.getLayers().item(0));
    layertree.createRegistry(map.getLayers().item(1));
    iS3Project.setLayertree(layertree);

    // initial toolbar
    var toolbar = new iS3.toolbar.Toolbar({
        parentObj: iS3Project,
        target: 'toolbar',
        buttons: ['zoomGroup', 'selectGroup', 'drawGroup', 'measureGroup',
            'queryGroup']
    });
    iS3Project.setToolbar(toolbar);

    $("button[data-tooltip='Pan']").click();

    // initial datatree
    var datatree = new iS3.datatree.Datatree({
        parentObj: iS3Project,
        target: 'datatree'
    });
    iS3Project.setDatatree(datatree);

    // initial data
    var data = new iS3.data.Data({
        parentObj: iS3Project,
        target: 'data'
    });
    iS3Project.setData(data);
};

