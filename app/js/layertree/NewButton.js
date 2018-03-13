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
iS3.layertree.NewButton = function (options) {

    iS3.layertree.BaseButton.call(this, options);

    this.parentObj = options.parentObj;
    var thisCpy = this;
    var buttonElem = this.button;
    var newDiv;
    buttonElem.addEventListener('click', function () {
        if (!newDiv) {
            newDiv = thisCpy.createUI();
            document.body.appendChild(newDiv);

            document.getElementById('newlayer_form').addEventListener('submit', function (evt) {
                evt.preventDefault();
                thisCpy.newVectorLayer(this);
                this.parentNode.style.display = 'none';
            });
        }
        if (newDiv.style.display === 'none') {
            newDiv.style.display = 'block';
        }
        else {
            newDiv.style.display = 'none';
        }
    });
    return buttonElem;
};
iS3.inherits(iS3.layertree.NewButton, iS3.layertree.BaseButton);

/**
 * Create new button UI
 *
 * @return {Element} New button
 */
iS3.layertree.NewButton.prototype.createUI = function () {
    var lang = iS3Project.getConfig().lang;
    var newDiv = document.createElement('div');
    newDiv.id = 'newLayer';
    newDiv.className = 'toggleable';
    newDiv.style.display = 'none';

    var newForm = document.createElement('form');
    newForm.id = 'newlayer_form';
    newForm.className = 'addlayer';
    newDiv.appendChild(newForm);

    var titleP = document.createElement('p');
    titleP.textContent = this.button.title;
    newForm.appendChild(titleP);

    var newTable = document.createElement('table');

    var firstRow = document.createElement('tr');
    firstRow.innerHTML = '<td>' + lang.displayName + ':</td>'
        + '<td><input name="displayname" type="text" value="unnamed"></td>';
    newTable.appendChild(firstRow);

    var secondRow = document.createElement('tr');
    secondRow.innerHTML = '<td>' + lang.type + ':</td>'
        + '<td><select name="type" required="required">'
        + '<option value="point">Point</option>'
        + '<option value="line">Line</option>'
        + '<option value="polygon">Polygon</option>'
        + '<option value="geomcollection">Geometry Collection</option>'
        + '</select></td>';
    newTable.appendChild(secondRow);

    var thirdRow = document.createElement('tr');
    thirdRow.innerHTML = '<td><input type="submit" value="' + lang.addLayer + '"></td>'
        + '<td><input type="button" value="'
        + lang.cancel + '" onclick="this.form.parentNode.style.display = \'none\'"></td>';
    newTable.appendChild(thirdRow);

    newForm.appendChild(newTable);
    return newDiv;
};

/**
 * New vector layer
 *
 * @param {Element} form Form
 * @return {iS3.layertree.NewButton|null} New button
 */
iS3.layertree.NewButton.prototype.newVectorLayer = function (form) {
    var layertree = this.parentObj;
    var type = form.type.value;
    if (type !== 'point' && type !== 'line' && type !== 'polygon' && type !== 'geomcollection') {
        layertree.message.textContent = 'Unrecognized layer type.';
        return null;
    }
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            wrapX: false
        }),
        style: iS3.style.getDefault(),
        name: form.displayname.value || 'Unnamed Layer',
        type: type
    });
    var id = 'Local:' + form.displayname.value;
    layer.set('id', id);
    iS3Project.getLayerDefs()['Local:' + form.displayname.value] = new iS3.LayerDef({
        id: id,
        name: id
    });
    layertree.addBufferIcon(layer);
    layertree.map.addLayer(layer);
    layer.getSource().changed();
    layertree.message.textContent = 'New vector layer created successfully.';
    return this;
};
