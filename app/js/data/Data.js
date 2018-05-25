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

    this.init();
};

/**
 * Initialization function
 */
iS3.data.Data.prototype.init = function () {

    var thisCpy = this;

    this.containerDiv.innerHTML = "<table id='datapanel' class='ui celled table' style='width:100%'>" +
    "<thead> <tr> <th>Name</th> <th>Position</th> <th>Office</th> <th>Age</th> <th>Start date</th> <th>Salary</th> </tr> </thead>" +
    "<tbody> <tr> <td>Tiger Nixon</td> <td>System Architect</td> <td>Edinburgh</td> <td>61</td> <td>2011/04/25</td> <td>$320,800</td> </tr>" +
    "<tr> <td>Garrett Winters</td> <td>Accountant</td> <td>Tokyo</td> <td>63</td> <td>2011/07/25</td> <td>$170,750</td> </tr>" +
    "<tr> <td>Ashton Cox</td> <td>Junior Technical Author</td> <td>San Francisco</td> <td>66</td> <td>2009/01/12</td> <td>$86,000</td> </tr>" +
    "<tr> <td>Cedric Kelly</td> <td>Senior Javascript Developer</td> <td>Edinburgh</td> <td>22</td> <td>2012/03/29</td> <td>$433,060</td> </tr>" +
    "<tr> <td>Airi Satou</td> <td>Accountant</td> <td>Tokyo</td> <td>33</td> <td>2008/11/28</td> <td>$162,700</td> </tr>" +
    "<tr> <td>Brielle Williamson</td> <td>Integration Specialist</td> <td>New York</td> <td>61</td> <td>2012/12/02</td> <td>$372,000</td> </tr>";

    var table = $('#datapanel').DataTable({
        dom: 't',
        scrollY: 300,
        scrollCollapse: true,
        scrollX: true,
        paging: false
    });

    $('#datapanel tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
};

iS3.data.Data.prototype.updateSize = function () {
    var thisCpy = this;
    var table = $('#datapanel').DataTable();
    $('.dataTables_scrollBody').css('max-height', this.containerDiv.clientHeight - 25 + 'px');
    table.draw();
};
