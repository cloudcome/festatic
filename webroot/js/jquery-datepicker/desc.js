// 1、默认参数
$.fn.datepicker.defaults = {
	// 语言
	language: {
		yearUnit: "年",
		monthUnit: "月",
		dayUnit: "日",
		weekUnit: "周",
		month: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
		week: ["日", "一", "二", "三", "四", "五", "六"],
		prev: "上一个",
		next: "下一个"
	},
	// 年限
	yearRange: [thisYear - 5, thisYear + 5],
	// 默认年
	year: thisYear,
	// 默认月
	month: thisMonth + 1,
	// 默认日
	date: thisDate,
	// 格式化：年=yyyy，月=M，日=d
	format: "yyyy年M月d日",
	// 动画时间
	duration: 123,
	// 定位
	position: {},
	// 打开回调
	onopen: function () {},
	// 关闭回调
	onclose: function () {},
	// 选择回调
	onchoose: function () {}
};


// 2、初始化
$("#input").datepicker();


// 3、打开（必须先初始化）
$("#input").datepicker("open");


// 4、关闭（必须先初始化）
$("#input").datepicker("close");
