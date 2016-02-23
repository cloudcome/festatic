/*!
 * jquery.fn.swipe
 * @author 云淡然 http://qianduanblog.com
 * @for html5手机浏览器
 * @version 1.0
 * 2013年11月4日16:55:35
 */


/**
 * $("#demo").swipe({...});
 */


(function($, undefined) {
	var _,
		prefix = 'jquery-swipe____',
		defaults = {
			// 最小的滑动距离（单位px），只有滑动距离大于该值时才会触发
			minSwipeLength: 10,
			// 滑动开始回调
			onswipestart: null,
			// 滑动过程回调（参数1：水平滑动位移，单位px，参数2：垂直滑动位移，单位px）
			onswipe: null,
			// 滑动结束回调（参数1：水平滑动位移，单位px，参数2：垂直滑动位移，单位px）
			onswipeend: null,
			// 向左滑动回调（参数1：滑动的距离，单位px）
			onswipeleft: null,
			// 向右滑动回调（参数1：滑动的距离，单位px）
			onswiperight: null,
			// 向上滑动回调（参数1：滑动的距离，单位px）
			onswipetop: null,
			// 向下滑动回调（参数1：滑动的距离，单位px）
			onswipebottom: null
		};


	$.fn.swipe = function(settings) {
		var options = $.extend({}, defaults, settings);
		return this.each(function() {
			var the = this;
			_listen(the, "touchstart", function(e) {
				// e.preventDefault();
				$(this).data(prefix + "x1", e.touches[0].pageX);
				$(this).data(prefix + "y1", e.touches[0].pageY);

				if ($.isFunction(options.onswipestart)) {
					options.onswipestart.call(the);
					e.stopPropagation();
					e.preventDefault();
				}
			});
			_listen(the, "touchmove", function(e) {
				var _,
					x1 = $(this).data(prefix + "x1"),
					x2 = e.touches[0].pageX,
					y1 = $(this).data(prefix + "y1"),
					y2 = e.touches[0].pageY,
					x = x2 - x1,
					y = y2 - y1;

				// e.preventDefault();
				$(this).data(prefix + "x2", x2);
				$(this).data(prefix + "y2", y2);

				if ($.isFunction(options.onswipe)) {
					options.onswipe.call(the, x, y);
					e.stopPropagation();
					e.preventDefault();
				}
			});
			_listen(the, "touchend", function(e) {
				// 
				var _,
					x1 = $(this).data(prefix + "x1"),
					x2 = $(this).data(prefix + "x2"),
					y1 = $(this).data(prefix + "y1"),
					y2 = $(this).data(prefix + "y2"),
					x = x2 - x1,
					mx = Math.abs(x),
					y = y2 - y1,
					my = Math.abs(y);

				if (mx > options.minSwipeLength || my > options.minSwipeLength) {
					if (x > 0 && mx > my) {
						if ($.isFunction(options.onswiperight)) {
							options.onswiperight.call(the, mx);
							e.stopPropagation();
							e.preventDefault();
						}
					} else if (x < 0 && mx > my) {
						if ($.isFunction(options.onswipeleft)) {
							options.onswipeleft.call(the, mx);
							e.stopPropagation();
							e.preventDefault();
						}
					} else if (y > 0 && mx < my) {
						if ($.isFunction(options.onswipebottom)) {
							options.onswipebottom.call(the, my);
							e.stopPropagation();
							e.preventDefault();
						}
					} else if (y < 0 && mx < my) {
						if ($.isFunction(options.onswipetop)) {
							options.onswipetop.call(the, my);
							e.stopPropagation();
							e.preventDefault();
						}
					}
				}

				if ($.isFunction(options.onswipeend)) {
					options.onswipeend.call(the, x, y);
					e.stopPropagation();
					e.preventDefault();
				}
			});
		});
	}
	$.fn.swipe.defaults = defaults;

	/**
	 * 事件监听
	 * @param  {Object} dom对象
	 * @param  {String} 事件类型
	 * @param  {Function} 事件
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年10月28日14:29:59
	 */

	function _listen(object, type, fn) {
		object.addEventListener(type, fn, 0);
	}
})($);