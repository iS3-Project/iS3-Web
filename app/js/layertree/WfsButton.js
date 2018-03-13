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
iS3.layertree.WfsButton = function (options) {

    iS3.layertree.BaseButton.call(this, options);

    this.parentObj = options.parentObj;
    var thisCpy = this;
    var buttonElem = this.button;
    var wfsDiv;
    buttonElem.addEventListener('click', function () {
        if (!wfsDiv) {
            wfsDiv = thisCpy.createUI();
            document.body.appendChild(wfsDiv);
            document.getElementById('wfsurl').value = thisCpy.parentObj.parentObj.getConfig().server;

            document.getElementById('addwfs_form').addEventListener('submit', function (evt) {
                evt.preventDefault();
                thisCpy.addWfsLayer(this);
                this.parentNode.style.display = 'none';
            });
        }
        if (wfsDiv.style.display === 'none') {
            wfsDiv.style.display = 'block';
        }
        else {
            wfsDiv.style.display = 'none';
        }
    });
    return buttonElem;
};
iS3.inherits(iS3.layertree.WfsButton, iS3.layertree.BaseButton);

/**
 * Create new button UI
 *
 * @return {Element} Wfs button
 */
iS3.layertree.WfsButton.prototype.createUI = function () {
    var wfsDiv = document.createElement('div');
    wfsDiv.id = 'addwfs';
    wfsDiv.className = 'toggleable';
    wfsDiv.style.display = 'none';

    var wfsForm = document.createElement('form');
    wfsForm.id = 'addwfs_form';
    wfsForm.className = 'addlayer';
    wfsDiv.appendChild(wfsForm);

    var titleP = document.createElement('p');
    titleP.textContent = this.button.title;
    wfsForm.appendChild(titleP);

    var wfsTable = document.createElement('table');

    var firstRow = document.createElement('tr');
    firstRow.innerHTML = '<td>Server URL:</td>'
        + '<td><input id="wfsurl" name="server" type="text" required="required" '
        + 'value="http://localhost:8080/geoserver/wfs"></td>';
    wfsTable.appendChild(firstRow);

    var secondRow = document.createElement('tr');
    secondRow.innerHTML = '<td>Layer name:</td>'
        + '<td><input name="layer" type="text" required="required" value="demo:countries"></td>';
    wfsTable.appendChild(secondRow);

    var thirdRow = document.createElement('tr');
    thirdRow.innerHTML = '<td>Display name:</td>'
        + '<td><input name="displayname" type="text" value="countries"></td>';
    wfsTable.appendChild(thirdRow);

    var forthRow = document.createElement('tr');
    forthRow.innerHTML = '<td>Projection:</td>'
        + '<td><input name="projection" type="text" value="EPSG:4326"></td>';
    wfsTable.appendChild(forthRow);

    var fifthRow = document.createElement('tr');
    fifthRow.innerHTML = '<td><input type="submit" value="Add layer"></td>'
        + '<td><input type="button" value="Cancel" onclick="this.form.parentNode.style.display = \'none\'"></td>';
    wfsTable.appendChild(fifthRow);

    wfsForm.appendChild(wfsTable);
    return wfsDiv;
};

/**
 * New vector layer
 *
 * @param {Element} form Form
 * @return {iS3.layertree.NewButton|null} New button
 */
iS3.layertree.WfsButton.prototype.addWfsLayer = function (form) {
    var layertree = this.parentObj;
    var url = form.server.value + '/wfs';
    url = /^((http)|(https))(:\/\/)/.test(url) ? url : 'http://' + url;
    url = /\?/.test(url) ? url + '&' : url + '?';
    var typeName = form.layer.value;
    var mapProj = layertree.map.getView().getProjection().getCode();
    var proj = form.projection.value || mapProj;
    var parser = new ol.format.GeoJSON();
    var source = new ol.source.Vector({
        wrapX: false,
        strategy: ol.loadingstrategy.bbox
    });
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            source.addFeatures(parser.readFeatures(request.responseText, {
                dataProjection: proj,
                featureProjection: mapProj
            }));
        }
    };
    url = url + 'SERVICE=WFS&REQUEST=GetFeature&TYPENAME=' + typeName
        + '&VERSION=1.1.0&outputFormat=application%2Fjson&SRSNAME=' + proj;
    request.open('GET', url);
    request.send();
    var layer = new ol.layer.Vector({
        source: source
    });
    layer.set('id', form.server.value + ':' + form.layer.value);
    layertree.addBufferIcon(layer);
    layertree.map.addLayer(layer);
    layertree.message.textContent = 'WFS layer added successfully.';

    return this;
};
