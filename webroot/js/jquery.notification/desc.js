// 插件默认参数
$.notification.defaults = {
	title: "通知标题",
	body: "通知内容",
	// 标签类别
	tag: "",
	// 通知图标
	icon: "http://festatic.aliapp.com/img/icon.png",
	// 显示通知
	onshow: function () {},
	// 关闭通知
	onclose: function () {},
	// 单击通知
	onclick: function () {},
	// 错误通知
	onerror: function () {}
}


// 1、生成桌面通知
$.notification("标题", "内容");
$.notification();


// 2、清除桌面通知
$.notification(null);
