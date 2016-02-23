/*!
 * jquery.fn.dialog
 * @author 云淡然 http://qianduanblog.com
 * @for ie9(含)+、chrome、firefox
 * @require http://festatic.aliapp.com/js/jquery-dialog/css/default.css
 * @require jquery-drag.js
 * @version 1.1
 * 2013年10月10日23:28:10
 */

/**
 *
 * 1、创建对话框
 * $.fn.dialog({
 * 		css:...,
 * 		width:...,
 * 		height:...,
 * 		...
 * });
 *
 * 2、弹出对话框
 * $.fn.dialog("open",function(){});
 *
 * 3、关闭对话框
 * $.fn.dialog("close",function(){});
 *
 */;
(function ($, undefined) {
	var _,
		prefix = "jquery-dialog____",
		isLoadCss = 0,
		// 对话框jq对象数组，便于遍历查找
		arrDialogJq = [],
		// 打开的对话框队列
		arrOpenQueue = [],
		// 上一次层级
		zIndex = 2000,
		// 对话框高度之差
		xheight = 74,
		regAuto = /^auto$/i,
		regHeight = /\d/,
		defaults = {
			// css样式链接地址
			css: "http://festatic.aliapp.com/css/jquery-dialog/default.min.css",
			// 对话框标题
			title: "Untitled",
			// 是否自动打开（即是否初始化完成就打开）
			autoOpen: false,
			// 对话框宽度
			width: "600px",
			// 对话框高度
			height: "auto",
			// 在给定高度的时候，对话框内容超过样式
			overflow: "scroll",
			// 持续时间
			duration: 123,
			// 是否可以拖动
			draggable: true,
			// 是否可以按esc关闭
			closeOnEsc: true,
			// 打开回调
			onopen: function () {},
			// 关闭回调
			onclose: function () {}
		};


	$.fn.dialog = function () {

		var args = arguments,
			argL = args.length;

		return this.each(function () {
			var
			_,
				$dom = $(this),
				id = prefix + new Date().getTime(),
				// 这里先设置绝对定位，防止拖拽插件判断错误，因为样式是动态加载的
				html = "<div style='position:absolute;' class='" + prefix + "' id='" + id + "'><div class='" + prefix + "wrap'><div class='" + prefix + "header'><span class='" + prefix + "title'></span><a class='" + prefix + "close' href='javascript:;'>&times;</a></div><div class='" + prefix + "body'></div></div></div>",
				bgHtml = "<div class='" + prefix + "bg' id='" + id + "bg'></div>",

				// 参数
				options,
				// 对话框对象
				$dialog,
				// 是否已经初始化完毕
				isInit,
				// 是否已经打开
				isOpen,
				// 对话框内容高度
				bodyHeight = 0;

			if ($dom.data(prefix + "isInit") === undefined) $dom.data(prefix + "isInit", 0);
			if ($dom.data(prefix + "isOpen") === undefined) $dom.data(prefix + "isOpen", 0);

			isInit = $dom.data(prefix + "isInit");
			isOpen = $dom.data(prefix + "isOpen");

			// 判断请求参数
			if (args[0] === "open") {
				_open(args[0], $dom, args[1]);
			} else if (args[0] === "position") {
				_open(args[0], $dom);
			} else if (args[0] === "close") {
				_close($dom, args[1]);
			} else {
				// 初始化
				if (!isInit) {
					options = $.extend({}, defaults, args[0]);
					$dom.data(prefix + "isInit", 1);
					$dom.data(prefix + "id", id);
					$dom.data(prefix + "options", options);
					arrDialogJq.push($dom[0]);

					// 加载样式
					if (!isLoadCss) {
						isLoadCss = 1;
						if (options.css) {
							$("head").append('<link rel="stylesheet" href="' + options.css + '" />');
						}
					}

					// 生成对话框
					$bg = $(bgHtml).appendTo("body");
					$dialog = $(html).appendTo("body");
					$dialog.find("." + prefix + "body").append($dom);
					$dialog.find("." + prefix + "title").html(options.title);
					$dialog.css({
						width: options.width,
						height: options.height
					}).hide();
					$dom.show();

					// 设置高度
					if (!regAuto.test(options.height)) {
						bodyHeight = options.height == "100%" ? $(window).height() : parseInt(options.height);
						$dialog.find("." + prefix + "body").css({
							height: bodyHeight - xheight,
							"overflow-y": options.overflow
						});
					}



					// 是否自动打开
					if (options.autoOpen) _open("open", $dom);

					$dialog.on("click", "." + prefix + "close", function () {
						_close($dom);
					});



					if ($.fn.drag && options.draggable) {
						$dialog.drag({
							handle: "." + prefix + "header"
						});
					}
				} else {
					options = $dom.data(prefix + "options");
					if (options.autoOpen) _open("open", $dom);
				}
			}

		});
	}


	$.fn.dialog.defaults = defaults;


	// 按顺序关闭对话框
	$(document).keyup(function (e) {
		var $dom, l = arrOpenQueue.length,
			options = {};
		// 按esc时，从最后一个对话框开始关闭
		if (e.which == 27 && l > 0) {
			$(arrDialogJq).each(function () {
				if ($(this).data(prefix + "id") == arrOpenQueue[l - 1]) {
					$dom = $(this);
					return;
				}
			});
			options = $dom.data(prefix + "options");
			if (options.closeOnEsc) {
				_close($dom);
			}
		}
	});



	// 打开对话框

	function _open(type, $dom, callback) {
		var _,
			isOpen = $dom.data(prefix + "isOpen"),
			isInit = $dom.data(prefix + "isInit"),
			options = $dom.data(prefix + "options"),
			id = $dom.data(prefix + "id"),
			$dialog = $("#" + id),
			$bg = $("#" + id + "bg"),
			winW = $(window).width(),
			winH = $(window).height(),
			scrL = $(window).scrollLeft(),
			scrT = $(window).scrollTop(),
			theW = $dialog.width(),
			theH = $dialog.height(),
			theL = (winW - theW) / 2 + scrL,
			// 保证对话框在剩余空间的1/3处，更容易阅读
			theT = (winH - theH) / 3 + scrT;
		if (theL < scrL) theL = scrL;
		if (theT < scrT) theT = scrT;

		// 打开
		if (type == "open" && !isOpen && isInit) {
			$dialog.css({
				left: theL,
				top: scrT - theH,
				display: "block"
			});

			zIndex++;
			$bg.css("z-index", zIndex).show().fadeTo(options.duration / 2, 0.5, function () {
				zIndex++;
				$dialog.css("z-index", zIndex).animate({
					top: theT
				}, options.duration, function () {
					$dom.data(prefix + "isOpen", 1);
					arrOpenQueue.push(id);
					options.onopen.call($dialog);
					if ($.isFunction(callback)) callback.call($dialog);
				});
			});
		}
		// 定位
		else if (type == "position" && isInit && isOpen) {
			$dialog.animate({
				left: theL,
				top: theT
			}, options.duration / 2);
		}
	}


	// 关闭对话框

	function _close($dom, callback) {
		var _,
			isOpen = $dom.data(prefix + "isOpen"),
			isInit = $dom.data(prefix + "isInit"),
			options = $dom.data(prefix + "options"),
			id = $dom.data(prefix + "id");

		if (isOpen && isInit) {
			var
			_,
				$dialog = $("#" + id),
				$bg = $("#" + id + "bg"),
				winW = $(window).width(),
				winH = $(window).height(),
				scrT = $(window).scrollTop(),
				theH = $dialog.height(),
				theT = scrT - theH;

			$dialog.animate({
				top: theT
			}, options.duration, function () {
				$(this).hide();
				$bg.fadeOut(options.duration / 2, function () {
					var find = $.inArray(id, arrOpenQueue);
					$dom.data(prefix + "isOpen", 0);
					if (find != -1) {
						arrOpenQueue.splice(find, 1);
					}
					options.onclose.call($dialog);
					if ($.isFunction(callback)) callback.call($dialog);
				});
			});
		}
	}

})(jQuery);