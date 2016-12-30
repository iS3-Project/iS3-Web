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
iS3.layertree.WmsButton = function (options) {

    iS3.layertree.BaseButton.call(this, options);

    this.parentObj = options.parentObj;
    var thisCpy = this;
    var buttonElem = this.button;
    var wmsDiv;
    buttonElem.addEventListener('click', function () {
        if (!wmsDiv) {
            wmsDiv = thisCpy.createUI();
            document.body.appendChild(wmsDiv);
            document.getElementById('wmsurl').value = thisCpy.parentObj.parentObj.getConfig().server;

            document.getElementById('checkwmslayer').addEventListener('click', function () {
                thisCpy.checkWmsLayer(this.form);
            });
            document.getElementById('addwms_form').addEventListener('submit', function (evt) {
                evt.preventDefault();
                thisCpy.addWmsLayer(this);
                this.parentNode.style.display = 'none';
            });
            document.getElementById('wmsurl').addEventListener('change', function () {
                iS3.domTool.removeContent(this.form.layer);
                iS3.domTool.removeContent(this.form.format);
            });
        }
        if (wmsDiv.style.display === 'none') {
            wmsDiv.style.display = 'block';
        }
        else {
            wmsDiv.style.display = 'none';
        }
    });
    return buttonElem;
};
iS3.inherits(iS3.layertree.WmsButton, iS3.layertree.BaseButton);

/**
 * Create new button UI
 *
 * @return {Element} Wms button
 */
iS3.layertree.WmsButton.prototype.createUI = function () {
    var lang = iS3Project.getConfig().lang;
    var wmsDiv = document.createElement('div');
    wmsDiv.id = 'addwms';
    wmsDiv.className = 'toggleable';
    wmsDiv.style.display = 'none';

    var wmsForm = document.createElement('form');
    wmsForm.id = 'addwms_form';
    wmsForm.className = 'addlayer';
    wmsDiv.appendChild(wmsForm);

    var titleP = document.createElement('p');
    titleP.textContent = this.button.title;
    wmsForm.appendChild(titleP);

    var wmsTable = document.createElement('table');

    var firstRow = document.createElement('tr');
    firstRow.innerHTML = '<td>' + lang.serverURL + ':</td>'
        + '<td><input id="wmsurl" name="server" type="text"'
        + ' required="required" value="http://localhost:8080/geoserver"></td>'
        + '<td><input id="checkwmslayer" name="check" type="button" value="'
        + lang.checkForLayers + '"></td>';
    wmsTable.appendChild(firstRow);

    var secondRow = document.createElement('tr');
    secondRow.innerHTML = '<td>' + lang.layerName + ':</td>'
        + '<td><select name="layer" required="required"></select></td>';
    wmsTable.appendChild(secondRow);

    var thirdRow = document.createElement('tr');
    thirdRow.innerHTML = '<td>' + lang.format + ':</td>'
        + '<td><select name="format" required="required"></select></td>';
    wmsTable.appendChild(thirdRow);

    var forthRow = document.createElement('tr');
    forthRow.innerHTML = '<td><input type="submit" value="' + lang.addLayer + '"></td>'
        + '<td><input type="button" value="' + lang.cancel
        + '" onclick="this.form.parentNode.style.display = \'none\'"></td>';
    wmsTable.appendChild(forthRow);

    wmsForm.appendChild(wmsTable);
    return wmsDiv;
};

/**
 * Check wms layer
 *
 * @param {Element} form Form
 */
iS3.layertree.WmsButton.prototype.checkWmsLayer = function (form) {
    form.check.disabled = true;
    var layertree = this.parentObj;
    iS3.domTool.removeContent(form.layer);
    iS3.domTool.removeContent(form.format);
    var url = form.server.value + '/wms';
    url = /^((http)|(https))(:\/\/)/.test(url) ? url : 'http://' + url;
    var request = new XMLHttpRequest();

    // deal with the layer information
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var parser = new ol.format.WMSCapabilities();
            try {
                var capabilities = parser.read(request.responseText);
                var currentProj = layertree.map.getView().getProjection().getCode();
                var crs;
                var messageText = 'Layers read successfully.';
                if (capabilities.version === '1.3.0') {
                    crs = capabilities.Capability.Layer.CRS;
                } else {
                    crs = [currentProj];
                    messageText += ' Warning! Projection compatibility could not be checked due to version mismatch ('
                        + capabilities.version + ').';
                }

                var layers = capabilities.Capability.Layer.Layer;
                if (layers.length > 0 && crs.indexOf(currentProj) > -1) {
                    for (var i = 0; i < layers.length; i += 1) {
                        form.layer.appendChild(iS3.domTool.createOption(layers[i].Name));

                        // store all layer information, to add more layer information later
                        var layerDefs = layertree.parentObj.getLayerDefs();
                        var boundingBox = null;
                        layers[i].BoundingBox.forEach(function (bbox) {
                            if (bbox.crs.indexOf('EPSG') !== -1) {
                                boundingBox = bbox;
                            }
                        });
                        layerDefs[(form.server.value + ':' + layers[i].Name)] = new iS3.LayerDef({
                            id: form.server.value + ':' + layers[i].Name,
                            server: form.server.value,
                            featurePrefix: form.layer.value.split(':')[0],
                            name: layers[i].Name,
                            projection: ol.proj.get(boundingBox.crs),
                            extent: boundingBox.extent
                        });
                    }
                    var formats = capabilities.Capability.Request.GetMap.Format;
                    for (i = 0; i < formats.length; i += 1) {
                        form.format.appendChild(iS3.domTool.createOption(formats[i]));
                    }
                    layertree.message.textContent = messageText;
                }
            } catch (error) {
                layertree.message.textContent = 'Some unexpected error occurred: (' + error.message + ').';
            } finally {
                form.check.disabled = false;
            }
        } else if (request.status > 200) {
            form.check.disabled = false;
        }
    };
    url = /\?/.test(url) ? url + '&' : url + '?';
    url = url + 'REQUEST=GetCapabilities&SERVICE=WMS';
    request.open('GET', url, true);
    request.send();
};

/**
 * New vector layer
 *
 * @param {Element} form Form
 * @return {iS3.layertree.WmsButton|null} New button
 */
iS3.layertree.WmsButton.prototype.addWmsLayer = function (form) {
    var layertree = this.parentObj;

    var params = {
        url: form.server.value + '/wms',
        params: {
            LAYERS: form.layer.value,
            FORMAT: form.format.value,
            VERSION: '1.1.0'
        },
        wrapX: false
    };
    var layer = new ol.layer.Tile({
        source: new ol.source.TileWMS(params)
    });

    // the unique identification of layer, layerDiv and layerDef
    layer.set('id', form.server.value + ':' + form.layer.value);
    layertree.map.addLayer(layer);
    layertree.message.textContent = 'WMS layer added successfully.';

    return this;
};
