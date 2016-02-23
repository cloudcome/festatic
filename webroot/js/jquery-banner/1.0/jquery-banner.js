/*!
 * jquery.fn.banner
 * @author 云淡然 http://qianduanblog.com
 * @for ie9(含)+、chrome、firefox以及移动客户端
 * @version 1.0
 * 2013年11月24日15:45:13
 */


;
(function ($, undefined) {
	var _,
		prefix = "jquery-banner____",
		defaults = {
			// 焦点图宽度
			width: 500,
			// 是否自动适配宽度
			fitWidth: true,
			// 动画时间
			duration: 678,
			// 定时器时间
			delay: 2000,
			// 是否自动播放
			auto: true,
			// 文字显示区域
			text: ".text",
			textArr: [],
			// 滚动方向
			direction: "right",
			// 内容区域选择器
			content: ".content",
			// 导航区域选择器
			nav: ".nav",
			// 是否重写导航区域，一般不重写用于已经写好的导航
			navRewrite: true,
			// 控制区域选择器
			prev: ".prev",
			next: ".next"
		};

	$.fn.banner = function (settings) {
		var options = $.extend({}, defaults, settings);
		return this.each(function () {
			var $banner = $(this),
				$content = options.content ? $(options.content, $banner) : null,
				$nav = options.nav ? $(options.nav, $banner) : null,
				$text = options.text ? $(options.text, $banner) : null,
				$prev = options.prev ? $(options.prev, $banner) : null,
				$next = options.next ? $(options.next, $banner) : null,
				$items = $content.children(),
				count = $items.length,
				bannerWidth = $banner.width(),
				// 当前索引
				displayIndex = 0,
				// 当前左边距
				currentMl = 0,
				// 定时器
				timer = 0,
				hasInit = $banner.data(prefix + "hasInit") || 0,
				navHtml = "<ul>";

			if (!$content.length) return;
			if (hasInit) return;

			// 焦点图宽度小于设置宽度时
			if (options.fitWidth && bannerWidth < options.width) {
				options.width = bannerWidth;
			}

			if (count < 2) return;

			$content.wrap('<div class="clearfix" style="width:' + options.width + 'px;overflow:hidden;position:relative;"></div>').css({
				width: options.width * count
			});

			$items.width(options.width).addClass("pull-left").each(function (i) {
				$(this).data(prefix + "index", i);
				navHtml += "<li><span>" + (i + 1) + "</span></li>";
			}).find("img").css({
				"vertical-align": "top"
			});

			navHtml += "</ul>";
			if ($nav.length) {
				if (options.navRewrite) {
					$nav.html(navHtml);
				}
				$nav.find("li").eq(0).addClass("active");
				$nav.on("click", "li", function () {
					var _index = $(this).index();
					_animate(_index, _index < displayIndex);
				});
			}

			if ($.fn.swipe) {
				$content.swipe({
					onswipestart: function () {
						_pause();
					},
					onswipe: function (x, y) {
						$content.css("margin-left", currentMl + x);
					},
					onswipeend: function () {
						$content.animate({
							"margin-left": currentMl
						}, options.duration, function () {
							if (options.auto) _auto();
						});
					},
					onswipeleft: function () {
						if (displayIndex < count - 1) _animate(displayIndex + 1);
					},
					onswiperight: function () {
						if (displayIndex > 0) _animate(displayIndex - 1);
					}
				});
			}


			// 控制
			$banner.mouseenter(function () {
				_pause();
			}).mouseleave(function () {
				if (options.auto) _auto();
			});

			if ($prev.length) $prev.click(function () {
				if (displayIndex > 0) _animate(displayIndex - 1);
			}).addClass("disabled");

			if ($next.length) $next.click(function () {
				if (displayIndex < count - 1) _animate(displayIndex + 1);
			});



			if (options.auto) _auto();


			function _auto() {
				if (timer) {
					clearInterval(timer);
					timer = 0;
				}
				timer = setInterval(function () {
					_animate(displayIndex + 1, options.direction == "left");
				}, options.delay);
			}


			function _pause() {
				$content.stop(1, 1);
				if (timer) {
					clearInterval(timer);
					timer = 0;
				}
			}


			function _animate(toIndex, isDirectionLeft) {
				var indexLen = 0;

				if (toIndex == displayIndex) return;

				// 向左滑动到顶点
				if (isDirectionLeft && toIndex < 0) {
					toIndex = count - 1;
					currentMl = -toIndex * options.width;
				}
				// 向右滑动到顶点
				else if (!isDirectionLeft && toIndex > count - 1) {
					toIndex = 0;
					currentMl = 0;
				} else {
					indexLen = displayIndex - toIndex;
					currentMl += indexLen * options.width;
				}

				$content.stop(1, 1).animate({
					"margin-left": currentMl
				}, options.duration, function () {
					displayIndex = toIndex;
					if ($nav.length) {
						$nav.find("li").eq(displayIndex).addClass("active").siblings().removeClass("active");
					}
					if ($text.length && textArr.length >= count) {
						$text.html(options.textArr[displayIndex]);
					}
					displayIndex == 0 && $prev.length ? $prev.addClass("disabled") : $prev.removeClass("disabled");
					displayIndex == count - 1 && $next.length ? $next.addClass("disabled") : $next.removeClass("disabled");
				});
			}

			$banner.data(prefix + "hasInit", 1);

		});
	};

	$.fn.banner.defaults = defaults;
})(jQuery)
