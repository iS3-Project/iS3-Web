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
iS3.layertree.OutputButton = function (options) {

    iS3.layertree.BaseButton.call(this, options);

    this.parentObj = options.parentObj;
    var thisCpy = this;
    var buttonElem = this.button;
    var outputDiv;
    buttonElem.addEventListener('click', function () {
        if (!outputDiv) {
            outputDiv = thisCpy.createUI();
            document.body.appendChild(outputDiv);

            document.getElementById('addOutput_form').addEventListener('submit', function (evt) {
                evt.preventDefault();
                thisCpy.outputLayer(this);
                this.parentNode.style.display = 'none';
            });
        }
        if (outputDiv.style.display === 'none') {
            var layerOption = document.getElementById('outputlayeropt');
            iS3.domTool.removeContent(layerOption);
            var childrent = thisCpy.parentObj.layerContainer.childNodes;
            for (var child in childrent) {
                if (childrent[child].nodeType === 1) {
                    layerOption.appendChild(iS3.domTool.createOption(childrent[child].title, childrent[child].id));
                }
            }
            outputDiv.style.display = 'block';
        }
        else {
            outputDiv.style.display = 'none';
        }
    });
    return buttonElem;
};
iS3.inherits(iS3.layertree.OutputButton, iS3.layertree.BaseButton);

/**
 * Create new button UI
 *
 * @return {Element} output button
 */
iS3.layertree.OutputButton.prototype.createUI = function () {
    var lang = iS3Project.getConfig().lang;
    var outputDiv = document.createElement('div');
    outputDiv.id = 'addOutput';
    outputDiv.className = 'toggleable';
    outputDiv.style.display = 'none';

    var outputForm = document.createElement('form');
    outputForm.id = 'addOutput_form';
    outputForm.className = 'addlayer';
    outputDiv.appendChild(outputForm);

    var titleP = document.createElement('p');
    titleP.textContent = this.button.title;
    outputForm.appendChild(titleP);

    var outputTable = document.createElement('table');

    var firstRow = document.createElement('tr');
    firstRow.innerHTML = '<td>' + lang.outputFile + ':</td>'
        + '<td><select id="outputlayeropt" name="layer" required="required"></td>';
    outputTable.appendChild(firstRow);

    var secondRow = document.createElement('tr');
    secondRow.innerHTML = '<td>' + lang.type + ':</td>'
        + '<td><select name="format" required="required">'
        + '<option value="panotimeb">PanotimeB</option>'
        + '<option value="shapefile">Shapefile</option>'
        + '<option value="geojson">GeoJSON</option>'
        + '</select></td>';
    outputTable.appendChild(secondRow);

    var thirdRow = document.createElement('tr');
    thirdRow.innerHTML = '<td><input type="submit" value="' + lang.export + '"></td>'
        + '<td><input type="button" value="' + lang.cancel
        + '" onclick="this.form.parentNode.style.display = \'none\'"></td>';
    outputTable.appendChild(thirdRow);

    outputForm.appendChild(outputTable);
    return outputDiv;
};

/**
 * New vector layer
 *
 * @param {Element} form Form
 * @return {iS3.layertree.OutputButton|null} New button
 */
iS3.layertree.OutputButton.prototype.outputLayer = function (form) {
    var layertree = this.parentObj;
    var layerDef = layertree.getLayerDefById(form.layer.value);
    try {
        var layer = layertree.getLayerById(form.layer.value);
        var dataProjection = layertree.map.getView().getProjection();
        if (layer instanceof ol.layer.Vector) {
            var sourceFormat;
            switch (form.format.value) {
                case 'panotimeb':
                    sourceFormat = new iS3.format.PanotimeB();
                    break;
                case 'shapefile':
                    sourceFormat = new iS3.format.Shapefile();
                    break;
                case 'geojson':
                    sourceFormat = new ol.format.GeoJSON();
                    break;
                default:
                    return false;
            }

            var result = sourceFormat.writeFeatures(layer.getSource().getFeatures(), {
                dataProjection: ol.proj.get('EPSG:4326'),
                featureProjection: dataProjection
            });
            var name = form.layer.options[form.layer.selectedIndex].text;
            if (result) {
                var file = new File([result], name + '.txt', {encoding: 'utf-8', type: 'text/plain;charset=utf-8'});
                iS3.saveAs(file, name + '.txt', true);
            }
        }

    } catch (error) {
        layertree.message.textContent = 'Some unexpected error occurred: (' + error.message + ').';
    }
};
