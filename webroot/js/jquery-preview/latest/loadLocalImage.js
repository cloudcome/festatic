/************************************************
 ** 加载本地图片【默认100%宽，100%高】
 ** 兼容性读取本地图片
 ** @参数1：input:file
 ** @参数2：要盛放图片的容器id
 **  @参数3：回调函数
 ** 兼容ie6-9、谷歌20+、火狐15+
 ** 2012年11月8日13:38:19
 **  2013年3月14日9:45:27
 *************************************************/
/**
 * ie equals one of false¦6¦7¦8¦9 values, ie5 is fucked down.
 * Based on the method: https://gist.github.com/527683
 */
var ie = function () {
    var v = 4,
        div = document.createElement('div'),
        i = div.getElementsByTagName('i');
    do {
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->';
    } while (i[0]);
    return v > 5 ? v : false;
}();

function loadLocalImage(file, id, fn) {
    var ie6 = (ie == 6) ? true : false;
    var div = document.getElementById(id);
    var wh = 'width:100%;height:100%;display:block;vertical-align:top;';
    var arg = arguments.length;
    if (file.files && file.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(file.files[0]);
        reader.onload = function (evt) {
            div.innerHTML = '<img src="' + reader.result + '" style="' + wh + '">';
            arg == 3 ?
                fn() : '';
        }
    } else {
        if (ie6) {
            div.innerHTML = '<img src="' + file.value + '" style="' + wh + '"/>';
            arg == 3 ?
                fn() : '';
        } else {
            var filter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=image);';
            var id = "__iefilterimg" + new Date().getTime() + "__";
            var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
            file.select();
            var src = document.selection.createRange().text;
            div.innerHTML = '<img id="' + id + '" style="' + filter + '">';
            var img = document.getElementById(id);
            img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
            div.innerHTML = "<img style='" + wh + sFilter + src + "\"' />";
            arg == 3 ?
                fn() : '';
        }
    }
}
