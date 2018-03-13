/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals iS3Project */
/* globals ol */

/**
 * Construction function
 *
 * @param {Object} options Options
 * @constructor
 */
iS3.layertree.PanopointContainer = function (options) {
    iS3.layertree.BasicContainer.call(this, options);
};
iS3.inherits(iS3.layertree.PanopointContainer, iS3.layertree.BasicContainer);

/**
 * Add filter
 *
 * @return {iS3.layertree.PanopointContainer}
 */
iS3.layertree.PanopointContainer.prototype.addFilter = function () {
    var lang = iS3Project.getConfig().lang;
    var layertree = this.layertree;
    var layer = this.layer;
    var layerDiv = this.container;
    var filterContainer = document.createElement('div');
    filterContainer.className = 'filterdiv';
    layertree.addSelectEvent(filterContainer, true);

    var filterForm = document.createElement('form');
    filterForm.className = 'filterform';
    filterContainer.appendChild(filterForm);

    var filterTable = document.createElement('table');
    filterTable.className = 'filtertable';
    filterForm.appendChild(filterTable);

    var titleRow = document.createElement('tr');
    var row01 = document.createElement('td');
    row01.style.width = '70%';
    row01.innerHTML = iS3Project.getConfig().lang.filter;
    titleRow.appendChild(row01);

    var row02 = document.createElement('td');
    row02.style.width = '30%';
    var resetBtn = document.createElement('input');
    resetBtn.type = 'button';
    resetBtn.value = iS3Project.getConfig().lang.reset;
    row02.appendChild(resetBtn);
    titleRow.appendChild(row02);
    filterTable.appendChild(iS3.domTool.stopPropagationOnEvent(titleRow, 'click'));

    var firstRow = document.createElement('tr');
    var row11 = document.createElement('td');
    var pointSelect = document.createElement('select');
    pointSelect.name = 'point';
    pointSelect.required = 'required';
    row11.appendChild(pointSelect);
    firstRow.appendChild(row11);

    var row12 = document.createElement('td');
    var submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = iS3Project.getConfig().lang.apply;
    row12.appendChild(submit);
    firstRow.appendChild(row12);
    filterTable.appendChild(iS3.domTool.stopPropagationOnEvent(firstRow, 'click'));

    var titleRow2 = document.createElement('tr');
    var row021 = document.createElement('td');
    row021.innerHTML = iS3Project.getConfig().lang.carDay;
    titleRow2.appendChild(row021);
    filterTable.appendChild(iS3.domTool.stopPropagationOnEvent(titleRow2, 'click'));

    var secondRow = document.createElement('tr');
    var row21 = document.createElement('td');
    var dayInput = document.createElement('input');
    dayInput.type = 'text';
    dayInput.name = 'day';
    row21.appendChild(dayInput);
    secondRow.appendChild(row21);

    var row22 = document.createElement('td');
    var daysubmit = document.createElement('input');
    daysubmit.type = 'button';
    daysubmit.value = iS3Project.getConfig().lang.apply;
    daysubmit.onclick = function () {
        if (!dayInput.value) {
            return false;
        }
        var dayFilter = 'kydateid like \'%' + dayInput.value + '%\'';
        var source = layer.getSource();
        var params = source.getParams();
        params.t = new Date().getMilliseconds();
        params.CQLFILTER = dayFilter;
        source.updateParams(params);
    };
    row22.appendChild(daysubmit);
    secondRow.appendChild(row22);
    filterTable.appendChild(iS3.domTool.stopPropagationOnEvent(secondRow, 'click'));

    layerDiv.appendChild(filterContainer);

    // fill options and add event
    pointSelect.appendChild(iS3.domTool.createOption(lang.qualifiedPoints, 'status=0'));
    pointSelect.appendChild(iS3.domTool.createOption(lang.pictureDeletedPoints, 'status=1'));
    pointSelect.appendChild(iS3.domTool.createOption(lang.isolatedDeletedPoints, 'status=2'));
    pointSelect.appendChild(iS3.domTool.createOption(lang.repeatedDeletedPoints, 'status=3'));
    pointSelect.appendChild(iS3.domTool.createOption(lang.linkDeletedPoints, 'status=4'));
    pointSelect.appendChild(iS3.domTool.createOption(lang.allPanopoints, 'status<>-1'));

    filterForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        if (layer instanceof ol.layer.Tile) {
            var source = layer.getSource();
            var filter = pointSelect.value;
            var params = source.getParams();
            params.t = new Date().getMilliseconds();
            params.CQL_FILTER = filter;
            source.updateParams(params);
        }
    });

    resetBtn.onclick = function (evt) {
        if (layer instanceof ol.layer.Tile) {
            var source = layer.getSource();
            var params = source.getParams();
            params.t = new Date().getMilliseconds();
            params.CQL_FILTER = null;
            source.updateParams(params);
        }
    };
    submit.click();
    return this;
};
