/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */

/**
 * The constructor function
 */
iS3.domTool = function () {

};

/**
 * Remove all children of a dom element
 *
 * @param {document.element} element Document element
 * @return {document} Return the input element
 */
iS3.domTool.removeContent = function (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    return element;
};

/**
 * Stop event propagation on an element
 *
 * @param {document.element} element Document element
 * @param {string} event The name of event
 * @return {document.element} Return the input element
 */
iS3.domTool.stopPropagationOnEvent = function (element, event) {
    element.addEventListener(event, function (evt) {
        evt.stopPropagation();
    });
    return element;
};

/**
 * To create an option
 *
 * @param {document.element} optionContent Option content
 * @param {Array} optionValue Value of option
 * @return {document.element} Return the input element
 */
iS3.domTool.createOption = function (optionContent, optionValue) {
    var option = document.createElement('option');
    option.textContent = optionContent;
    option.value = optionValue ? optionValue : optionContent;
    return option;
};

/**
 * Check the input if a number
 *
 * @param {Object} n Input
 * @return {boolean} Return
 */
iS3.domTool.isNumber = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 * Active tab in Goldenlayout when the tab is in 'stack' content item
 *
 * @param {GoldenLayout} layout Layout
 * @param {String} componentName Name
 */
iS3.domTool.activeTabByComponentName = function (layout, componentName) {
    var allContentItems = layout.root.contentItems;
    for (var i in allContentItems) {
        var stacks = allContentItems[i].getItemsByType('stack');
        for (var j in stacks) {
            var tabs = stacks[j].header.tabs;
            for (var k in tabs) {
                if (tabs[k].contentItem.componentName === componentName) {
                    stacks[j].header.setActiveContentItem(tabs[k].contentItem);
                }
            }
        }
    }
};
