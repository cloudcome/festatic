/*!
 * jquery.fn.drag
 * @author 云淡然 http://qianduanblog.com
 * @for ie9(含)+、chrome、firefox
 * @version 1.1
 * 2013-11-23 16:24:47
 */
;
(function($, undefined) {

	var defaults = {
		// 鼠标操作区域
		handle: "",
		// 拖动开始回调
		ondragstart: function() {},
		// 拖动中回调
		ondrag: function() {},
		// 拖动结束回调
		ondragend: function() {}
	};

	$.fn.drag = function(settings) {
		return this.each(function() {
			var
			_,
				$drag = $(this),
				options = $.extend({}, defaults, settings),
				// 拖动对象
				$handle = options.handle ? $drag.find(options.handle) : $drag,
				// 拖动区域对象
				$zoom = $(options.zoom),
				// 拖动开始的位置
				startPos = {},
				// body 默认 cursor
				cursor = $("body").css("cursor"),
				// 默认的 zIndex 值
				zIndex = 0,
				// 是否正在拖动
				isDraging = 0;

			// 是否支持html5的draggable
			// $.support.draggable = "draggable" in document.createElement("a");

			$handle.css("cursor", "move");
			_checkPosition($drag);

			// html4 拖拽
			$handle.mousedown(function(e) {
				if (!isDraging) {
					zIndex = $drag.css("z-index");
					_ondragstrart(e);
					return false;
				}
			});

			$(document).mousemove(function(e) {
				if (isDraging) {
					_ondragpos(e);
					return false;
				}
			}).mouseup(function(e) {
				if (isDraging) {
					_ondragpos(e, true);
					return false;
				}
			});


			/**
			 * 检查拖动对象的position
			 * @return {undefined}
			 */

			function _checkPosition() {
				if (!$drag.css("position") || $drag.css("position") == "static") {
					$drag.css({
						position: "relative",
						left: 0,
						top: 0
					});
				}
			}


			/**
			 * 开始拖动
			 * @param  {Object} event对象
			 * @return {undefined}
			 */

			function _ondragstrart(e) {
				isDraging = 1;
				startPos.screenX = e.screenX;
				startPos.screenY = e.screenY;
				startPos.left = $drag.offset().left;
				startPos.top = $drag.offset().top;
				$drag.css("z-index", $.isNumeric(zIndex) ? zIndex * 1 + 1 : 1);
				options.ondragstart.call($drag, e);
				$("body").css("cursor", "move");
			}


			/**
			 * 改变拖拽位置
			 * @param  {Object} event对象
			 * @return {undefined}
			 */

			function _ondragpos(e, isStop) {
				// 正在拖动并且不支持html5
				if (isDraging) {
					$drag.offset({
						left: e.screenX - startPos.screenX + startPos.left,
						top: e.screenY - startPos.screenY + startPos.top
					});
				}

				// 停止
				if (isStop && isDraging) {
					$drag.css("z-index", zIndex);
					isDraging = 0;
					options.ondragend.call($drag, e);
					$("body").css("cursor", cursor);
				} else {
					options.ondrag.call($drag, e);
				}
			}
		});
	}

	$.fn.drag.defaults = defaults;
})(jQuery);