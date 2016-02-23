/*!
 * jquery.fn.mousewheel
 * @author 云淡然 http://qianduanblog.com
 * @for ie9(含)+、chrome、firefox
 * @version 1.0
 * 2013年12月3日16:10:27
 */


/**
 * 1. 详细参数配置
 * $("#demo-1").mousewheel({...});
 *
 * 2. 只监听滚动
 * $("#demo-2").mousewheel(function(){});
 *
 */



;
(function ($, undefined) {
	var _,
		prefix = 'jquery-mousewheel____',
		defaults = {
			// 延时监听滚动停止事件的时间（单位毫秒）
			delay: 456,
			// 开始滚动回调
			onmousewheelstart: function () {},
			// 正在滚动回调，参数1：滚动的距离
			onmousewheel: function (y) {},
			// 滚动停止回调
			onmousewheelstop: function () {},
		};

	$.fn.mousewheel = function (settings) {
		var _,
			args = arguments,
			argL = args.length;

		return this.each(function () {
			var _, $the = $(this),
				the = $the[0],
				isInit,
				fn;

			if ($the.data(prefix + "isInit") === undefined) $the.data(prefix + "isInit", 0);
			if ($the.data(prefix + "timer") === undefined) $the.data(prefix + "timer", 0);
			if ($the.data(prefix + "isScroll") === undefined) $the.data(prefix + "isScroll", 0);
			isInit = $the.data(prefix + "isInit");

			fn = function (e) {
				var wheelDeltaX,
					wheelDeltaX,
					timer,
					isScroll,
					options = $the.data(prefix + "options");

				// chrome
				if ('wheelDeltaX' in e) {
					wheelDeltaX = e.wheelDeltaX / 120;
					wheelDeltaY = e.wheelDeltaY / 120;
				}
				// ie
				else if ('wheelDelta' in e) {
					wheelDeltaX = wheelDeltaY = e.wheelDelta / 120;
				} else if ('detail' in e) {
					wheelDeltaX = wheelDeltaY = -e.detail / 3;
				} else {
					wheelDeltaX = wheelDeltaY = 0;
				}

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

					options.onmousewheel.call($the[0], wheelDeltaY);

					$the.data(prefix + "timer", setTimeout(function () {
						options.onmousewheelstop.call($the[0]);
						$the.data(prefix + "isScroll", 0);
					}, options.delay));
				}

				if (e.preventDefault) e.preventDefault();
				if (e.stopproPagation) e.stopproPagation();
			}

			// 1、callback
			if ($.type(args[0]) == "function") {
				if (!isInit) {
					defaults.onmousewheel = args[0];
					the.addEventListener("mousewheel", fn, 0);
					the.addEventListener("DOMMouseScroll", fn, 0);
					$the.data(prefix + "isInit", 1);
					$the.data(prefix + "options", defaults);
				}
			}
			// 2、options
			else if ($.type(args[0]) == "object") {
				if (!isInit) {
					var options = $.extend({}, defaults, args[0]);
					the.addEventListener("mousewheel", fn, 0);
					the.addEventListener("DOMMouseScroll", fn, 0);
					$the.data(prefix + "isInit", 1);
					$the.data(prefix + "options", options);
				}
			}
		});
	}

	$.fn.mousewheel.defaults = defaults;

})(jQuery);
