/*!
 * jquery.fn.drag
 * @author 云淡然 http://qianduanblog.com
 * @for ie9(含)+、chrome、firefox
 * @version 1.0
 * 2013年9月22日13:59:33
 */;
(function ($, undefined) {

	$.fn.drag = function (settings) {
		return this.each(function () {
			var
			_,
				$drag = $(this),
				defaults = {
					// 鼠标操作区域
					handle: "",
					// 拖动的时候层级的高度
					zIndex: 9999,
					// 拖动开始回调
					ondragstart: function () {},
					// 拖动中回调
					ondrag: function () {},
					// 拖动结束回调
					ondragend: function () {} 
				},
				options = $.extend({}, defaults, settings),
				// 拖动对象
				$handle = options.handle ? $drag.find(options.handle) : $drag,
				// 拖动区域对象
				$zoom = $(options.zoom),
				// 拖动开始的位置
				startPos = {},
				// body 默认 cursor
				cursor=$("body").css("cursor"),
				// 默认的 zIndex 值
				zIndex=$drag.css("z-index"),
				// 是否正在拖动
				isDraging = 0;

			// 是否支持html5的draggable
			$.support.draggable = "draggable" in document.createElement("a");

			$handle.css("cursor", "move");
			_checkPosition($drag);

			// html5 拖拽
			if ($.support.draggable === true) {
				$drag.attr("draggable", true);

				// 拖拽开始
				$drag[0].addEventListener("dragstart", function (e) {
					// 兼容火狐
					e.dataTransfer.setData("_","");

					_ondragstrart(e);
				}, false);

				// 拖拽中
				$drag[0].addEventListener("drag", function (e) {
					_ondragpos(e);
				}, false);

				// 拖拽结束
				$drag[0].addEventListener("dragend", function (e) {
					_ondragpos(e,true);
				}, false);
			}
			// html4 拖拽
			else {
				$handle.mousedown(function (e) {
					_ondragstrart(e);
				});

				$(document).mousemove(function (e) {
					_ondragpos(e);
				}).mouseup(function (e) {
					_ondragpos(e,true);
				});
			}


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
				if(!isDraging){
					isDraging=1;
					startPos.screenX = e.screenX;
					startPos.screenY = e.screenY;
					startPos.left = $drag.offset().left;
					startPos.top = $drag.offset().top;
					zIndex=$drag.css("z-index");
					$drag.css("z-index",options.zIndex);
					options.ondragstart.call($drag,e);
					$("body").css("cursor", "move");
				}
				return false;
			}


			/**
			 * 改变拖拽位置
			 * @param  {Object} event对象
			 * @return {undefined}
			 */
			function _ondragpos(e,isStop) {
				// 正在拖动并且不支持html5
				if(isDraging && (!$.support.draggable || isStop)){
					$drag.offset({
						left: e.screenX - startPos.screenX + startPos.left,
						top: e.screenY - startPos.screenY + startPos.top
					});
				}

				// 停止
				if(isStop && isDraging){
					$drag.css("z-index",zIndex);
					isDraging=0;
					options.ondragend.call($drag,e);
					$("body").css("cursor", cursor);
				}else{
					options.ondrag.call($drag,e);
				}
				return false;
			}

		});
	}
})(jQuery);