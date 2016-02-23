// 1. 默认参数
$.banner.defaults = {
	// 焦点图宽度，设置auto将完全自适应，精确宽度将适应该宽度
	width: "auto",
	// 动画时间
	duration: 678,
	// 自动播放延时
	delay: 5000,
	// 是否自动播放
	autoPlay: true,
	// 滚动方向
	direction: "right",
	// 内容区域选择器
	contentSelector: ".content",
	// 切换之前回调
	onbeforechange: function (index) {},
	// 切换之后回调
	onafterchange: function (index) {}
};


// 2. DOM结构
// div#demo>.content>li*N


// 3. 初始化
$("#demo").banner({
	width: ...
});


// 4. 操作
// 自动播放
$("#demo").banner("play");

// 暂停
$("#demo").banner("pause");

// 上一个
$("#demo").banner("prev");

// 下一个
$("#demo").banner("next");

// 播放到指定索引
$("#demo").banner(toIndex);
