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
iS3.layertree.InputButton = function (options) {

    iS3.layertree.BaseButton.call(this, options);

    this.parentObj = options.parentObj;
    var thisCpy = this;
    var buttonElem = this.button;
    var inputDiv;
    buttonElem.addEventListener('click', function () {
        if (!inputDiv) {
            inputDiv = thisCpy.createUI();
            document.body.appendChild(inputDiv);

            document.getElementById('addInput_form').addEventListener('submit', function (evt) {
                evt.preventDefault();
                thisCpy.addInputLayer(this);
                this.parentNode.style.display = 'none';
            });
        }
        if (inputDiv.style.display === 'none') {
            inputDiv.style.display = 'block';
        }
        else {
            inputDiv.style.display = 'none';
        }
    });
    return buttonElem;
};
iS3.inherits(iS3.layertree.InputButton, iS3.layertree.BaseButton);

/**
 * Create input layer UI
 *
 * @return {Element} UI element
 */
iS3.layertree.InputButton.prototype.createUI = function () {
    var lang = iS3Project.getConfig().lang;
    var inputDiv = document.createElement('div');
    inputDiv.id = 'addInput';
    inputDiv.className = 'toggleable';
    inputDiv.style.display = 'none';

    var inputForm = document.createElement('form');
    inputForm.id = 'addInput_form';
    inputForm.className = 'addlayer';
    inputDiv.appendChild(inputForm);

    var titleP = document.createElement('p');
    titleP.textContent = this.button.title;
    inputForm.appendChild(titleP);

    var inputTable = document.createElement('table');

    var firstRow = document.createElement('tr');
    firstRow.innerHTML = '<td>' + lang.inputFile + ':</td>'
        + '<td><input name="file" type="file" required="required"></td>';
    inputTable.appendChild(firstRow);

    var secondRow = document.createElement('tr');
    secondRow.innerHTML = '<td>' + lang.type + ':</td>'
        + '<td><select name="format" required="required">'
        + '<option value="panotimeb">PanotimeB</option>'
        + '<option value="shapefile">Shapefile</option>'
        + '<option value="geojson">GeoJSON</option>'
        + '</select></td>';
    inputTable.appendChild(secondRow);

    var thirdRow = document.createElement('tr');
    thirdRow.innerHTML = '<td><input type="submit" value="' + lang.addLayer + '"></td>'
        + '<td><input type="button" value="' + lang.cancel
        + '" onclick="this.form.parentNode.style.display = \'none\'"></td>';
    inputTable.appendChild(thirdRow);

    inputForm.appendChild(inputTable);
    return inputDiv;
};

/**
 * Add input layer
 *
 * @param {Element} form Input form
 */
iS3.layertree.InputButton.prototype.addInputLayer = function (form) {
    var layertree = this.parentObj;
    var file = form.file.files[0];
    var id = 'Local:Local:' + file.name.substr(0, file.name.lastIndexOf('.'));
    var currentProj = layertree.map.getView().getProjection();
    var dataProjection;

    try {
        var fr = new FileReader();
        var sourceFormat;
        var source = new ol.source.Vector({
            wrapX: false
        });
        var layer = new ol.layer.Vector({
            source: source,
            style: iS3.style.getDefault()
        });
        layer.set('id', id);
        layertree.addBufferIcon(layer);
        layertree.map.addLayer(layer);
        layertree.message.textContent = 'Vector layer added successfully.';

        if (form.format.value === 'shapefile') {
            sourceFormat = new iS3.format.Shapefile();
            sourceFormat.readFeatures(file, {targetSrs: currentProj}, function (features) {
                source.addFeatures(features);
            });
        }
        else {
            fr.readAsText(file);
            fr.onload = function (evt) {
                var vectorData = evt.target.result;
                switch (form.format.value) {
                    case 'panotimeb':
                        sourceFormat = new iS3.format.PanotimeB({name: file.name});
                        break;
                    case 'geojson':
                        sourceFormat = new ol.format.GeoJSON();
                        break;
                    default:
                        return false;
                }
                dataProjection = sourceFormat.readProjection(vectorData) || currentProj;
                var features = sourceFormat.readFeatures(vectorData, {
                    dataProjection: dataProjection,
                    featureProjection: currentProj
                });
                source.addFeatures(features);
            };
        }

    } catch (error) {
        layertree.message.textContent = 'Some unexpected error occurred: (' + error.message + ').';
    }
};