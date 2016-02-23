// 1. 默认参数
$.fn.mousewheel.defaults = {
	// 延时监听滚动停止事件的时间（单位毫秒）
	delay: 333,
	// 开始滚动回调
	onmousewheelstart: function () {},
	// 正在滚动回调，参数1：滚动的距离
	onmousewheel: function (y) {},
	// 滚动停止回调
	onmousewheelstop: function () {},
};

// 2. 详细配置
// 插件只会初始化一次，以第一次初始化为准
$("#demo-1").mousewheel({
	onmousewheelstart: function (y) {
		$(this).html("开始滚动");
	},
	onmousewheel: function (x, y) {
		$(this).html("正在滚动：y=" + y);
	},
	onmousewheelstop: function () {
		$(this).html("滚动已停止");
	}
});


// 3. 只监听滚动过程
// 插件只会初始化一次，以第一次初始化为准
$("#demo-2").mousewheel(function (y) {
	$(this).html("正在滚动：y=" + y);
});
