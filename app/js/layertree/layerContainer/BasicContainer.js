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
iS3.layertree.BasicContainer = function (options) {

    var layerDiv = document.createElement('div');
    layerDiv.className = options.buffer ? 'layer ol-unselectable buffering' : 'layer ol-unselectable';
    layerDiv.id = options.id;
    layerDiv.title = options.title;

    this.container = layerDiv;
    this.layertree = options.parentObj;
    this.layer = options.layer;
};

/**
 * Initialize function
 *
 * @return {Element|*} Container
 */
iS3.layertree.BasicContainer.prototype.init = function () {
    this.enableDraggable().addLayerTitle().addVisibleCheckbox().addOpacityBar();
    if (this.layer instanceof ol.layer.Tile) {
        this.addFilter();
    }
    return this.container;
};

/**
 * Add draggable event
 *
 * @return {iS3.layertree.BasicContainer} Container
 */
iS3.layertree.BasicContainer.prototype.enableDraggable = function () {
    var layerDiv = this.container;
    var layertree = this.layertree;
    layerDiv.draggable = true;
    layerDiv.addEventListener('dragstart', function (evt) {
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('Text', this.id);
    });
    layerDiv.addEventListener('dragenter', function (evt) {
        this.classList.add('over');
    });
    layerDiv.addEventListener('dragleave', function (evt) {
        this.classList.remove('over');
    });
    layerDiv.addEventListener('dragover', function (evt) {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';
    });
    layerDiv.addEventListener('drop', function (evt) {
        evt.preventDefault();
        this.classList.remove('over');
        var sourceLayerDiv = document.getElementById(evt.dataTransfer.getData('Text'));
        if (sourceLayerDiv !== this) {
            layertree.layerContainer.removeChild(sourceLayerDiv);
            layertree.layerContainer.insertBefore(sourceLayerDiv, this);
            var htmlArray = [].slice.call(layertree.layerContainer.children);
            var index = htmlArray.length - htmlArray.indexOf(sourceLayerDiv) - 1;
            var sourceLayer = layertree.getLayerById(sourceLayerDiv.id);
            var layers = layertree.map.getLayers().getArray();
            layers.splice(layers.indexOf(sourceLayer), 1);
            layers.splice(index, 0, sourceLayer);
            layertree.map.render();
        }
    });
    return this;
};

/**
 * Add layer title
 *
 * @return {iS3.layertree.BasicContainer} Container
 */
iS3.layertree.BasicContainer.prototype.addLayerTitle = function () {
    var layertree = this.layertree;
    var layerDiv = this.container;
    var layerSpan = document.createElement('span');
    layerSpan.textContent = layerDiv.title;
    layerDiv.appendChild(layertree.addSelectEvent(layerSpan, true));
    layerSpan.addEventListener('dblclick', function () {
        this.contentEditable = true;
        layerDiv.draggable = false;
        layerDiv.classList.remove('ol-unselectable');
        this.focus();
    });
    layerSpan.addEventListener('blur', function () {
        if (this.contentEditable) {
            this.contentEditable = false;
            layerDiv.draggable = true;
            layerDiv.classList.add('ol-unselectable');
            layerDiv.title = this.textContent;
            // this.scrollTo(0, 0);
        }
    });
    return this;
};

/**
 * Add visible check box
 *
 * @return {iS3.layertree.BasicContainer} Container
 */
iS3.layertree.BasicContainer.prototype.addVisibleCheckbox = function () {
    var layer = this.layer;
    var layerDiv = this.container;
    var visibleBox = document.createElement('input');
    visibleBox.type = 'checkbox';
    visibleBox.className = 'visible';
    visibleBox.checked = layer.getVisible();
    visibleBox.addEventListener('change', function () {
        if (this.checked) {
            layer.setVisible(true);
        } else {
            layer.setVisible(false);
        }
    });
    layerDiv.appendChild(iS3.domTool.stopPropagationOnEvent(visibleBox, 'click'));
    return this;
};

/**
 * Add opacity bar
 *
 * @return {iS3.layertree.BasicContainer} Container
 */
iS3.layertree.BasicContainer.prototype.addOpacityBar = function () {
    var layertree = this.layertree;
    var layer = this.layer;
    var layerDiv = this.container;
    var layerControls = document.createElement('div');
    layertree.addSelectEvent(layerControls, true);
    var opacityHandler = document.createElement('input');
    opacityHandler.type = 'range';
    opacityHandler.min = 0;
    opacityHandler.max = 1;
    opacityHandler.step = 0.1;
    opacityHandler.value = layer.getOpacity();
    opacityHandler.addEventListener('input', function () {
        layer.setOpacity(this.value);
    });
    opacityHandler.addEventListener('change', function () {
        layer.setOpacity(this.value);
    });
    opacityHandler.addEventListener('mousedown', function () {
        layerDiv.draggable = false;
    });
    opacityHandler.addEventListener('mouseup', function () {
        layerDiv.draggable = true;
    });
    layerControls.appendChild(iS3.domTool.stopPropagationOnEvent(opacityHandler, 'click'));
    layerDiv.appendChild(layerControls);
    return this;
};

/**
 * Add filter
 *
 * @return {iS3.layertree.BasicContainer} Container
 */
iS3.layertree.BasicContainer.prototype.addFilter = function () {
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
    var headerSelect = document.createElement('select');
    headerSelect.name = 'header';
    headerSelect.required = 'required';
    row11.appendChild(headerSelect);
    firstRow.appendChild(row11);

    var row12 = document.createElement('td');
    var conditionSelect = document.createElement('select');
    conditionSelect.name = 'condition';
    conditionSelect.required = 'required';
    row12.appendChild(conditionSelect);
    firstRow.appendChild(row12);
    filterTable.appendChild(iS3.domTool.stopPropagationOnEvent(firstRow, 'click'));

    var secondRow = document.createElement('tr');
    var row21 = document.createElement('td');
    var cqlInput = document.createElement('input');
    cqlInput.type = 'text';
    cqlInput.name = 'cql';
    cqlInput.required = 'required';
    row21.appendChild(cqlInput);
    secondRow.appendChild(row21);

    var row22 = document.createElement('td');
    var submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = iS3Project.getConfig().lang.apply;
    row22.appendChild(submit);
    secondRow.appendChild(row22);
    filterTable.appendChild(iS3.domTool.stopPropagationOnEvent(secondRow, 'click'));
    layerDiv.appendChild(filterContainer);

    // fill options and add event
    var layerDef = layertree.getLayerDefById(layer.get('id'));
    if (!layerDef) {
        return this;
    }

    iS3.geoRequest.getLayerHeader(layerDef, function (headers) {
        for (var i = 1; i < headers.length; i++) {
            headerSelect.appendChild(iS3.domTool.createOption(headers[i].name));
        }
    });

    conditionSelect.appendChild(iS3.domTool.createOption('=', '='));
    conditionSelect.appendChild(iS3.domTool.createOption('<>', '<>'));
    conditionSelect.appendChild(iS3.domTool.createOption('<', '<'));
    conditionSelect.appendChild(iS3.domTool.createOption('<=', '<='));
    conditionSelect.appendChild(iS3.domTool.createOption('>', '>'));
    conditionSelect.appendChild(iS3.domTool.createOption('>=', '>='));
    conditionSelect.appendChild(iS3.domTool.createOption('LIKE', ' LIKE '));
    conditionSelect.appendChild(iS3.domTool.createOption('BETWEEN', ' BETWEEN '));

    filterForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        if (layer instanceof ol.layer.Tile) {
            var source = layer.getSource();
            var filter = this.header.value + this.condition.value + this.cql.value;
            var params = source.getParams();
            params.t = new Date().getMilliseconds();
            params.CQLFILTER = filter;
            source.updateParams(params);
        }
    });

    resetBtn.onclick = function (evt) {
        if (layer instanceof ol.layer.Tile) {
            var source = layer.getSource();
            var params = source.getParams();
            params.t = new Date().getMilliseconds();
            params.CQLFILTER = null;
            source.updateParams(params);
        }
    };

    return this;
};