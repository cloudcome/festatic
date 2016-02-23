/*!
 * jquery.fn.fullscreen
 * @author ydr.me
 * @version 1.0
 */


/**
 * v1.0 2013年11月11日14:11:12
 * 构造
 */


/**
 * $("#demo").fullscreen({...});
 */

;
(function($, win, undefined) {
	var _,
		// 单独为火狐记录全屏目标
		mozFullScreenElement,
		// 单独为ie记录全屏目标
		msFullscreenElement,
		prefix = "jquery-fullscreen____",
		doc = win.document,
		docElem = doc.documentElement,
		isFirefox = doc.mozFullScreenEnabled,
		isIe = doc.msFullscreenEnabled,
		listenEvent = "fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange",
		defaults = {
			// 自动打开全屏
			autoOpen: true,
			// 打开全屏回调
			onopen: function() {},
			// 关闭全屏回调
			onclose: function() {}
		};


	$.fn.fullscreen = function() {
		var args = arguments,
			argL = args.length;
		return this.each(function() {
			var _,
				options = {},
				$this = $(this),
				elem = $this[0];

			if (args[0] == "open") {
				_requestFullscreen(elem);
			} else if (args[0] == "close") {
				_exitFullscreen();
			} else {
				options = $.extend({}, defaults, args[0]);
				if (options.autoOpen) {
					_requestFullscreen(elem);
				}

				$this.data(prefix + "options", options);
			}

			// 只全屏一个对象
			return;
		});
	}

	$.fn.fullscreen.defaults = defaults;

	$(doc).on(listenEvent, function(e) {
		var _,
			// 火狐的全屏目标是 fullscreenElement
			// 其他是e.target
			elem = isFirefox && !doc.mozFullScreenElement ? mozFullScreenElement : (doc.mozFullScreenElement || e.target),
			$this = $(elem),
			options = $this.data(prefix + "options");

		if (_isFullscreen()) {
			if (isFirefox) mozFullScreenElement = doc.mozFullScreenElement;
			if (options && $.isFunction(options.onopen)) {
				options.onopen.call(elem);
			}
		} else {
			if (options && $.isFunction(options.onclose)) {
				options.onclose.call(elem);
			}
		}
	});


	// ie是个怪胎
	if (isIe) {
		doc.onmsfullscreenchange = function(e) {
			var elem = msFullscreenElement || doc.msFullscreenElement,
				$this = $(elem),
				options = $this.data(prefix + "options");
			if (_isFullscreen()) {
				if (isIe) msFullscreenElement = elem;
				if (options && $.isFunction(options.onopen)) {
					options.onopen.call(elem);
				}
			} else {
				if (options && $.isFunction(options.onclose)) {
					options.onclose.call(elem);
				}
			}
		}
	}


	function _isFullscreen() {
		return doc.fullscreen || doc.webkitIsFullScreen || doc.mozFullScreen || !! doc.msFullscreenElement;
	}


	function _requestFullscreen(elem) {
		if (_isFullscreen()) return;
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.webkitRequestFullScreen) {
			elem.webkitRequestFullScreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		}
	}


	function _exitFullscreen() {
		if (!_isFullscreen()) return;
		if (doc.exitFullscreen) {
			doc.exitFullscreen();
		} else if (doc.webkitCancelFullScreen) {
			doc.webkitCancelFullScreen();
		} else if (doc.mozCancelFullScreen) {
			doc.mozCancelFullScreen();
		} else if (doc.msExitFullscreen) {
			doc.msExitFullscreen();
		}
	}
})(jQuery, this);