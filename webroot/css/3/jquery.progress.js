/*!
 * 环形进度条 - jquery插件
 * @author  云淡然 http://qianduanblog.com
 * @version  1.0
 * 2013年10月12日16:28:15
 */


/**
 * 1.初始化
 * $("#id").progress({});
 *
 * 2.开始
 * $("#id").progress(true);
 *
 * 3.停止
 * $("#id").progress(false);
 *
 * 4.设置百分比
 * $("#id").progress(0.5);
 *
 */

;
(function ($, undefined) {
	var abc = new Date().getTime();
	console.log(abc);
	var defaults = {
		// 进度条总时间
		duration: 10000,
		// 进度开始的百分比
		start: 0,
		// 开始回调
		onstart: function () {},
		// 正在进度回调
		onprogress: function () {},
		// 结束回调
		onstop: function () {}
	}, prefix = "jquery-progress";
	$.fn.progress = function (settings) {
		return this.each(function () {
			var _,
				options,
				// 进度条
				$progress = $(this),
				// 左切边
				$left = $progress.find(".clip-left .circle"),
				// 右切边
				$right = $progress.find(".clip-right .circle"),
				// 当前进度值
				current = $progress.data(prefix + "current") === undefined ? 0 : $progress.data(prefix + "current"),
				// 左切片开始点
				left = $progress.data(prefix + "left") === undefined ? 45 : $progress.data(prefix + "left"),
				// 右切片开始点
				right = $progress.data(prefix + "right") === undefined ? -135 : $progress.data(prefix + "right"),
				// 定时器
				timer = $progress.data(prefix + "timer") === undefined ? 0 : $progress.data(prefix + "timer");

			options = $progress.data(prefix + "options") || defaults;

			// 参数
			if ($.type(settings) == "object") {
				$progress.data(prefix + "options", $.extend({}, defaults, settings));
			}
			// 开始
			else if (settings === true) {
				if (current == 1) {
					return;
				}
				options.onstart();
				timer = setInterval(function () {
					if (current >= 1) {
						clearInterval(timer);
						timer = 0;
						options.onstop();
					} else {
						current = (current * 1 + 0.01).toFixed(2);
						_percent(current);
						options.onprogress(parseInt(current * 100) + "%");
					}
				}, options.duration / 100);
				$progress.data(prefix + "timer", timer);
			}
			// 结束
			else if (settings === false) {
				if (current == 1) {
					return;
				}
				if (timer) {
					clearInterval(timer);
					timer = 0;
					options.onstop();
				}
			}
			// 设置百分比
			else if ($.type(settings) == "number") {
				if (timer) {
					clearInterval(timer);
					timer = 0;
					options.onstop();
				}
				_percent(settings);
				options.onprogress(parseInt(current * 100) + "%");
			}

			function _percent(percent) {
				var left = 0,
					right = 0,
					deg = 0;
				if (percent < 0 || percent > 1) return;
				deg = percent * 360;
				current = percent;
				$progress.data(prefix + "current", percent);
				// right:-135=>45
				if (percent < 0.5) {
					left = 45;
					right = -135 + deg;
					$left.css("transform", "rotate(" + left + "deg)");
					$right.css("transform", "rotate(" + right + "deg)");
					$progress.data(prefix + "right", right);
				}
				// left:45=>225
				else {
					left = 45 + deg - 180;
					right = 45;
					$left.css("transform", "rotate(" + left + "deg)");
					$right.css("transform", "rotate(" + right + "deg)");
					$progress.data(prefix + "right", right);
					$progress.data(prefix + "left", left);
				}
			}
		});
	}
	$.fn.progress.defaults = defaults;
})(jQuery);