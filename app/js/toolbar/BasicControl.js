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
iS3.toolbar.BasicControl = function (options) {

    var controlButton = document.createElement('button');
    // controlButton.title = options.tipLabel || 'Custom interaction';
    controlButton.setAttribute('data-tooltip', options.tipLabel || 'Custom interaction');
    controlButton.setAttribute('data-position', 'bottom left');
    controlButton.className = 'ui button';

    var icon = document.createElement('i');
    var iconName = iS3.toolbar.BasicControl.getIcon(options.className);

    icon.className = iconName;

    controlButton.appendChild(icon);


    ol.control.Control.call(this, {
        element: controlButton,
        target: options.target
    });
    this.setDisabled = function (bool) {
        if (typeof bool === 'boolean') {
            controlButton.disabled = bool;
            return this;
        }
    };

    var thisCpy = this;
    // custom toggle button
    if (options.type && options.type === 'toggle') {
        thisCpy.setProperties({
            active: false,
            type: 'toggle',
            toggleGroup: options.toggleGroup || 'Global'
            // alive: options.alive || false
        });
        thisCpy.on('change:active', function () {
            if (this.get('active')) {
                controlButton.classList.add('active');
                options.trigger();
            } else {
                controlButton.classList.remove('active');
                options.destroy();
            }
        }, this);
        controlButton.addEventListener('click', function () {
            if (thisCpy.get('active')) {
                thisCpy.set('active', false);
            } else {
                thisCpy.set('active', true);
            }
        });
    } else {
        controlButton.addEventListener('click', options.trigger);
    }
};
ol.inherits(iS3.toolbar.BasicControl, ol.control.Control);

iS3.toolbar.BasicControl.getIcon = function (name) {

    if(name === 'ol-zoom-layer')
        return 'expand icon';

    if(name === 'ol-zoom-selected')
        return 'map marker alternate icon';

    if(name === 'ol-deselect')
        return 'circle notch icon';

    if(name === 'iS3-clickquery')
        return 'info icon';

    return 'question icon'
};
