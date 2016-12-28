/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */

/**
 * The extend function
 *
 * @param {any} childCtor Child class
 * @param {any} parentCtor Parent class
 */
iS3.inherits = function (childCtor, parentCtor) {

    /**
     * Temp object
     *
     * @constructor
     */
    function TempCtor() {
    }

    TempCtor.prototype = parentCtor.prototype;
    childCtor.superClass = parentCtor.prototype;
    childCtor.prototype = new TempCtor();

    /** @override */
    childCtor.prototype.constructor = childCtor;

    /**
     * Calls superclass constructor/method.
     *
     * This function is only available if you use goog.inherits to
     * express inheritance relationships between classes.
     *
     * NOTE: This is a replacement for goog.base and for superClass_
     * property defined in childCtor.
     *
     * @param {!Object} me Should always be "this".
     * @param {string} methodName The method name to call. Calling
     *     superclass constructor can be done with the special string
     *     'constructor'.
     * @param {...*} varArgs The arguments to pass to superclass
     *     method/constructor.
     * @return {*} The return value of the superclass method/constructor.
     */
    childCtor.base = function (me, methodName, varArgs) {
        // Copying using loop to avoid deop due to passing arguments object to
        // function. This is faster in many JS engines as of late 2014.
        var args = new Array(arguments.length - 2);
        for (var i = 2; i < arguments.length; i++) {
            args[i - 2] = arguments[i];
        }
        return parentCtor.prototype[methodName].apply(me, args);
    };
};
