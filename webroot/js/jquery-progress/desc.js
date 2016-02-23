// 1、默认参数
$.fn.progress.defaults = {
	// 是否逆时针递增
	// flase：顺时针递增，逆时针递减
	// true：逆时针递增，顺时针递减
	anticlockwiseAsc: false,
	// 开始角度，以水平向右方向为0度，顺时针+，逆时针-
	// 默认-90度为垂直向上方向
	beginAngle: -90,
	// 进度步进，为小于1的数
	step: .01,
	// 初始的进度
	progress: 0,
	// 运动进度的开始进度
	begin: 0,
	// 运动进度的结束进度
	// 如果开始进度大于结束进度，则进度递减，否则递增
	end: 1,
	// 运动进度的进度时间
	duration: 6000,
	// 背景类型：arc（圆弧），sector（扇形）
	bgType: "arc",
	// 前景类型：arc（圆弧），sector（扇形）
	fgType: "arc",
	// 背景样式
	bgStyle: {
		// 线头：butt，round 和 square
		lineCap: "butt",
		// 线宽
		lineWidth: 1,
		// 轮廓颜色
		strokeStyle: "#ccc",
		// 填充颜色
		fillStyle: "#ccc"
	},
	// 前景样式
	fgStyle: {
		// 线头：butt，round 和 square
		lineCap: "butt",
		// 线宽
		lineWidth: 1,
		// 轮廓颜色
		strokeStyle: "#0595FC",
		// 填充颜色
		fillStyle: "#0595FC"
	},
	// 进度开始回调
	onstart: function () {},
	// 进度暂停回调
	onpause: function () {},
	// 进度继续回调
	oncontinue: function () {},
	// 进度结束回调
	onstop: function () {},
	// 进度回调
	onprogress: function () {}
};


// 2、初始化
$().progress({...
});


// 3、操作
// 3.1、设置进度值
$("#progress").progress(.5);

// 3.2、跑进度
$("#progress").progress("run", 开始进度, 结束进度, 进度时间);

// 3.3、暂停跑进度
$("#progress").progress("pause");

// 3.4、继续跑进度
$("#progress").progress("continue");
