/*!
 * jquery.fn.dialog
 * @author 云淡然 http://qianduanblog.com
 * @for ie9(含)+、chrome、firefox
 * @require http://festatic.aliapp.com/js/jquery-dialog/css/default.css
 * @require jquery-drag.js
 * @version 1.3
 * 2013年11月23日19:50:17
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
 * $.fn.dialog("open",{...});
 *
 * 3、关闭对话框
 * $.fn.dialog("close");
 *
 * 4、根据对话框大小重新定位
 * $.fn.dialog("position");
 *
 */
;
(function ($, undefined) {
	var _,
		prefix = "jquery-dialog____",
		isLoadCss = 0,
		// 对话框jq对象数组，便于遍历查找
		arrDialogJq = [],
		// 打开的对话框队列
		arrOpenQueue = [],
		// 对话框高度之差
		zIndex = 2000,
		xheight = 74,
		regAuto = /^auto$/i,
		regHeight = /\d/,
		defaults = {
			// css样式链接地址
			css: "http://festatic.aliapp.com/css/jquery-dialog/default.min.css?v=" + Math.ceil(Date.now() / 86400000),
			// 对话框标题
			title: "Untitled",
			// 是否自动打开（即是否初始化完成就打开）
			autoOpen: false,
			// 对话框宽度
			width: "600px",
			// 对话框高度
			height: "auto",
			// 层级
			zIndex: 2000,
			// 在给定高度的时候，对话框内容超过样式
			overflow: "scroll",
			// 动画时间
			duration: 123,
			// 是否可以拖动（需引用jquery.drag.js）
			draggable: true,
			// 是否可以按esc关闭
			closeOnEsc: true,
			// 是否可以单击背景关闭
			closeOnBg: true,
			// 是否允许关闭
			canHide: true,
			// 加载一个url
			url: "",
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
				inoptions,
				// 对话框对象
				$dialog,
				// 是否已经初始化完毕
				hasInit,
				// 是否已经打开
				isOpen;

			if ($dom.data(prefix + "hasInit") === undefined) $dom.data(prefix + "hasInit", 0);
			if ($dom.data(prefix + "isOpen") === undefined) $dom.data(prefix + "isOpen", 0);

			hasInit = $dom.data(prefix + "hasInit");
			isOpen = $dom.data(prefix + "isOpen");

			// 判断请求参数
			if (args[0] === "open") {
				_open($dom, $.isFunction(args[1]) ? args[1] : function () {
					if ($.isPlainObject(args[1])) {
						_render($dom, args[1]);
					}
				});
			} else if (args[0] === "position") {
				_position($dom);
			} else if (args[0] === "close") {
				_close($dom);
			} else {
				options = $.extend({}, defaults, args[0]);
				if (options.zIndex > zIndex) zIndex = options.zIndex;
				// 初始化
				if (!hasInit) {
					$dom.data(prefix + "id", id);
					$dom.data(prefix + "options", options);
					arrDialogJq.push($dom[0]);

					// 加载样式
					if (!isLoadCss) {
						$('<link rel="stylesheet" href="' + options.css + '" />').appendTo("head").load(function () {
							isLoadCss = 1;
							_init();
						}).error(function () {
							alert("jquery-dialog样式加载失败，请稍后再试！");
							return;
						});
					} else {
						_init();
					}

					function _init() {
						var bodyHeight = 0;
						$dom.data(prefix + "hasInit", 1);
						// 生成对话框
						$bg = $(bgHtml).appendTo("body");
						$dialog = $(html).appendTo("body");
						$dialog.hide();
						$dom.show();

						$dialog.on("click", "." + prefix + "close", function () {
							_close($dom);
						});

						_render($dom, options, $dom);

						// 拖拽
						if ($.fn.drag && options.draggable) {
							$dialog.drag({
								handle: "." + prefix + "header"
							});
						}

						if (options.autoOpen) {
							_open($dom);
						}
					}

				} else {
					if (options.autoOpen) {
						_open($dom);
					}
				}
			}

		});
	}


	$.fn.dialog.defaults = defaults;


	// 按esc时，关闭最顶层对话框
	$(document).keyup(function (e) {
		var $dom = _topDialog(),
			options = {};
		if (e.which == 27 && $dom && $dom.length) {
			options = $dom.data(prefix + "options");
			if (options.canHide && options.closeOnEsc) {
				_close($dom);
			}
		}
	});


	// 单击背景时，关闭最顶层对话框
	$(document).on("click", "." + prefix + "bg", function () {
		var $dom = _topDialog(),
			options = {};
		if ($dom && $dom.length) {
			options = $dom.data(prefix + "options");
			if (options.canHide && options.closeOnBg) {
				_close($dom);
				return false;
			}
		}
	});


	/**
	 * 渲染对话框
	 * @param  {Object} 对话框对象
	 * @param  {Object} 渲染参数
	 * @param  {Object/HTML} 对话框内容
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年11月23日16:56:52
	 */

	function _render($dom, options, $content) {
		if (!$dom.length) return;
		var _,
			dftOptions = $dom.data(prefix + "options"),
			id = $dom.data(prefix + "id"),
			$dialog = $("#" + id),
			$title = $("." + prefix + "title", $dialog),
			$close = $("." + prefix + "close", $dialog),
			$body = $("." + prefix + "body", $dialog),
			$iframe,
			bodyHeight = 0;

		// 设置关闭按钮
		if (options.canHide === false) {
			$close.hide();
		} else {
			$close.show();
		}

		// 设置内容
		if ($content !== undefined) {
			$body.html($content);
		}
		// 设置远程地址
		else if (options.url) {
			$iframe = $('<iframe src="' + options.url + '" style="width:100%;overflow:hidden;border:0;"></iframe>');
			$dom.html($iframe);
		}

		// 设置标题
		if (options.title !== undefined) {
			$title.html(options.title);
		}

		// 设置高度
		if (options.width !== undefined) {
			$body.width(options.width);
		}

		// 设置高度
		if (!regAuto.test(options.height)) {
			bodyHeight = options.height == "100%" ? $(window).height() : parseInt(options.height);
			$body.css({
				height: bodyHeight - xheight,
				"overflow-y": options.overflow
			});
		}

		// 设置iframe
		if ($iframe) {
			$iframe.load(function () {
				var theH = 400;
				try {
					theH = Math.max($iframe.contents().find("html").outerHeight(), $iframe.contents().find("body").outerHeight());
				} catch (e) {}
				if (!theH) theH = 400;
				$iframe.height(theH);
				_position($dom);
			});
		}

		$dom.data(prefix + "options", $.extend({}, dftOptions, options));
	}




	/**
	 * 获取对话框应该显示的位置
	 * @param  {Object} 对话框对象
	 * @return {Object} 宽高JSON对象
	 * @version 1.0
	 * 2013年11月23日16:46:32
	 */

	function _getPosition($dialog) {
		if (!$dialog.length) return;
		var _,
			winW = $(window).width(),
			winH = $(window).height(),
			scrL = $(window).scrollLeft(),
			scrT = $(window).scrollTop(),
			theW = $dialog.width(),
			theH = $dialog.height(),
			theL = (winW - theW) / 2 + scrL,
			// 保证对话框在剩余空间的1/3处，更容易阅读
			theT = (winH - theH) / 3 + scrT;

		if (theL < scrL) theL = scrL + 5;
		if (theT < scrT) theT = scrT + 5;

		return {
			l: theL,
			t: theT,
			s: scrT,
			h: theH
		};
	}



	/**
	 * 加载、打开、位移对话框
	 * @param  {Object} 对话框对象
	 * @param  {Function} 打开之后回调
	 * @return {Undefined}
	 * @version 1.1
	 * 2013年10月18日14:25:02
	 * 2013年11月23日16:41:04
	 */

	function _open($dom, callback) {
		var _,
			isOpen = $dom.data(prefix + "isOpen"),
			hasInit = $dom.data(prefix + "hasInit"),
			options = $dom.data(prefix + "options"),
			id = $dom.data(prefix + "id"),
			$dialog = $("#" + id),
			$bg = $("#" + id + "bg"),
			pos = _getPosition($dialog);

		if (!isOpen && hasInit) {
			$dialog.css({
				left: pos.l,
				top: pos.s - pos.h,
				display: "block"
			});
			zIndex++;
			$bg.css("z-index", zIndex).show().fadeTo(options.duration / 2, 0.5, function () {
				zIndex++;
				$dialog.css("z-index", zIndex).animate({
					top: pos.t
				}, options.duration, function () {
					$dom.data(prefix + "isOpen", 1);
					arrOpenQueue.push(id);
					options.onopen.call($dialog);
					if (callback) callback.call($dialog);
				});
			});
		}
	}


	/**
	 * 改变对话框的当前位置
	 * @param  {Object} 对话框对象
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年11月23日16:48:45
	 */

	function _position($dom) {
		var _,
			isOpen = $dom.data(prefix + "isOpen"),
			hasInit = $dom.data(prefix + "hasInit"),
			options = $dom.data(prefix + "options"),
			id = $dom.data(prefix + "id"),
			$dialog = $("#" + id),
			pos = _getPosition($dialog);
		if (isOpen && hasInit) {
			$dialog.animate({
				left: pos.l,
				top: pos.t
			}, options.duration / 2);
		}
	}




	/**
	 * 关闭对话框
	 * @param  {Object} 对话框对象
	 * @param  {Function} 关闭回调
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年10月18日14:25:44
	 */

	function _close($dom, callback) {
		var _,
			isOpen = $dom.data(prefix + "isOpen"),
			hasInit = $dom.data(prefix + "hasInit"),
			options = $dom.data(prefix + "options"),
			id = $dom.data(prefix + "id");

		if (isOpen && hasInit) {
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


	/**
	 * 获取最顶层的对话框
	 * @return {Object} 对话框对象
	 * @version 1.0
	 * 2013年10月18日14:26:18
	 */

	function _topDialog() {
		var $dom, l = arrOpenQueue.length;
		$(arrDialogJq).each(function () {
			if ($(this).data(prefix + "id") == arrOpenQueue[l - 1]) {
				$dom = $(this);
				return;
			}
		});
		return $dom;
	}

})(jQuery);
