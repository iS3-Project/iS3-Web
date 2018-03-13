/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals iS3 */

/**
 * Construction function
 *
 * @param {Array} options Options
 * @constructor
 */
iS3.DraggableDiv = function (options) {
    this.id = options.id;
    this.title = options.title;
    this.width = options.width ? options.width : document.body.clientWidth * 0.3;
    this.height = options.height ? options.height : document.body.clientHeight * 0.3;
    this.left = (document.body.clientWidth) ? (document.body.clientWidth - this.width) / 2 : 0;
    this.top = (document.body.clientHeight) ? (document.body.clientHeight - this.height) / 2 : 0;

    var popupDiv = document.createElement('div');
    popupDiv.setAttribute('id', this.id);
    popupDiv.setAttribute('class', 'draggable-div');
    var popupBar = document.createElement('div');
    popupBar.setAttribute('class', 'draggable-bar');
    popupBar.appendChild(document.createTextNode(this.title));
    var closeSpan = document.createElement('span');
    closeSpan.setAttribute('class', 'draggable-close');
    closeSpan.appendChild(document.createTextNode('[X]'));
    popupBar.appendChild(closeSpan);
    popupDiv.appendChild(popupBar);
    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'draggable-content');
    popupDiv.appendChild(contentDiv);

    // close button
    var thisCpy = this;
    closeSpan.onclick = function (e) {
        thisCpy.close();
    };

    // draggable event
    var offset = {x: 0, y: 0};
    popupBar.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
    function mouseUp() {
        window.removeEventListener('mousemove', popupMove, true);
    }

    function mouseDown(e) {
        offset.x = e.clientX - popupDiv.offsetLeft;
        offset.y = e.clientY - popupDiv.offsetTop;
        window.addEventListener('mousemove', popupMove, true);
    }

    function popupMove(e) {
        popupDiv.style.position = 'absolute';
        var top = e.clientY - offset.y;
        var left = e.clientX - offset.x;
        popupDiv.style.top = top + 'px';
        popupDiv.style.left = left + 'px';
    }

    // style
    // popupDiv.style.minWidth = this.width + 'px';
    // popupDiv.style.minHeight = this.height + 'px';
    popupDiv.style.width = 'auto';
    popupDiv.style.height = 'auto';
    popupDiv.style.left = this.left + 'px';
    popupDiv.style.top = this.top + 'px';
    popupDiv.style.display = 'none';
    document.body.appendChild(popupDiv);

    this._container = popupDiv;
    this.content = contentDiv;
};

/**
 * Get content
 * @return {Element|*} Content element
 */
iS3.DraggableDiv.prototype.getContent = function () {
    return this.content;
};

/**
 * Check if visible
 * @return {boolean} Visible
 */
iS3.DraggableDiv.prototype.isVisible = function () {
    return (this._container.style.display === 'block');
};

/**
 * Show the div
 */
iS3.DraggableDiv.prototype.show = function () {
    this._container.style.display = 'block';
};

/**
 * Close the div
 */
iS3.DraggableDiv.prototype.close = function () {
    this._container.style.display = 'none';
};
