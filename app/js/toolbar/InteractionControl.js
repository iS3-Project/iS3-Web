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

    var controlButton = document.createElement('button');
    // controlButton.title = options.tipLabel || 'Custom interaction';
    controlButton.setAttribute('data-tooltip', options.tipLabel || 'Custom interaction');
    controlButton.setAttribute('data-position', 'bottom left');
    controlButton.className = 'ui button';

    var icon = document.createElement('i');
    var iconName = ol.control.Interaction.getIcon(options.className);

    icon.className = iconName;
    controlButton.appendChild(icon);

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
        element: controlButton,
        target: options.target
    });
    this.setProperties({
        interaction: interaction,
        active:false,
        type: 'toggle',
        toggleGroup: options.toggleGroup || 'Global',
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

ol.control.Interaction.getIcon = function (name) {

    if(name === 'ol-dragpan')
        return 'hand paper icon';

    if(name === 'ol-singleselect')
        return 'genderless icon';

    if(name === 'ol-singleselect')
        return 'genderless icon';

    if(name === 'ol-multiselect')
        return 'cube icon';

    if(name === 'ol-polygonselect')
        return 'connectdevelop icon';

    if(name === 'ol-addpoint')
        return 'pencil alternate icon';

    if(name === 'ol-addline')
        return 'minus icon';

    if(name === 'ol-addpolygon')
        return 'square icon';

    if(name === 'ol-removefeat')
        return 'eraser icon';

    if(name === 'ol-dragfeat')
        return 'hand rock icon';

    if(name === 'ol-lineString-measure')
        return 'road icon';

    if(name === 'ol-polygon-measure')
        return 'map icon';
    return 'question icon'
};