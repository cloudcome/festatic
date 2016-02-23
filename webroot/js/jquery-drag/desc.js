// 1. 默认参数
$.fn.drag.defaults = {
	// 鼠标操作区域
	handle: "",
	// 拖动开始回调
	ondragstart: function () {},
	// 拖动中回调
	ondrag: function () {},
	// 拖动结束回调
	ondragend: function () {}
};


// 2. 拖拽初始化
$("#drag").drag();
