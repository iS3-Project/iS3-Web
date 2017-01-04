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
 * @param {Array} options Options
 * @constructor
 */
iS3.layertree = function (options) {

};

/**
 * Construction function.
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.layertree.Layertree = function (options) {
    'use strict';

    if (!(this instanceof iS3.layertree.Layertree)) {
        throw new Error('layerTree must be constructed with the new keyword.');
    }
    if (typeof options === 'object' && options.parentObj && options.target) {
        if (!(options.parentObj.getMap() instanceof ol.Map)) {
            throw new Error('Please provide a valid OpenLayers 3 map object.');
        }
        var div = document.getElementById(options.target);
        if (div === null || div.nodeType !== 1) {
            throw new Error('Please provide a valid element id.');
        }
        if (!options.parentObj.getMessage()) {
            throw new Error('message output must be initialed first');
        }
    } else {
        throw new Error('Invalid parameter(s) provided.');
    }

    var containerDiv = document.getElementById(options.target);
    var buttonContainerDIV = document.createElement('div');
    buttonContainerDIV.className = 'layertree-buttons';
    containerDiv.appendChild(buttonContainerDIV);

    var layerContainerDiv = document.createElement('div');
    layerContainerDiv.className = 'layercontainer';
    containerDiv.appendChild(layerContainerDiv);

    this.parentObj = options.parentObj;
    this.buttons = options.buttons;
    this.map = options.parentObj.getMap();
    this.message = options.parentObj.getMessage();
    this.container = containerDiv;
    this.buttonContainer = buttonContainerDIV;
    this.layerContainer = layerContainerDiv;
    this.selectedLayer = null;

    this.init();
};

/**
 * Initialize function
 */
iS3.layertree.Layertree.prototype.init = function () {
    var thisCpy = this;
    var buttons = this.buttons;

    // create layertree button
    buttons.forEach(function (name) {
        thisCpy.addButton(name);
    });

    /*
     containerDiv.addEventListener('click', function (evt) {
     if (thisCpy.selectedLayer) {
     thisCpy.selectedLayer.classList.remove('active');
     }
     thisCpy.selectedLayer = null;
     });
     */

    // add listener to map layers
    this.selectEventEmitter = new ol.Observable();
    this.map.getLayers().on('add', function (evt) {
        if (evt.element instanceof ol.layer.Vector) {
            this.createRegistry(evt.element, true);
        } else {
            this.createRegistry(evt.element);
        }

        // move selected layer to the top
        var sourceLayer = thisCpy.getDrawingLayer();
        var layers = thisCpy.map.getLayers().getArray();
        layers.splice(layers.indexOf(sourceLayer), 1);
        layers.splice(layers.length, 0, sourceLayer);
        thisCpy.map.render();
    }, this);
    this.map.getLayers().on('remove', function (evt) {
        this.removeRegistry(evt.element);
        this.selectEventEmitter.changed();
    }, this);
};

/**
 * Add layertree button
 *
 * @param {string} name Name of button
 * @return {boolean} Success
 */
iS3.layertree.Layertree.prototype.addButton = function (name) {
    var buttonContainerDIV = this.buttonContainer;
    var lang = iS3Project.getConfig().lang;
    var thisCpy = this;

    switch (name) {
        case 'addwms':
            buttonContainerDIV.appendChild(new iS3.layertree.WmsButton({
                parentObj: thisCpy,
                elemName: 'addwms',
                elemTitle: lang.addwmsTitle
            }));
            break;
        case 'addwfs':
            buttonContainerDIV.appendChild(new iS3.layertree.WfsButton({
                parentObj: thisCpy,
                elemName: 'addwfs',
                elemTitle: lang.addwfsTitle
            }));
            break;
        case 'newlayer':
            buttonContainerDIV.appendChild(new iS3.layertree.NewButton({
                parentObj: thisCpy,
                elemName: 'newlayer',
                elemTitle: lang.newlayerTitle
            }));
            break;
        case 'addinput':
            buttonContainerDIV.appendChild(new iS3.layertree.InputButton({
                parentObj: thisCpy,
                elemName: 'addinput',
                elemTitle: lang.addInputTitle
            }));
            break;
        case 'outputlayer':
            buttonContainerDIV.appendChild(new iS3.layertree.OutputButton({
                parentObj: thisCpy,
                elemName: 'outputlayer',
                elemTitle: lang.outputLayerTitle
            }));
            break;
        case 'deletelayer':
            buttonContainerDIV.appendChild(new iS3.layertree.RemoveButton({
                parentObj: thisCpy,
                elemName: 'deletelayer',
                elemTitle: lang.removeLayerTitle
            }));
            break;
        default:
            return false;
    }
};

/**
 * Add the layer to layertree
 *
 * @param {ol.layer} layer Added layer
 * @param {boolean} buffer Buffer
 * @return {iS3.layertree.Layertree} Layer tree
 */
iS3.layertree.Layertree.prototype.createRegistry = function (layer, buffer) {
    var thisCpy = this;
    var layerDef = this.getLayerDefById(layer.get('id'));

    if (!layerDef) {
        var names = layer.get('id').split(':');
        var name = names[names.length - 2] + ':' + names[names.length - 1];
        var server = layer.get('id').substring(0, layer.get('id').length - name.length - 1);
        layerDef = new iS3.LayerDef({
            server: server,
            id: layer.get('id'),
            name: name,
            featurePrefix: names[names.length - 2]
        });
        iS3Project.getLayerDefs()[layer.get('id')] = layerDef;
    }

    var matches = layer.get('id').split(/:/g);
    var title = matches[matches.length - 1];
    var paras = {
        parentObj: thisCpy,
        id: layer.get('id'),
        buffer: buffer,
        title: title,
        layer: layer
    };

    var layertype;
    if (layer.get('layertype')) {
        layertype = layer.get('layertype');
    } else {
        if (layer.get('id').indexOf('panopoint') !== -1) {
            layertype = iS3.layerDef.layerType.PANOPOINT;
        }
        else if (layer.get('id').indexOf('PANOTIME') !== -1) {
            layertype = iS3.layerDef.layerType.PANOTIMEB;
        }
        else {
            layertype = iS3.layerDef.layerType.UNKNOWN;
        }
    }
    layerDef.layertype = layertype;

    var layerDiv;
    switch (layertype) {
        case iS3.LayerDef.layerType.BASE_MAP:
            layerDiv = new iS3.layertree.BaseMapContainer(paras).init();
            break;
        case iS3.LayerDef.layerType.PANOPOINT:
            layerDiv = new iS3.layertree.PanopointContainer(paras).init();
            break;
        default:
            layerDiv = new iS3.layertree.BasicContainer(paras).init();
            break;
    }

    this.addSelectEvent(layerDiv);
    this.layerContainer.insertBefore(layerDiv, this.layerContainer.firstChild);
    return this;
};

/**
 * Remove layer.
 *
 * @param {ol.layer} layer Removed layer
 * @return {iS3.layertree.Layertree} Layer tree
 */
iS3.layertree.Layertree.prototype.removeRegistry = function (layer) {
    var layerDiv = document.getElementById(layer.get('id'));
    this.layerContainer.removeChild(layerDiv);
    return this;
};

/**
 * Add buffer
 *
 * @param {ol.layer} layer Layer
 */
iS3.layertree.Layertree.prototype.addBufferIcon = function (layer) {
    layer.getSource().on('change', function (evt) {
        var layerElem = document.getElementById(layer.get('id'));
        switch (evt.target.getState()) {
            case 'ready':
                layerElem.className = layerElem.className.replace(/(?:^|\s)(error|buffering)(?!\S)/g, '');
                break;
            case 'error':
                layerElem.className += ' error';
                break;
            default:
                layerElem.className += ' buffering';
                break;
        }
    });
};

/**
 * Add selection event to element
 *
 * @param {Element} node Node
 * @param {boolean} isChild Is child
 * @return {Element} Node
 */
iS3.layertree.Layertree.prototype.addSelectEvent = function (node, isChild) {
    var thisCpy = this;
    node.addEventListener('click', function (evt) {
        evt.stopPropagation();
        var targetNode = evt.target;
        if (isChild) {
            evt.stopPropagation();
            targetNode = targetNode.parentNode;
        }
        if (thisCpy.selectedLayer) {
            thisCpy.selectedLayer.classList.remove('active');
        }
        thisCpy.selectedLayer = targetNode;
        targetNode.classList.add('active');
        thisCpy.selectEventEmitter.changed();
    });
    return node;
};

/**
 * Get layer by id
 *
 * @param {string} id ID
 * @return {ol.layer|null} Layer
 */
iS3.layertree.Layertree.prototype.getLayerById = function (id) {
    var layers = this.map.getLayers().getArray();
    for (var i = 0; i < layers.length; i += 1) {
        if (layers[i].get('id') === id) {
            return layers[i];
        }
    }
    return null;
};

/**
 * Get layer definition by id
 *
 * @param {string} id ID
 * @return {iS3.LayerDef} Layer definition
 */
iS3.layertree.Layertree.prototype.getLayerDefById = function (id) {
    return this.parentObj.getLayerDefs()[id];
};

/**
 * Get drawing layer
 *
 * @return {ol.layer|null}
 */
iS3.layertree.Layertree.prototype.getDrawingLayer = function () {
    return this.getLayerById('Local:Local:Drawing Layer');
};
