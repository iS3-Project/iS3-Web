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

    var controlDiv = document.createElement('div');
    controlDiv.className = options.className || 'ol-unselectable ol-control';
    var controlButton = document.createElement('button');
    controlButton.textContent = options.label || 'I';
    controlButton.title = options.tipLabel || 'Custom interaction';
    controlDiv.appendChild(controlButton);


    ol.control.Control.call(this, {
        element: controlDiv,
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
            alive: options.alive || false
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
