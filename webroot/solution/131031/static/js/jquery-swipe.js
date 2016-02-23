/*!
 * jquery.fn.swipe
 * @author 云淡然 http://qianduanblog.com
 * @for html5手机浏览器
 * @version 1.0
 * 2013年11月3日16:50:40
 */


/**
 * $("#demo").swipe({...});
 */


(function ($, undefined) {
	var prefix = 'jquery-swipe____',
		defaults = {
			// 最小的滑动距离（单位px），只有滑动距离大于该值时才会触发
			minSwipeLength: 10,
			// 向左滑动回调（参数1：滑动的距离，单位px）
			onswipeleft: null,
			// 向右滑动回调（参数1：滑动的距离，单位px）
			onswiperight: null,
			// 向上滑动回调（参数1：滑动的距离，单位px）
			onswipetop: null,
			// 向下滑动回调（参数1：滑动的距离，单位px）
			onswipebottom: null
		};


	$.fn.swipe = function (settings) {
		var options = $.extend({}, defaults, settings);
		return this.each(function () {
			var the = this;
			_listen(the, "touchstart", function (e) {
				// e.preventDefault();
				$(this).data(prefix + "x1", e.touches[0].pageX);
				$(this).data(prefix + "y1", e.touches[0].pageY);
			});
			_listen(the, "touchmove", function (e) {
				// e.preventDefault();
				$(this).data(prefix + "x2", e.touches[0].pageX);
				$(this).data(prefix + "y2", e.touches[0].pageY);
			});
			_listen(the, "touchend", function (e) {
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