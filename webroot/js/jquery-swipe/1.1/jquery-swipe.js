/*!
 * jquery.fn.swipe
 * @author 云淡然 http://qianduanblog.com
 * @for html5手机浏览器
 * @version 1.1
 */


/**
 * v1.0
 * 2013年11月4日16:55:35
 * 构造
 *
 * v1.1
 * 2014年1月12日16:20:09
 * 修正回调的event参数、事件冒泡、优化事件等
 * 整合、整理
 *
 * 2014年3月19日22:51:20
 * 修复无法触发swipeend的BUG
 *
 * 2014年3月20日21:44:26
 * 再次处理了触摸事件
 */


/**
 * $("#demo").swipe({...});
 */


(function ($, undefined) {
	var _,
		prefix = 'jquery-swipe____',
		emptyFn = function () {},
		defaults = {
			// 最小的滑动距离（单位px），只有滑动距离大于该值时才会触发
			minSwipeLength: 30,
			// 滑动开始回调（参数1：event）
			onswipestart: emptyFn,
			// 滑动过程回调（参数1：event，参数2：水平滑动位移，单位px，参数3：垂直滑动位移，单位px）
			onswipemove: emptyFn,
			// 滑动取消回调（参数1：event）
			onswipecancel: emptyFn,
			// 滑动结束回调（参数1：event，参数2：水平滑动位移，单位px，参数3：垂直滑动位移，单位px）
			onswipeend: emptyFn,
			// 向左滑动回调（参数1：event，参数2：滑动的距离，单位px）
			onswipeleft: emptyFn,
			// 向右滑动回调（参数1：event，参数2：滑动的距离，单位px）
			onswiperight: emptyFn,
			// 向上滑动回调（参数1：event，参数2：滑动的距离，单位px）
			onswipetop: emptyFn,
			// 向下滑动回调（参数1：event，参数2：滑动的距离，单位px）
			onswipebottom: emptyFn
		};


	$.fn.swipe = function (settings) {
		var options = $.extend({}, defaults, settings);
		return this.each(function () {
			var the = this,
				touch = {};

			// 触摸开始
			$(this).bind('touchstart', function (e) {
				var ev = e.originalEvent;
				if (ev.touches.length == 1) {
					touch.x1 = touch.x2 = ev.touches[0].pageX;
					touch.y1 = touch.y2 = ev.touches[0].pageY;
					options.onswipestart.call(the, e, touch.x1, touch.y1);
				}
			})
			// 触摸取消
			.bind('touchcancel', function (e) {
				var ev = e.originalEvent;
				if (ev.touches.length == 1) {
					options.onswipecancel.call(the, e);
				}
			})
			// 触摸移动
			.bind('touchmove', function (e) {
				var ev = e.originalEvent;
				if (ev.touches.length == 1) {
					touch.x2 = ev.touches[0].pageX;
					touch.y2 = ev.touches[0].pageY;

					// 水平移动距离大于10，则取消默认行为
					if (Math.abs(touch.x1 - touch.x2) > 10) e.preventDefault();

					options.onswipemove.call(the, ev, touch.x2 - touch.x1, touch.y2 - touch.y1);
				}
			})
			// 触摸结束
			.bind('touchend', _swipeEndHandler);

			// 滚动
			$(window).scroll(_swipeEndHandler);


			function _swipeEndHandler(e) {
				var deltaX = touch.x2 - touch.x1,
					deltaY = touch.y2 - touch.y1;
				if (Math.abs(deltaX) > options.minSwipeLength || Math.abs(deltaY) > options.minSwipeLength) {
					setTimeout(function () {
						options["onswipe" + _swipeDirection(touch)].call(the, e, touch.x2 - touch.x1, touch.y2 - touch.y1);
					}, 0);
				}
				options.onswipeend.call(the, e, deltaX, deltaY);
			}
		});
	}
	$.fn.swipe.defaults = defaults;



	/**
	 * 计算滑动方向
	 * @param  {Object} 触摸参数
	 * @return {String} 方向
	 * @version 1.0
	 * 2014年1月12日15:59:40
	 */

	function _swipeDirection(touch) {
		touch.deltaX = Math.abs(touch.x1 - touch.x2);
		touch.deltaY = Math.abs(touch.y1 - touch.y2);
		return touch.deltaX > touch.deltaY ? (touch.x1 > touch.x2 ? "left" : "right") : (touch.y1 > touch.y2 ? "top" : "bottom");
	}
})($);
