/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */
/* globals ol */

/**
 * Construction function
 *
 * @param {Object} options Options
 * @constructor
 */
iS3.layertree.RemoveButton = function (options) {

    iS3.layertree.BaseButton.call(this, options);

    var layertree = options.parentObj;
    var buttonElem = this.button;
    buttonElem.addEventListener('click', function () {
        if (layertree.selectedLayer) {
            var layer = layertree.getLayerById(layertree.selectedLayer.id);
            layertree.map.removeLayer(layer);
            layertree.message.textContent = 'Layer removed successfully.';
        } else {
            layertree.message.textContent = 'No selected layer to remove.';
        }
    });
    return buttonElem;
};
iS3.inherits(iS3.layertree.RemoveButton, iS3.layertree.BaseButton);