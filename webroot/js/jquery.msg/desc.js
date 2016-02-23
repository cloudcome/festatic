// 1 默认参数设置
$.msg.defaults = {
	// 默认style样式链接
	css: 'http://festatic.aliapp.com/css/jquery.msg/default.min.css',
	// 动画时间
	duration: 123,
	// 消息内容
	msg: "Hello World!!",
	// 消息类型:inverse(默认)/warning/error/success/info/muted
	type: "inverse",
	// 消息位置，默认水平垂直居中
	position: {}
};
// 如果要更改样式，请在使用jquery.msg插件之前设置其默认参数

// 2 显示消息
$.msg("消息内容");
$.msg("消息类型", "消息内容");
$.msg({});
