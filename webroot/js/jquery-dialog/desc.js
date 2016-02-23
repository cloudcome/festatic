// 1. 对话框默认参数
// 标注【*】的项目表示可以重复修改的，即多次初始化
$.fn.dialog.defaults = {
	// css样式链接地址
	css: "http://festatic.aliapp.com/css/jquery-dialog/default.min.css?v=" + Math.ceil(Date.now() / 86400000),
	// 对话框标题【*】
	title: "Untitled",
	// 是否自动打开（即是否初始化完成就打开）
	autoOpen: false,
	// 对话框宽度【*】
	width: 600,
	// 对话框高度【*】
	height: "auto",
	// 层级【*】
	zIndex: 2000,
	// 在给定高度的时候，对话框内容超过样式【*】
	overflow: "scroll",
	// 动画时间【*】
	duration: 123,
	// 是否可以拖动（需引用jquery.drag.js）
	draggable: true,
	// 是否可以按esc关闭【*】
	closeOnEsc: true,
	// 是否可以单击背景关闭【*】
	closeOnBg: true,
	// 是否允许关闭【*】（设置为false，将导致 closeOnEsc 和 closeOnBg 失效）
	canHide: true,
	// 加载一个url【*】
	url: "",
	// 打开回调
	onopen: function () {},
	// 关闭回调
	onclose: function () {}
};

// 2、对话框初始化
// 如果不预先初始化，将使用默认参数自动初始化
$("#dialog").dialog({
	width: 600,
	title: "对话框标题"
});
// 多次初始化会覆盖掉前一次初始化内容
$("#dialog").dialog({
	title: "重新初始化对话框标题"
});


// 3、打开对话框
// 打开对话框
$("#dialog").dialog("open");
// 打开对话框并回调
$("#dialog").dialog("open", function () {});
// 打开对话框并重置参数
$("#dialog").dialog("open", {
	title: "改变了对话框标题"
});
// 打开对话框并打开远程url
$("#dialog").dialog("open", {
	title: "远程url",
	url: "http://www.baidu.com/"
});
// 打开对话框并重置参数并回调
$("#dialog").dialog("open", {
	title: "改变了对话框标题"
}, function () {});



// 4、定位对话框
// 手动重新定位对话框到居中位置，用于对话框内容改变的时候
$("#dialog").dialog("position");


// 5、关闭对话框
$("#dialog").dialog("close");
// 关闭对话框并且回调
$("#dialog").dialog("close", function () {});
