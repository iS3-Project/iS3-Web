/**
 * Created by linxd on 2018/5/23.
 */

iS3.data = function (options) {

};

iS3.data.Data = function (options) {
    'use strict';

    if (!(this instanceof iS3.data.Data)) {
        throw new Error('data must be constructed with the new keyword.');
    } else if (typeof options === 'object' && options.parentObj && options.target) {
        if (!(options.parentObj.getMap() instanceof ol.Map)) {
            throw new Error('Please provide a valid OpenLayers 3 map object.');
        }
        var div = document.getElementById(options.target);
        if (div === null || div.nodeType !== 1) {
            throw new Error('Please provide a valid element id.');
        }
    } else {
        throw new Error('Invalid parameter(s) provided.');
    }

    this.map = options.parentObj.getMap();
    this.containerDiv = document.getElementById(options.target);
    this.layertree = options.parentObj.getLayertree();
    this.message = options.parentObj.getMessage();
    this.table = null;

    this.init();
};

/**
 * Initialization function
 */
iS3.data.Data.prototype.init = function () {
    var thisCpy = this;
    this.containerDiv.innerHTML = "<table id='datapanel' class='ui celled table' style='width:100%' />";

    var table = $('#datapanel').DataTable({
        dom: 't',
        scrollY: 300,
        scrollCollapse: true,
        scrollX: true,
        paging: false,
        data : {},
        "columns" : [
            { 'title' : 'ID', "data" : "id"},
            { 'title' : 'Name', "data" : "name" },
            { 'title' : 'FullName', "data" : "fullName" },
            { 'title' : 'Description', "data" : "description" }
        ]
    });
    this.table = table;

    iS3Project.selectDGObjectEventEmitter.on('change', function() {
        thisCpy.dgobjectSelectAction();
    }, iS3Project);

    iS3Project.getDatatree().selectEventEmitter.on('change', function () {
        thisCpy.treeSelectAction();
    }, iS3Project.getDatatree());
};

iS3.data.Data.prototype.show = function(array) {

    var thisCpy = this;

    $("#data").empty();
    $("#data").append("<table id='datapanel' class='ui celled table' style='width:100%' />");

    if (array.length === 0) {
        var table = $('#datapanel').DataTable({
            dom: 't',
            scrollY: 300,
            scrollCollapse: true,
            scrollX: true,
            paging: false,
            data : {},
            "columns" : [
                { 'title' : 'ID', "data" : "id"},
                { 'title' : 'Name', "data" : "name" },
                { 'title' : 'FullName', "data" : "fullName" },
                { 'title' : 'Description', "data" : "description" }
            ]
        });
        this.table = table;
        return;
    }

    var table = $('#datapanel').DataTable({
        dom: 't',
        scrollY: 300,
        scrollCollapse: true,
        scrollX: true,
        paging: false,
        data : array,
        "columns" : thisCpy.createHeader(array[0]),
        "destroy": true,
        "autoWidth": false,
        "createdRow" : function( row, data, index ) {
            // Add identity if it specified
            if( data.hasOwnProperty("id") ) {
                row.id = "row-" + data.id;
            }
        }
    });
    this.table = table;

    $('#datapanel tbody').on( 'click', 'tr', function () {
        var data = table.row( this ).data();
        if ( $(this).hasClass('selected') ) {
            // $(this).removeClass('selected');

            iS3Project.selectedIDs = null;
            iS3Project.selectedLayerID = null;
            iS3Project.selectDGObjectEventEmitter.changed();
        }
        else {
            // table.$('tr.selected').removeClass('selected');
            // $(this).addClass('selected');

            iS3Project.selectedIDs = [];
            iS3Project.selectedIDs.push(data['id']);

            var selectedTree = iS3Project.getDatatree().selectedTree;
            if (selectedTree !== null && selectedTree.RefDomainName !== null && selectedTree.RefObjsName !== null) {
                var domain = iS3Project.getDomainByName(selectedTree.RefDomainName);
                var layerName = domain.getObjDefByName(selectedTree.RefObjsName).GISLayerName.toLowerCase();
                var server = iS3Project.getConfig().server.toLowerCase();
                var CODE = iS3Project.getConfig().CODE.toLowerCase();
                iS3Project.selectedLayerID = server +':' + CODE + ':' + layerName;
            }

            iS3Project.selectDGObjectEventEmitter.changed();
        }
    } );
};

iS3.data.Data.prototype.createHeader = function (object) {

    var titleArray = [];
    var idtmp = {};
    idtmp['title'] = 'ID';
    idtmp['data'] = 'id';
    titleArray.push(idtmp);

    var nametmp = {};
    nametmp['title'] = 'Name';
    nametmp['data'] = 'name';
    titleArray.push(nametmp);

    var fullNametmp = {};
    fullNametmp['title'] = 'FullName';
    fullNametmp['data'] = 'fullName';
    titleArray.push(fullNametmp);

    var header;
    var content;
    for (var key in object) {
        header = key.toLowerCase();
        if (header === 'id' || header === 'name' || header === 'fullname' || header === 'description') continue;
        if ((Array.isArray(object[key]) || typeof object[key] === 'object') && object[key] !== null) continue;
        content = header.charAt(0).toUpperCase() + header.slice(1);

        var tmp = {};
        tmp['title'] = content;
        tmp['data'] = key;
        titleArray.push(tmp);
    }

    var destmp = {};
    destmp['title'] = 'Description';
    destmp['data'] = 'description';
    titleArray.push(destmp);
    return titleArray;
};

iS3.data.Data.prototype.updateSize = function () {
    var thisCpy = this;
    var table = $('#datapanel').DataTable();
    $('.dataTables_scrollBody').css('max-height', this.containerDiv.clientHeight - 25 + 'px');
    table.draw();
};

iS3.data.Data.prototype.dgobjectSelectAction = function() {
    var thisCpy = this;
    var selectedRow = this.table.$('tr.selected');
    if(selectedRow !== null) selectedRow.removeClass('selected');

    var selectedTree = iS3Project.getDatatree().selectedTree;
    if (selectedTree !== null && selectedTree.RefDomainName !== null && selectedTree.RefObjsName !== null) {
        var domain = iS3Project.getDomainByName(selectedTree.RefDomainName);
        var layerName = domain.getObjDefByName(selectedTree.RefObjsName).GISLayerName.toLowerCase();
        var server = iS3Project.getConfig().server.toLowerCase();
        var CODE = iS3Project.getConfig().CODE.toLowerCase();
        if (iS3Project.selectedLayerID !== server +':' + CODE + ':' + layerName) return;
    }

    if(iS3Project.selectedIDs !== null && iS3Project.selectedLayerID !== null) {
        for (var id in iS3Project.selectedIDs) {
            $('#row-' + iS3Project.selectedIDs[id]).addClass('selected');
        }
    }
};

iS3.data.Data.prototype.treeSelectAction = function() {
    var thisCpy = this;
    var tree = iS3Project.getDatatree().selectedTree;
    if (tree.Name === null || tree.RefDomainName === null) thisCpy.show([]);

    $.ajax({
        url: iS3Project.getConfig().proxy + '/api/' + tree.RefDomainName.toLowerCase() +
        '/' + tree.Name.toLowerCase() + '?project=' + iS3Project.getConfig().CODE,
        timeout: 1000
    }).done(function(data) {
        if (iS3.util.checkData(data)) {
            thisCpy.show(data.data);
        } else {
            thisCpy.show([]);
        }
    })
        .fail(function(data) {
            thisCpy.show([]);
        });
};