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
iS3.toolbar.QueryGroup = function (options) {
    iS3.ToolGroup.call(this, options);

    this.parentObj = options.parentObj;
    this.layertree = options.parentObj.layertree;
    this.init();
};
iS3.inherits(iS3.toolbar.QueryGroup, iS3.ToolGroup);

/**
 * Initialization function
 */
iS3.toolbar.QueryGroup.prototype.init = function () {
    var layertree = this.layertree;

    layertree.selectEventEmitter.on('change', function () {

    }, this);

    this.loadClickQuery();
};

/**
 * Load click query
 *
 * @return {iS3.toolbar.QueryGroup} Group
 */
iS3.toolbar.QueryGroup.prototype.loadClickQuery = function () {
    var thisCpy = this;
    var clickQuery = new iS3.toolbar.BasicControl({
        label: ' ',
        tipLabel: iS3Project.getConfig().lang.queryAttributeTip,
        className: 'iS3-clickquery ol-unselectable ol-control',
        type: 'toggle',
        trigger: function () {
            thisCpy.clickEvent = iS3.toolbar.QueryGroup.clickQueryFunction(thisCpy.parentObj);
        },
        destroy: function () {
            thisCpy.parentObj.map.unByKey(thisCpy.clickEvent);
        }
    });
    clickQuery.id = 'clickQuery';
    this.add(clickQuery);
    return this;
};

/**
 * Click query function
 *
 * @param {iS3.toolbar.Toolbar} toolbar Toolbar
 * @return {ol.EventsKey|Array.<ol.EventsKey>} Event key
 */
iS3.toolbar.QueryGroup.clickQueryFunction = function (toolbar) {
    var map = toolbar.map;
    var layertree = toolbar.layertree;

    return map.on('click', function (evt) {
        map.getOverlays().clear();
        toolbar.selectInteraction.getFeatures().clear();

        var viewResolution = /** @type {number} */ (map.getView().getResolution());
        var layer = layertree.getLayerById(layertree.selectedLayer.id);
        var mapProj = map.getView().getProjection();
        var url = layer.getSource().getGetFeatureInfoUrl(
            evt.coordinate, viewResolution, mapProj.getCode(),
            {'INFO_FORMAT': 'application/json'});

        var parser = new ol.format.GeoJSON();
        var request = new XMLHttpRequest();
        request.open('GET', url);
        request.send();

        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                // get feature
                var features = parser.readFeatures(request.responseText, {
                    featureProjection: mapProj
                });
                if (features.length > 0) {
                    var attributeDiv = iS3.toolbar.QueryGroup.createFeatureDiv(toolbar, features[0], 'read');
                    // create openlayers overlay
                    map.addOverlay(new ol.Overlay({
                        element: attributeDiv,
                        position: evt.coordinate
                    }));
                    toolbar.selectInteraction.getFeatures().push(features[0]);
                }
            }
        };
    });
};

/**
 * Create feature div
 *
 * @param {ol.toolbar.Toolbar} toolbar Toolbar
 * @param {ol.feature} feature Feature
 * @param {string} type Type
 * @return {Element} Feature div
 */
iS3.toolbar.QueryGroup.createFeatureDiv = function (toolbar, feature, type) {
    var map = toolbar.map;
    var layer = toolbar.layertree.getLayerById(toolbar.layertree.selectedLayer.id);
    var layerDef = toolbar.layertree.getLayerDefById(toolbar.layertree.selectedLayer.id);

    var attributeDiv = document.createElement('div');
    attributeDiv.className = 'iS3-feature-popup';
    attributeDiv.appendChild(iS3.toolbar.QueryGroup.featureToForm(feature, type));

    if (type === 'read') {
        attributeDiv.appendChild(createEditBtn());
        attributeDiv.appendChild(createCancelBtn());
    }
    if (type === 'edit') {
        attributeDiv.appendChild(createSaveBtn());
        attributeDiv.appendChild(createDeleteBtn());
        // attributeDiv.appendChild(createTestBtn());
    }

    /**
     * Cancel button
     *
     * @return {Element} Cancel button
     */
    function createCancelBtn() {
        var cancelBtn = document.createElement('input');
        cancelBtn.type = 'button';
        cancelBtn.className = 'cancel';
        cancelBtn.value = iS3Project.getConfig().lang.cancel;
        cancelBtn.addEventListener('click', function (evt) {
            evt.preventDefault();
            map.getOverlays().clear();
            toolbar.selectInteraction.getFeatures().clear();
        });
        return cancelBtn;
    }

    /**
     * Edit button
     *
     * @return {Element} Edit button
     */
    function createEditBtn() {
        var editBtn = document.createElement('input');
        editBtn.type = 'button';
        editBtn.className = 'edit';
        editBtn.value = iS3Project.getConfig().lang.edit;
        editBtn.addEventListener('click', function (evt) {
            evt.preventDefault();
            var coor = map.getOverlays().getArray()[0].getPosition();
            map.getOverlays().clear();
            map.addOverlay(new ol.Overlay({
                element: iS3.toolbar.QueryGroup.createFeatureDiv(toolbar, feature, 'edit'),
                position: coor
            }));
        });
        return editBtn;
    }

    /**
     * Save button
     *
     * @return {Element} Save button
     */
    function createSaveBtn() {
        var saveBtn = document.createElement('input');
        saveBtn.type = 'button';
        saveBtn.className = 'save';
        saveBtn.value = iS3Project.getConfig().lang.save;
        saveBtn.addEventListener('click', function (evt) {
            evt.preventDefault();
            var coor = map.getOverlays().getArray()[0].getPosition();
            map.getOverlays().clear();
            map.addOverlay(new ol.Overlay({
                element: iS3.toolbar.QueryGroup.createFeatureDiv(toolbar, feature, 'read'),
                position: coor
            }));
        });
        return saveBtn;
    }

    /**
     * Delete button
     *
     * @return {Element} Delete button
     */
    function createDeleteBtn() {
        var deleteBtn = document.createElement('input');
        deleteBtn.type = 'button';
        deleteBtn.className = 'delete';
        deleteBtn.value = iS3Project.getConfig().lang.delete;
        deleteBtn.addEventListener('click', function (evt) {
            evt.preventDefault();
            map.getOverlays().clear();
            toolbar.selectInteraction.getFeatures().clear();
            iS3.geoRequest.transactWFS(layerDef, [feature], 'delete');
        });
        return deleteBtn;
    }

    return attributeDiv;
};

/**
 * Feature to form
 * @param {ol.feature} feature Feature
 * @param {string} type Type
 * @return {Element} Form element
 */
iS3.toolbar.QueryGroup.featureToForm = function (feature, type) {
    var attributeForm = document.createElement('form');
    attributeForm.className = 'iS3-feature-form';
    var attributes = feature.getProperties();
    for (var j in attributes) {
        if (type === 'read') {
            attributeForm.appendChild(createRow(j, attributes[j], false));
        }
        else if (type === 'edit') {
            attributeForm.appendChild(createRow(j, attributes[j], true));
        }
    }
    return attributeForm;

    /**
     * Create row
     *
     * @param {string} attributeName Attribute name
     * @param {string} attributeValue Attribute value
     * @param {boolean} edit Is editable
     * @return {Element} Element
     */
    function createRow(attributeName, attributeValue, edit) {
        var rowElem = document.createElement('div');
        var attributeSpan = document.createElement('span');
        attributeSpan.textContent = attributeName + ': ';
        rowElem.appendChild(attributeSpan);
        var attributeInput = document.createElement('input');
        attributeInput.name = attributeName;
        attributeInput.type = 'text';
        attributeInput.value = attributeValue;
        rowElem.appendChild(attributeInput);
        if (!edit) {
            attributeInput.readOnly = 'readonly';
        }
        return rowElem;
    }
};
