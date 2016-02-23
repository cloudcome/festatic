// 1. 默认参数
$.fn.swipe.defaults = {
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

// 2. 使用方法
$("#demo").swipe({
	onswipestart: function () {
		$(this).removeClass("transition");
	},
	onswipemove: function (e, x, y) {
		$(this).css({
			"margin-left": x,
			"margin-top": y
		});
	},
	onswipeend: function (e, x, y) {
		$(this).addClass("transition").css({
			"margin-left": 0
		});
	},
	onswipeleft: function (e, length) {
		$text1.html("onswipeleft length=" + length);
	},
	onswiperight: function (e, length) {
		$text1.html("swiperight length=" + length);
	},
	onswipetop: function (e, length) {
		$text1.html("onswipetop length=" + length);
	},
	onswipebottom: function (e, length) {
		$text1.html("onswipebottom length=" + length);
	}
});
