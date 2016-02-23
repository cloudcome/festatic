/*!
 * jquery.fn.scrollbar
 * @author 云淡然 http://qianduanblog.com
 * @for ie9(含)+、chrome、firefox
 * @version 1.0
 * 2013年11月8日9:49:18
 */


/**
 * 1、初始化
 * $("#demo").scrollbar({...});
 *
 * 2、获取位置
 * $("#demo").scrollbar("x");
 * $("#demo").scrollbar("y");
 *
 * 3、定点滚动
 * $("#demo").scrollbar("x",x,duration);
 * $("#demo").scrollbar("y",y,duration);
 * $("#demo").scrollbar("top",duration);
 * $("#demo").scrollbar("right",duration);
 * $("#demo").scrollbar("bottom",duration);
 * $("#demo").scrollbar("left",duration);
 *
 */


;
(function($, undefined) {

	var _,
		// 前缀
		prefix = "jquery-scrollbar____",
		// 是否加载了css
		hasLoadCss = 0,
		defaults = {
			// 样式
			css: "http://ydr0.qiniudn.com/css/jquery-scrollbar/default.min.css",
			// 是否允许鼠标转轮来触发滚动（必须先引用jquery.mousewheel.js）
			canMousewheel: true,
			// 是否允许触摸滑动来触发滚动（必须先引用jquery.swipe.js）
			canSwipe: true,
			// 滚动的时间（单位：毫秒，仅在canSwipe下作用）
			duration: 100,
			// 每次滚动的速度，单位px/次（仅在canMousewheel下作用）
			speed: 10,
			// 区域的宽度
			width: 'auto',
			// 区域的高度
			height: 'auto'
		};

	$.fn.scrollbar = function(settings) {
		var args = arguments,
			argL = args.length,
			$this0 = $(this).eq(0),
			_hasInit = $this0.data(prefix + "hasInit"),
			$temp;

		if (args[0] == "x" && argL == 1 && _hasInit) {
			$temp = $this0.data(prefix + "$barX");
			return $temp.css("left");
		} else if (args[0] == "y" && argL == 1 && _hasInit) {
			$temp = $this0.data(prefix + "$barY");
			return $temp.css("top");
		}

		return this.each(function() {
			var _,
				hasInit,
				$div = $(this),
				$body,
				$container,
				x0 = 0,
				maxL = 0,
				y0 = 0,
				maxT = 0,
				$barX, $barY;

			if ($div.data(prefix + "hasInit") === undefined) $div.data(prefix + "hasInit", 0);
			hasInit = $div.data(prefix + "hasInit");

			if ($.type(args[0]) == "string" && hasInit) {
				x0 = parseInt($div.scrollbar("x"));
				y0 = parseInt($div.scrollbar("y"));
				maxL = $div.data(prefix + "max-barLeft");
				maxT = $div.data(prefix + "max-barTop");
				if (args[0] == "x") {
					_x($div, args[1] - x0, true, args[2]);
				} else if (args[0] == "y") {
					_y($div, args[1] - y0, true, args[2]);
				} else if (args[0] == "top") {
					_y($div, -y0, true, args[1]);
				} else if (args[0] == "bottom") {
					_y($div, maxT - y0, true, args[1]);
				} else if (args[0] == "left") {
					_x($div, -x0, true, args[1]);
				} else if (args[0] == "right") {
					_x($div, maxL - x0, true, args[1]);
				}
			} else if ($.type(args[0]) == "object") {
				if (!hasInit) {
					var options = $.extend({}, defaults, args[0]);

					if (hasLoadCss) {
						_init();
					} else {
						$('<link rel="stylesheet" href="' + options.css + '" />').appendTo("head").load(function() {
							hasLoadCss = 1;
							_init();
						});
					}

					function _init() {
						// 套一层 body
						$div.wrap('<div class="' + prefix + 'body"></div>');
						$body = $div.parent('.' + prefix + 'body');

						// 再套一层 container
						$body.wrap('<div class="' + prefix + 'container"></div>');
						$container = $body.parent('.' + prefix + 'container');

						if (!/auto/.test(options.width)) {
							$container.width(options.width);
							$barX = $('<div class="' + prefix + 'x"></div>').appendTo($container);
						}
						if (!/auto/.test(options.height)) {
							$container.height(options.height);
							$barY = $('<div class="' + prefix + 'y"></div>').appendTo($container);
						}

						$div.data(prefix + "hasInit", 1);
						$div.data(prefix + "options", options);
						$div.data(prefix + "$body", $body);
						$div.data(prefix + "$barX", $barX);
						$div.data(prefix + "$barY", $barY);

						$container.css({
							"overflow": "hidden",
							"position": "relative"
						});

						if ($barX) _x($div, 0);
						if ($barY) _y($div, 0);

						if (options.canMousewheel && $.fn.mousewheel) {
							$container.mousewheel({
								onmousewheel: function(y) {
									var y0 = 0;
									if ($barY && y) {
										$barY.addClass('hover');
										_y($div, -y * options.speed);
									}
								},
								onmousewheelstop: function() {
									if ($barY) $barY.removeClass('hover active');
								}
							});
						}

						if (options.canSwipe && $.fn.swipe) {
							$div.swipe({
								onswipeleft: function(length) {
									_x($div, length, true);
								},
								onswiperight: function(length) {
									_x($div, -length, true);
								},
								onswipetop: function(length) {
									_y($div, length, true);
								},
								onswipebottom: function(length) {
									_y($div, -length, true);
								},
							});
							_listen($div[0], "touchstart", function() {
								if ($barX) $barX.addClass('hover');
								if ($barY) $barY.addClass('hover');
							});
							_listen($div[0], "touchend", function() {
								if ($barX) $barX.removeClass('hover active');
								if ($barY) $barY.removeClass('hover active');
							});
						}


						if ($barX) {
							// 单击记录下位置
							$barX.mousedown(function(e) {
								var x0 = e.pageX;
								$(this).addClass("active").data(prefix + 'isScroll', 1).data(prefix + 'x0', x0);
								return false;
							});
						}

						if ($barY) {
							// 单击记录下位置
							$barY.mousedown(function(e) {
								var y0 = e.pageY;
								$(this).addClass("active").data(prefix + 'isScroll', 1).data(prefix + 'y0', y0);
								return false;
							});
						}

						$(document).mousemove(function(e) {
							var x0 = 0,
								y0 = 0,
								x1 = e.pageX,
								y1 = e.pageY;

							if ($barX && $barX.data(prefix + 'isScroll')) {
								x0 = $barX.data(prefix + 'x0');
								$barX.data(prefix + 'x0', x1);
								_x($div, x1 - x0);
								return false;
							}

							if ($barY && $barY.data(prefix + 'isScroll')) {
								y0 = $barY.data(prefix + 'y0');
								$barY.data(prefix + 'y0', y1);
								_y($div, y1 - y0);
								return false;
							}
						}).mouseup(function() {
							if ($barX) $barX.removeClass('hover active').data(prefix + 'isScroll', 0);
							if ($barY) $barY.removeClass('hover active').data(prefix + 'isScroll', 0);
						});

					}


				}
			}



			/**
			 * 水平滚动，以滚动条为基准
			 * @param  {Object} 生成滚动条的对象
			 * @param  {Number} 滚动条滚动的距离
			 * @param  {Boolean} 是否运动效果
			 * @param  {Number} 消耗时间
			 * @return {Undefined}
			 * @version 1.0
			 * 2013年10月27日18:01:30
			 */

			function _x($div, x1, isAnimate, duration) {
				var _,
					// 参数
					options = $div.data(prefix + "options"),
					// 内容容器
					$body = $div.data(prefix + "$body"),
					// 滚动条
					$barX = $div.data(prefix + "$barX"),
					// 上一次位置
					x0 = parseInt($barX.css("left")),
					// 新位置
					x2 = x0 + x1,
					// 内容的高度
					divW = $div.outerWidth(),
					// 可视宽度与内容宽度比
					ratio = options.width / divW,
					// 滚动条的宽度
					barW = ratio * options.width,
					// 滚动条最大左位移
					barL = options.width - barW,
					// 内容左边距
					bodyML = 0;

				if (x2 <= 0) x2 = 0;
				if (x2 >= barL) x2 = barL;
				bodyML = -x2 / ratio;

				$div.data(prefix + "max-barLeft", barL);
				$barX.width(barW);
				if (isAnimate) {
					$barX.stop(1, 1).animate({
						"left": x2
					}, duration || options.duration);
					$body.stop(1, 1).animate({
						"margin-left": bodyML
					}, duration || options.duration);
				} else {
					$barX.css("left", x2);
					$body.css("margin-left", bodyML);
				}
			}

			/**
			 * 垂直滚动，以滚动条为基准
			 * @param  {Object} 生成滚动条的对象
			 * @param  {Number} 滚动条滚动的距离
			 * @param  {Boolean} 是否运动效果
			 * @param  {Number} 消耗时间
			 * @return {Undefined}
			 * @version 1.0
			 * 2013年10月27日18:01:30
			 */

			function _y($div, y1, isAnimate, duration) {
				var _,
					// 参数
					options = $div.data(prefix + "options"),
					// 内容容器
					$body = $div.data(prefix + "$body"),
					// 滚动条
					$barY = $div.data(prefix + "$barY"),
					// 上一次位置
					y0 = parseInt($barY.css("top")),
					// 新位置
					y2 = y0 + y1,
					// 内容的高度
					divH = $div.outerHeight(),
					// 可视高度与内容高度比
					ratio = options.height / divH,
					// 滚动条的高度
					barH = ratio * options.height,
					// 滚动条最大上位移
					barT = options.height - barH,
					// 内容上边距
					bodyMT = 0;

				if (y2 <= 0) y2 = 0;
				if (y2 >= barT) y2 = barT;
				bodyMT = -y2 / ratio;

				$div.data(prefix + "max-barTop", barT);
				$barY.height(barH);
				if (isAnimate) {
					$barY.stop(1, 1).animate({
						"top": y2
					}, duration || options.duration);
					$body.stop(1, 1).animate({
						"margin-top": bodyMT
					}, duration || options.duration);
				} else {
					$barY.css("top", y2);
					$body.css("margin-top", bodyMT);
				}
			}

		});
	};

	$.fn.scrollbar.defaults = defaults;

	/**
	 * 事件监听
	 * @param  {Object} dom对象
	 * @param  {String} 事件类型
	 * @param  {Function} 事件
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年10月28日14:29:59
	 */

	function _listen(object, type, fn) {
		object.addEventListener(type, fn, 0);
	}
})(jQuery);