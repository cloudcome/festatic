// 1、默认参数
$.fn.scrollable = {
	// 内容区域选择器
	contentSelector: "ul",
	// 宽度，超过隐藏
	width: "auto",
	// 高度，超过隐藏
	height: "auto",
	// 滚动方向
	direction: "top",
	// 每次滚动的项目数量
	// 如果为1，则每次滚动1个，暂停的时候会是某一个项目的结尾
	// 如果为0，则无缝滚动，暂停的时候可能会是某一个项目的中间
	scrollNum: 1,
	// 延迟时间
	delay: 2000,
	// 动画时间，如果滚动数量为0，则滚动全部数量的动画时间
	duration: 678,
	// 是否自动播放
	isAutoPlay: true,
	// 是否鼠标悬停暂停
	isHoverPause: true,
	// 变化之前回调
	onbeforechange: emptyFn,
	// 变化之后回调
	onafterchange: emptyFn
};


// 2、初始化
// 默认DOM：#demo>ul>li*n
$("#demo").scrollable();


// 3、控制
// 3.1、滚动到
$("#demo").scrollable(index[, duration][, callback]);

// 3.2、播放
$("#demo").scrollable("play");

// 3.3、暂停
$("#demo").scrollable("pause");

// 3.4、前
$("#demo").scrollable("prev");

// 3.5、后
$("#demo").scrollable("next");
