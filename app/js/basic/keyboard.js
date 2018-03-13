/**
 * @file
 * @author Lin Xiaodong<linxdcn@gmail.com>
 */

/* globals Mousetrap */

/**
 * Created by linxiaodong on 2016/12/27.
 */

Mousetrap.bind('f2', function () {
    $('.ol-dragpan :button').click();
});

Mousetrap.bind('ctrl+q', function () {
    $('.iS3-gisquality :button').click();
});

Mousetrap.bind('1', function () {
    $('#gischeck-mark-isolated').click();
});

Mousetrap.bind('2', function () {
    $('#gischeck-mark-repeated').click();
});

Mousetrap.bind('3', function () {
    $('#gischeck-mark-link').click();
});

Mousetrap.bind('4', function () {
    $('#gischeck-mark-reset').click();
});