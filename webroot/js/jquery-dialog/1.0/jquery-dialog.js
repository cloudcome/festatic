/*!
 * jquery.fn.dialog
 * @author 云淡然 http://qianduanblog.com
 * @for ie9(含)+、chrome、firefox
 * @require http://festatic.aliapp.com/js/jquery-dialog/css/default.css
 * @require jquery-drag.js
 * @version 1.0
 * 2013年9月24日10:31:37
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
 * $.fn.dialog("open");
 *
 * 3、关闭对话框
 * $.fn.dialog("close");
 *
 */
;
(function ($, undefined) {
	var _,
		prefix = "dialog____",
		isLoadCss = 0,
		// 对话框jq对象数组，便于遍历查找
		arrDialogJq = [],
		// 打开的对话框队列
		arrOpenQueue = [],
		// 上一次层级
		zIndex = 2000,
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
			// 持续时间
			duration: 123
		};


	$.fn.dialog = function (settings) {

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
				isOpen;

			if ($dom.data(prefix + "isInit") === undefined) $dom.data(prefix + "isInit", 0);
			if ($dom.data(prefix + "isOpen") === undefined) $dom.data(prefix + "isOpen", 0);

			isInit = $dom.data(prefix + "isInit");
			isOpen = $dom.data(prefix + "isOpen");


			// 判断请求参数
			if (settings === "open") {
				_open($dom);
			} else if (settings === "close") {
				_close($dom);
			} else {
				if (!isInit) {
					options = $.extend({}, defaults, settings);
					$dom.data(prefix + "isInit", 1);
					$dom.data(prefix + "id", id);
					$dom.data(prefix + "options", options);
					arrDialogJq.push($dom[0]);

					// 加载样式
					if (!isLoadCss) {
						isLoadCss = 1;
						if(options.css){
							if (document.all) {
								document.createStyleSheet(options.css);
							} else {
								$("head").append('<link rel="stylesheet" href="' + options.css + '" />');
							}
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

					// 是否自动打开
					if (options.autoOpen) _open($dom);

					$dialog.on("click", "." + prefix + "close", function () {
						_close($dom);
					});

					console.log($dialog.css("position"));

					if($.fn.drag){
						$dialog.drag({
							handle:"."+prefix+"header"
						});
					}
				}
			}

		});
	}


	// 按顺序关闭对话框
	$(document).keyup(function (e) {
		var $dom, l = arrOpenQueue.length;
		// 按esc时，从最后一个对话框开始关闭
		if (e.which == 27 && l > 0) {
			$(arrDialogJq).each(function () {
				if ($(this).data(prefix + "id") == arrOpenQueue[l - 1]) {
					$dom = $(this);
					return;
				}
			});
			_close($dom);
		}
	});



	// 打开对话框

	function _open($dom, callback) {
		var _,
			isOpen = $dom.data(prefix + "isOpen"),
			isInit = $dom.data(prefix + "isInit"),
			options = $dom.data(prefix + "options"),
			id = $dom.data(prefix + "id");


		if (!isOpen && isInit) {
			var _,
				$dialog = $("#" + id),
				$bg = $("#" + id + "bg"),
				winW = $(window).width(),
				winH = $(window).height(),
				scrL = $(window).scrollLeft(),
				scrT = $(window).scrollTop(),
				theW = $dialog.width(),
				theH = $dialog.height(),
				theL = (winW - theW) / 2 + scrL,
				theT = (winH - theH) / 2 + scrT;


			if (theL <= 0) theL = 0;
			if (theT <= 0) theT = 0;

			$dialog.css({
				left: theL,
				top: scrT-theH,
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
					if ($.isFunction(callback)) callback.call($dialog);
				});
			});
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
				winH = $(window).height(),
				scrT = $(window).scrollTop(),
				theH = $dialog.height(),
				theT = winH + scrT + theH,
				overflow = $("html,body").css("overflow");

			$("html,body").css("overflow", "hidden");
			$dialog.animate({
				top: theT
			}, options.duration, function () {
				$(this).hide();
				$bg.fadeOut(options.duration / 2, function () {
					var find = $.inArray(id, arrOpenQueue);
					$dom.data(prefix + "isOpen", 0);
					$("html,body").css("overflow", overflow);
					if (find != -1) {
						arrOpenQueue.splice(find, 1);
					}
					if ($.isFunction(callback)) callback.call($dialog);
				});
			});
		}
	}

})(jQuery);