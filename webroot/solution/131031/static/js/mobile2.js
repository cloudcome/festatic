/**
 * 手机脚本
 * @author云淡然
 * 2013年10月31日9:30:11
 */

$(function () {

	// 关闭广告
	var $ad1 = $("#a-d-1");
	$("#a-d-1").on("click", ".close", function () {
		$ad1.addClass("active");
	});


	// 滚动的文字
	$("#slide-1").slide({
		type: "marquee",
		content: ".text"
	});


	// 滚动的焦点图
	$("#slide-2").slide({
		type: "slide",
		width: $(window).width(),
		height: 100
	});


	// 滚动的焦点新闻
	$("#slide-3").slide({
		type: "slide",
		width: $(window).width(),
		height: 90
	});


	// 滚动的焦点图
	$("#slide-4").slide({
		type: "slide",
		width: $(window).width(),
		height: 130
	});


	// 滚动的焦点图
	$("#slide-5").slide({
		type: "slide",
		width: $(window).width(),
		height: 130
	});


	// 滚动的焦点图
	$("#slide-6").slide({
		type: "slide",
		nav: ".nav",
		width: $(window).width(),
		height: 240
	});


	// 滚动的焦点图
	$("#slide-7").slide({
		type: "slide",
		width: $(window).width() - 20,
		height: 100
	});


	// 滚动的焦点图
	$("#slide-8").slide({
		type: "slide",
		width: 250,
		height: 180,
		navClass: "square"
	});


	// 滚动的焦点图
	$("#slide-9").slide({
		type: "slide",
		width: 250,
		height: 180,
		navClass: "square"
	});


	// 滚动的选项卡
	$("#slide-10").slide({
		type: "tab",
		content: ".tab-content",
		width: $(window).width(),
		auto: false,
		duration: 333
	});


	// 展开
	$("#expand-1").on("click", ".icon-down-open", function () {
		$(this).closest("li").addClass("active").siblings().removeClass("active");
		return false;
	}).on("click", ".icon-up-open", function () {
		$(this).closest("li").removeClass("active");
		return false;
	});


	// 返回顶部
	$("#footer-1").on("click", ".back-top", function () {
		$("body").animate({
			scrollTop: 0
		}, 567);
		return false;
	});


	// 滚动的焦点图
	$("#slide-11").slide({
		type: "slide",
		width: $(window).width(),
		height: 200
	});

});
