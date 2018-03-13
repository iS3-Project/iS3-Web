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
ol.control.Interaction = function (options) {

    var controlDiv = document.createElement('div');
    controlDiv.className = options.className || 'ol-unselectable ol-control';
    var controlButton = document.createElement('button');
    controlButton.textContent = options.label || 'I';
    controlButton.title = options.tipLabel || 'Custom interaction';
    controlDiv.appendChild(controlButton);
    this.setDisabled = function (bool) {
        if (typeof bool === 'boolean') {
            controlButton.disabled = bool;
            return this;
        }
    };
    var thisCpy = this;
    controlButton.addEventListener('click', function () {
        if (thisCpy.get('interaction').getActive()) {
            thisCpy.set('active', false);
        } else {
            thisCpy.set('active', true);
        }
    });
    var interaction = options.interaction;
    ol.control.Control.call(this, {
        element: controlDiv,
        target: options.target
    });
    this.setProperties({
        interaction: interaction,
        active: false,
        type: 'toggle',
        alive: options.alive || false,
        destroyFunction: function (evt) {
            if (evt.element === thisCpy) {
                this.removeInteraction(thisCpy.get('interaction'));
            }
        }
    });
    this.on('change:active', function () {
        this.get('interaction').setActive(this.get('active'));
        if (this.get('active')) {
            controlButton.classList.add('active');
        } else {
            controlButton.classList.remove('active');
        }
    }, this);
};
ol.inherits(ol.control.Interaction, ol.control.Control);

/**
 * Set map to the control
 *
 * @param {ol.map} map Map
 */
ol.control.Interaction.prototype.setMap = function (map) {
    ol.control.Control.prototype.setMap.call(this, map);
    var interaction = this.get('interaction');
    if (map === null) {
        ol.Observable.unByKey(this.get('eventId'));
    } else if (map.getInteractions().getArray().indexOf(interaction) === -1) {
        map.addInteraction(interaction);
        interaction.setActive(false);
        this.set('eventId', map.getControls().on('remove', this.get('destroyFunction'), map));
    }
};

/**
 * Handle event
 *
 * @param {iS3.ToolGroup} group Group
 * @param {ol.control.Interaction} interaction Interaction
 * @param {string} type Type
 * @return {ol.control.Interaction} Interaction
 */
ol.control.Interaction.handleEvents = function (group, interaction, type) {
    var layertree = iS3Project.getLayertree();

    if (type !== 'point') {
        interaction.on('drawstart', function (evt) {
            var error = false;
            if (layertree.selectedLayer) {
                var selectedLayer = layertree.getLayerById(layertree.selectedLayer.id);
                var layerType = selectedLayer.get('type');
                error = (layerType !== type && layerType !== 'geomcollection');
            } else {
                error = true;
            }
            if (error) {
                interaction.finishDrawing();
            }
        }, this);
    }
    interaction.on('drawend', function (evt) {
        var error = '';
        var selectedLayer;
        error: if (layertree.selectedLayer) {
            selectedLayer = layertree.getLayerById(layertree.selectedLayer.id);
            error = selectedLayer instanceof ol.layer.Vector ? '' : 'Please select a valid vector layer.';
            if (error) {
                break error;
            }
            var layerType = selectedLayer.get('type');
            error = (layerType === type || layerType === 'geomcollection') ? ''
                : 'Selected layer has a different vector type.';
        } else {
            error = 'Please select a layer first.';
        }
        if (!error) {
            selectedLayer.getSource().addFeature(evt.feature);
            group.activeFeatures.push(evt.feature);
        } else {
            layertree.message.textContent = error;
        }
    }, this);
    return interaction;
};
