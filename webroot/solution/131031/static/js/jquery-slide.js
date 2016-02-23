/**
 * jquery.fn.slide
 * @author 云淡然 http://ydr.me
 * @version 1.0
 * 2013年11月3日12:02:37
 */

;
(function ($, undefined) {
	var prefix = "jquery-slide____",
		defaults = {
			// 类型：marquee/slide
			type: "",
			// 是否自动
			auto: true,
			direction: "left",
			// 内容选择器
			content: ".content",
			prev: ".prev",
			next: ".next",
			nav: ".navigator",
			title: ".title",
			tabNav: ".tab-nav",
			navClass: "circle",
			duration: 888,
			delay: 3000,
			width: 0,
			height: 0
		};
	$.fn.slide = function (settings) {
		var options = $.extend({}, defaults, settings);
		return this.each(function () {
			var $this = $(this),
				$content = $(options.content, $this),
				$prev = $(options.prev, $this),
				$next = $(options.next, $this),
				$nav = $(options.nav, $this),
				$title = $(options.title, $this),
				$tabNav = $(options.tabNav, $this),
				// 容器宽度
				width = 0,
				height = 0,
				// 内容宽度
				allWidth = 0,
				allHeight = 0,
				// 临界点
				turnLeft = 0,
				trunTop = 0,
				// 定时器
				timer = 0,
				timer2 = 0,
				// 滚动的位移
				marginLeft = 0,
				count = 0,
				i = 0,
				navHtml = '',
				// 当前索引
				index = 0,
				titleArr = [];

			if (!$content.length) return;
			width = $content.outerWidth();
			height = $content.outerHeight();
			allHeight = height;

			// console.log(width);
			// console.log(height);

			if (options.type == "marquee") {
				$content.addClass("pull-left");
				allWidth = $content.outerWidth();
				$content.wrap('<div class="clearfix" style="width:' + allWidth * 2 + 'px;height:' + height + 'px;overflow:hidden;"></div>');
				// $content2=$content.clone().insertAfter($content);
				$content.parent().wrap('<div style="width:' + width + 'px;height:' + height + 'px;overflow:hidden;"></div>');

				if (options.auto) _marquee();

				$this.bind("touchstart", function () {
					if (timer) {
						clearInterval(timer);
						timer = 0;
					}
				}).bind("touchend", function () {
					if (options.auto) {
						if (timer2) {
							clearTimeout(timer2);
							timer2 = 0;
						}
						timer2 = setTimeout(function () {
							_marquee();
						}, options.delay);
					}
				}).swipe({
					onswipeleft: function (x) {
						marginLeft -= x;
						_marquee(marginLeft);
					},
					onswiperight: function (x) {
						marginLeft += x;
						_marquee(marginLeft);
					}
				});

				$prev.length && $prev.click(function () {
					marginLeft -= 100;
					_marquee(marginLeft);
				});

				$next.length && $next.click(function () {
					marginLeft += 100;
					_marquee(marginLeft);
				});

				function _marquee(ml) {
					if (ml) {
						$content.stop(1, 1).animate({
							marginLeft: ml
						}, 456);
					} else {
						timer = setInterval(function () {
							marginLeft--;
							if (marginLeft <= -allWidth) {
								marginLeft = width;
							}
							$content.css("margin-left", marginLeft);
						}, 30);
					}
				}
			} else if (options.type == "slide" || options.type == "tab") {
				width = options.width,
				height = options.height;
				allHeight = height;
				count = $content.children("li").length;
				if (count < 2) return;
				allWidth = width * count;
				$content.css({
					"width": allWidth,
					"overflow": "hidden"
				}).addClass("clearfix").wrap('<div style="width:' + width + 'px;overflow:hidden;margin:0 auto;"></div>');
				$content.children("li").addClass("pull-left").css({
					"width": width
				});
				if (options.type == "slide") {
					$content.css({
						"height": height,
					}).children("li").css({
						"height": height,
						"overflow": "hidden"
					});
				}

				$this.bind("touchstart", function () {
					if (timer) {
						clearInterval(timer);
						timer = 0;
					}
				}).bind("touchend", function () {
					if (options.auto) {
						if (timer2) {
							clearTimeout(timer2);
							timer2 = 0;
						}
						timer2 = setTimeout(function () {
							_auto();
						}, options.delay);
					}
				}).swipe({
					onswipeleft: function (x) {
						if (x > 30) _slide();
					},
					onswiperight: function (x) {
						if (x > 30) _slide(true);
					}
				});

				$prev.length && $prev.click(function () {
					_slide();
				});

				$next.length && $next.click(function () {
					_slide(true);
				});

				i = count;
				while (i--) {
					navHtml += '<i class="' + options.navClass + '"></i>';
					titleArr.push($content.children("li").eq(i).attr("data-title"));
				}
				titleArr.reverse();

				if ($nav.length) {
					$nav.html(navHtml).find("i").eq(0).addClass("active");
				}

				if (options.auto) _auto();

				function _auto() {
					timer = setInterval(function () {
						_slide();
					}, options.delay);
				}

				function _slide(isTurnRight) {
					if (isTurnRight) {
						index--;
						if (index == -1) index = count - 1;
						$content.css("margin-left", -width).children("li").last().prependTo($content);
						$content.animate({
							"margin-left": 0
						}, options.duration);
					} else {
						index++;
						if (index == count) index = 0;
						$content.animate({
							"margin-left": -width
						}, options.duration, function () {
							$(this).css("margin-left", 0).children("li").eq(0).appendTo($(this));
						});
					}
					$nav.length && $nav.find("i").eq(index).addClass("active").siblings().removeClass("active");
					$title.length && $title.html(titleArr[index]);
					$tabNav.length && $tabNav.find("li").eq(index).addClass("active").siblings().removeClass("active");
				}
			}
		});
	}
})($);