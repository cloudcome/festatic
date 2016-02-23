/*!
 * jquery.fn.mousewheel
 * @author ydr.me
 * @for ie6+、chrome、firefox
 * @version 1.1
 */


/**
 * v1.0
 * 2013年12月3日16:10:27
 * 构造
 *
 * v1.1
 * 2014年3月7日15:06:02
 * 完善兼容到ie6
 * 调整滚动幅度，在各浏览器尽量表现一致
 * 2014年3月20日23:16:07
 * 鼠标滚轮结束返回滚动距离，正值为上，负值为下
 * 2014年5月30日23:27:23
 * 增加“enabled”和“disabled”两个命令
 */




/**
 * 1. 详细参数配置
 * $("#demo-1").mousewheel();
 *
 * 2. 只监听滚动
 * $("#demo-2").mousewheel(function(){});
 *
 */


// 参考 https://github.com/brandonaaron/jquery-mousewheel/blob/master/jquery.mousewheel.js
(function($, undefined) {
    var _,
        prefix = 'jquery-mousewheel____',
        eventType = 'wheel mousewheel DOMMouseScroll MozMousePixelScroll',
        defaults = {
            // 延时监听滚动停止事件的时间（单位毫秒）
            delay: 456,
            // this：this
            // 开始滚动回调
            onmousewheelstart: function() {},
            // 正在滚动回调
            // this：this
            // 参数1：滚动的距离
            onmousewheel: function(y) {},
            // 滚动停止回调
            // this：this
            // 参数1：
            onmousewheelstop: function() {}
        };

    $.fn.mousewheel = function(settings) {
        var args = arguments,
            argL = args.length;

        return this.each(function() {
            var $the = $(this),
                the = $the[0],
                isInit,
                wheelLength = 0,
                fn;

            if ($the.data(prefix + "isInit") === undefined) $the.data(prefix + "isInit", 0);
            if ($the.data(prefix + "timer") === undefined) $the.data(prefix + "timer", 0);
            if ($the.data(prefix + "isScroll") === undefined) $the.data(prefix + "isScroll", 0);
            if ($the.data(prefix + "eventReturn") === undefined) $the.data(prefix + "eventReturn", !1);
            isInit = $the.data(prefix + "isInit");

            fn = function(e) {
                var wheelDeltaY,
                    timer,
                    isScroll,
                    oe = e.originalEvent,
                    options = $the.data(prefix + "options");

                // chrome
                if ('wheelDeltaX' in oe) {
                    wheelDeltaY = oe.wheelDeltaY / 120;
                    wheelDeltaY = oe.wheelDeltaY > 0 ? 1 : -1;
                }
                // ie9/firefox
                else if ('deltaY' in oe) {
                    // wheelDeltaY = -oe.deltaY / 120;
                    wheelDeltaY = oe.deltaY > 0 ? -1 : 1;
                }
                // ie8/ie7/ie6
                else if ('wheelDelta' in oe) {
                    // wheelDeltaY = oe.wheelDelta / 120;
                    wheelDeltaY = oe.wheelDelta > 0 ? 1 : -1;
                }
                // other
                else {
                    wheelDeltaY = 0;
                }

                wheelDeltaY = Math.round(wheelDeltaY);

                if (wheelDeltaY) {
                    timer = $the.data(prefix + "timer");
                    isScroll = $the.data(prefix + "isScroll");
                    if (timer) {
                        clearTimeout(timer);
                        $the.data(prefix + "timer", 0);
                    }

                    if (!isScroll) {
                        $the.data(prefix + "isScroll", 1);
                        options.onmousewheelstart.call($the[0]);
                    }

                    wheelLength += wheelDeltaY;
                    options.onmousewheel.call($the[0], wheelDeltaY);

                    $the.data(prefix + "timer", setTimeout(function() {
                        options.onmousewheelstop.call($the[0], wheelLength);
                        wheelLength = 0;
                        $the.data(prefix + "isScroll", 0);
                    }, options.delay));
                }

                return $the.data(prefix + "eventReturn");
            }

            // 1、callback
            if ($.type(args[0]) == "function") {
                if (!isInit) {
                    defaults.onmousewheel = args[0];
                    $the.bind(eventType, fn);
                    $the.data(prefix + "isInit", 1);
                    $the.data(prefix + "options", defaults);
                }
            }
            // 2、options
            else if ($.type(args[0]) == "object") {
                if (!isInit) {
                    var options = $.extend({}, defaults, args[0]);
                    $the.bind(eventType, fn);
                    $the.data(prefix + "isInit", 1);
                    $the.data(prefix + "options", options);
                }
            }
            // 3、enabled、disabled
            else if ($.type(args[0]) == "string") {
                $the.data(prefix + "eventReturn", args[0] === 'enabled' ? !1 : !0);
            }
        });
    }

    $.fn.mousewheel.defaults = defaults;
})(jQuery);
