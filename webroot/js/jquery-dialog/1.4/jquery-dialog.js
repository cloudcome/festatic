/*!
 * jquery.fn.dialog
 * @author 云淡然 http://qianduanblog.com
 * @for ie9(含)+、chrome、firefox
 * @require http://festatic.aliapp.com/js/jquery-dialog/css/default.css
 * @require jquery-drag.js
 * @version 1.4
 * 2014年2月18日19:42:17
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
 * $.fn.dialog("open",[options]);
 *
 * 3、关闭对话框
 * $.fn.dialog("close");
 *
 * 4、根据对话框大小重新定位
 * $.fn.dialog("position");
 *
 */
;
(function($, win, undefined) {
	var _,
		prefix = "jquery-dialog____",
		isLoadCss = 0,
		// 打开的对话框队列
		arrOpenQueue = [],
		// 对话框id和原dom配对json
		dialogJson = {},
		initWinW = $(window).width(),
		// 对话框高度之差
		zIndex = 2000,
		xheight = 74,
		regAuto = /^auto$/i,
		regHeight = /\d/,
		fitTimer = 0,
		emptyFn = function() {},
		// 标注【*】的项目表示可以重复修改的，即多次初始化
		defaults = {
			// css样式链接地址
			css: "http://festatic.aliapp.com/css/jquery-dialog/default.min.css?v=" + Math.ceil(Date.now() / 86400000),
			// 对话框标题【*】
			title: "Untitled",
			// 是否自动打开（即是否初始化完成就打开）
			autoOpen: false,
			// 对话框宽度【*】
			width: 600,
			// 对话框高度【*】
			height: "auto",
			// 层级【*】
			zIndex: 2000,
			// 在给定高度的时候，对话框内容超过样式【*】
			overflow: "scroll",
			// 动画时间【*】
			duration: 123,
			// 是否可以拖动（需引用jquery.drag.js）
			draggable: true,
			// 是否可以按esc关闭【*】
			closeOnEsc: true,
			// 是否可以单击背景关闭【*】
			closeOnBg: true,
			// 是否允许关闭【*】（设置为false，将导致 closeOnEsc 和 closeOnBg 失效）
			canHide: true,
			// 加载一个url【*】
			url: "",
			// 打开回调
			onopen: emptyFn,
			// 关闭回调
			onclose: emptyFn
		};


	$.fn.dialog = function() {

		var args = arguments,
			argL = args.length;

		return this.each(function() {
			var
			_,
				$dom = $(this),
				id = prefix + Date.now(),
				// 这里先设置绝对定位，防止拖拽插件判断错误，因为样式是动态加载的
				html = "<div style='position:absolute;' class='" + prefix + "' id='" + id + "'><div class='" + prefix + "wrap'><div class='" + prefix + "header'><span class='" + prefix + "title'></span><a class='" + prefix + "close' href='javascript:;'>&times;</a></div><div class='" + prefix + "body'></div></div></div>",
				bgHtml = "<div class='" + prefix + "bg' id='" + id + "bg'></div>",
				// 参数
				settings = {},
				openFn = emptyFn,
				options,
				inoptions,
				// 对话框对象
				$dialog,
				// 是否已经初始化完毕
				hasInit,
				// 是否已经打开
				isOpen;

			if (_data($dom, "hasInit") === undefined) _data($dom, "hasInit", 0);
			if (_data($dom, "isOpen") === undefined) _data($dom, "isOpen", 0);

			hasInit = _data($dom, "hasInit");
			isOpen = _data($dom, "isOpen");



			// 判断请求参数
			if (args[0] === "open") {
				if (argL == 3) {
					settings = args[1];
					openFn = args[2];
				} else if ($.isPlainObject(args[1])) {
					settings = args[1];
				} else if ($.isFunction(args[1])) {
					openFn = args[1];
				}

				_ready(settings, function() {
					if ($.isPlainObject(args[1]) && args[1].url !== undefined && args[1].url !== "") {
						$dom.empty();
					}
					_open($dom, function() {
						_render($dom, settings);
						openFn.call($dom[0]);
					});
				});
			} else if (args[0] === "position") {
				_ready(settings, function() {
					_position($dom);
				});
			} else if (args[0] === "close") {
				_ready(settings, function() {
					_close($dom);
				});
			} else {
				_ready(args[0]);
			}


			function _ready(settings, callback) {
				options = _data($dom, "options");
				// 初始化
				if (hasInit) {
					_render($dom, options);
					if (options.autoOpen) {
						_open($dom);
					}
					if (callback) callback();
				} else {
					options = $.extend({}, defaults, settings);
					if (options.zIndex > zIndex) zIndex = options.zIndex;
					_data($dom, "id", id);
					_data($dom, "options", options);
					dialogJson[id] = $dom[0];

					// 加载样式
					if (!isLoadCss) {
						$('<link rel="stylesheet" href="' + options.css + '" />').appendTo("head").load(function() {
							isLoadCss = 1;
							_init();
						}).error(function() {
							alert("jquery-dialog样式加载失败，请稍后再试！");
							return;
						});
					} else {
						_init();
					}

					function _init() {
						var bodyHeight = 0;
						_data($dom, "hasInit", 1);
						// 生成对话框
						$bg = $(bgHtml).appendTo("body");
						$dialog = $(html).appendTo("body");
						$dialog.hide();
						$dom.show();

						$dialog.on("click", "." + prefix + "close", function() {
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

						if (callback) callback();
					}

				}
			}

		});
	}


	$.fn.dialog.defaults = defaults;


	// 按esc时，关闭最顶层对话框
	$(document).keyup(function(e) {
		var $dom = _topDialog(),
			options = {};
		if (e.which == 27 && $dom && $dom.length) {
			options = _data($dom, "options");
			if (options.canHide && options.closeOnEsc) {
				_close($dom);
			}
		}
	});


	// 单击背景时，关闭最顶层对话框
	$(document).on("click", "." + prefix + "bg", function() {
		var $dom = _topDialog(),
			options = {};
		if ($dom && $dom.length) {
			options = _data($dom, "options");
			if (options.canHide && options.closeOnBg) {
				_close($dom);
				return false;
			}
		}
	});


	$(win).resize(function() {
		var _winW = $(win).width();
		if (fitTimer) {
			clearTimeout(fitTimer);
			fitTimer = 0;
		}
		if (initWinW != _winW) {
			fitTimer = setTimeout(function() {
				_fitWindow();
				initWinW = $(win).width();
			}, 123);
		}
	});



	/**
	 * 读取和设置对话框data参数
	 * @param  {Object} 对话框初始DOM对象
	 * @param  {String} data名称
	 * @param  {*} data值
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年11月25日14:20:20
	 */

	function _data($dom, dataKey, dataVal) {
		return dataVal === undefined ?
			$dom.data(prefix + dataKey) :
			$dom.data(prefix + dataKey, dataVal);
	}


	/**
	 * 适应当前window
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年11月25日13:21:51
	 */

	function _fitWindow() {
		// 遍历当前可视的dialog
		var i = 0,
			j = arrOpenQueue.length,
			ids = [],
			winW = $(win).width(),
			$finds = $();
		for (; i < j; i++) {
			$finds = $finds.add("#" + arrOpenQueue[i]);
			ids.push(arrOpenQueue[i]);
		};
		i = 0;
		$finds.each(function() {
			var $dom = $(dialogJson[ids[i]]),
				$dialog = $('#' + ids[i]),
				options = _data($dom, "options"),
				optionsWidth = isNaN(parseInt(options.width)) ? defaults.width : parseInt(options.width);

			if (optionsWidth + 10 > winW) {
				$dialog.width(winW);
			} else {
				$dialog.width(optionsWidth);
			}

			_position($dom);

			i++;
		});
	}


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
			dftOptions = _data($dom, "options"),
			newOptions = {},
			hasInit = _data($dom, "hasInit"),
			id = _data($dom, "id"),
			winW = $(win).width(),
			winH = $(win).height(),
			$dialog = $("#" + id),
			$bg = $("#" + id + "bg"),
			$title = $("." + prefix + "title", $dialog),
			$close = $("." + prefix + "close", $dialog),
			$body = $("." + prefix + "body", $dialog),
			$iframe, $loading,
			bodyHeight = 0,
			optionsWidth = isNaN(parseInt(options.width)) ? defaults.width : parseInt(options.width);

		// 设置内容
		if ($content !== undefined) {
			$body.html($content);
		}

		// 设置远程地址
		if (options.url) {
			newOptions.url = "";
			$iframe = $('<iframe src="' + options.url + '" style="width:100%;overflow:hidden;border:0;display:none;"></iframe>');
			$dom.html($iframe);
			$loading = $("<p style='font-size:20px;text-align: center;color: #888;'>加载中……</p>").appendTo($dom);
			$iframe.load(function() {
				var theH = 400;
				$loading.remove();
				$iframe.show();
				try {
					theH = Math.max($iframe.contents().find("html").outerHeight(), $iframe.contents().find("body").outerHeight());
				} catch (e) {}
				if (!theH) theH = 400;
				$iframe.height(theH);
				_position($dom);
			});
		}

		// 设置标题
		if (options.title !== undefined) {
			$title.html(options.title);
			newOptions.title = options.title;
		}

		// 设置宽度
		if (options.width !== undefined) {
			$dialog.width(options.width);
			newOptions.width = options.width;
		}
		if (optionsWidth + 10 > winW) {
			$dialog.width(winW);
		} else {
			$dialog.width(optionsWidth);
		}

		// 设置高度
		if (!regAuto.test(options.height)) {
			newOptions.height = options.height;
			newOptions.overflow = options.overflow || defaults.overflow;
			bodyHeight = options.height == "100%" ? winH : parseInt(options.height);
			$body.css({
				height: bodyHeight - xheight,
				"overflow-y": newOptions.overflow
			});
		}

		// 设置层级
		if (options.zIndex && options.zIndex > zIndex) {
			zIndex = options.zIndex;
			$bg.css("z-index", zIndex);
			$dialog("z-index", ++zIndex);
			newOptions.zIndex = zIndex;
		}

		// 设置动画时间
		if (options.duration) {
			newOptions.duration = options.duration;
		}

		// 设置按 esc 是否关闭对话框
		if (options.closeOnEsc !== undefined) {
			newOptions.closeOnEsc = options.closeOnEsc;
		}

		// 设置单击背景是否关闭对话框
		if (options.closeOnBg !== undefined) {
			newOptions.closeOnBg = options.closeOnBg;
		}

		// 设置关闭按钮
		if (options.canHide === false) {
			$close.hide();
			newOptions.canHide = false;
		} else {
			$close.show();
			newOptions.canHide = true;
		}

		// 设置打开回调
		if (options.onopen !== undefined) {
			newOptions.onopen = options.onopen;
		}

		// 设置关闭回调
		if (options.onclose !== undefined) {
			newOptions.onclose = options.onclose;
		}

		_data($dom, "options", $.extend({}, dftOptions, newOptions));
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
			winW = $(win).width(),
			winH = $(win).height(),
			scrL = $(win).scrollLeft(),
			scrT = $(win).scrollTop(),
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
			isOpen = _data($dom, "isOpen"),
			hasInit = _data($dom, "hasInit"),
			options = _data($dom, "options"),
			id = _data($dom, "id"),
			$dialog = $("#" + id),
			$bg = $("#" + id + "bg"),
			pos = _getPosition($dialog);

		if (!isOpen && hasInit) {
			$dialog.css({
				left: pos.l,
				top: pos.s - pos.h,
				display: "block"
			});
			$bg.css("z-index", ++zIndex).show().fadeTo(options.duration / 2, 0.5, function() {
				$dialog.css("z-index", ++zIndex).animate({
					top: pos.t
				}, options.duration, function() {
					_data($dom, "isOpen", 1);
					arrOpenQueue.push(id);
					options.onopen.call($dialog);
					if (callback) callback();
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
			isOpen = _data($dom, "isOpen"),
			hasInit = _data($dom, "hasInit"),
			options = _data($dom, "options"),
			id = _data($dom, "id"),
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
			isOpen = _data($dom, "isOpen"),
			hasInit = _data($dom, "hasInit"),
			options = _data($dom, "options"),
			id = _data($dom, "id"),
			$dialog, $bg,
			winW = $(win).width(),
			winH = $(win).height(),
			scrT = $(win).scrollTop(),
			theH = 0,
			theT = scrT - theH;

		if (isOpen && hasInit) {

			$dialog = $("#" + id);
			$bg = $("#" + id + "bg");
			theH = $dialog.height();

			$dialog.animate({
				top: theT
			}, options.duration, function() {
				$(this).hide();
				$bg.fadeOut(options.duration / 2, function() {
					var find = $.inArray(id, arrOpenQueue);
					$dom.data(prefix + "isOpen", 0);
					if (find != -1) {
						arrOpenQueue.splice(find, 1);
					}
					options.onclose.call($dialog);
					if ($.isFunction(callback)) callback();
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
		return $(dialogJson[arrOpenQueue[arrOpenQueue.length - 1]]);
	}

})($, this);
