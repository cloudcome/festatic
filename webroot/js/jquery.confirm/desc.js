// 默认参数
$.confirm.defaults = {
	// 样式
	css: "http://festatic.aliapp.com/css/jquery.confirm/default.min.css?v=" + Math.ceil(new Date() / 86400000),
	// 确认框内容
	content: "确认吗？",
	// 确认按钮文字
	sureButton: "确认",
	// 取消按钮文字
	cancelButton: "取消",
	// 位置
	position: {},
	// 自动打开
	autoOpen: false,
	// 动画持续时间
	duration: 123,
	// 打开确认框回调
	onopen: emptyFn,
	// 单击了确认或者取消回调
	onclick: emptyFn,
	// 确认回调
	onsure: emptyFn,
	// 取消回调
	oncancel: emptyFn,
	// 关闭确认框回调
	onclose: emptyFn
}


// 1、 打开确认框
$.confirm({
	content: "确认要查看吗？",
	onopen: function () {
		alert("确认框打开了！");
	},
	onclose: function () {
		alert("确认框关闭了！");
	},
	onsure: function () {
		alert("你单击了确认按钮！");
	},
	oncancel: function () {
		alert("你单击了取消按钮！");
	},
	onclick: function (s) {
		if (s) {
			alert("你单击了确认按钮！");
		} else {
			alert("你单击了取消按钮！");
		}
	}
});

$.confirm("确认吗？", function (s) {
	if (s) {
		alert("你单击了确认按钮！");
	} else {
		alert("你单击了取消按钮！");
	}
});
