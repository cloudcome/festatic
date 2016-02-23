;
(function($, win, undefined) {
	var doc = win.document,
		body = doc.body,
		touch = {},
		touchTimeout = 0,
		tapTimeout = 0,
		swipeTimeout = 0,
		longTapTimeout = 0;

	$(function() {
		var now, delta;
		$(document.body).bind("touchstart", function(e) {
			now = Date.now();
			// 距离上次时间差
			delta = now - (touch.last || now);
			// 触摸元素
			touch.$elem = $(_fixParent(e.touches[0].target));
			// 清除触摸定时器
			if (touchTimeout) clearTimeout(touchTimeout);
			touch.x1 = touch.x2 = e.touches[0].pageX;
			touch.y1 = touch.y2 = e.touches[0].pageY;
			// 距离上次触摸时间小于250ms判断为双击
			if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
			touch.last = now;
			// 长按
			longTapTimeout = setTimeout(function() {
				longTapTimeout = 0;
				if (touch.last) {
					touch.$elem.trigger("longTap");
					touch = {};
				}
			}, 750);
		}).bind("touchmove", function(e) {
			// 清除长按定时器
			_cancelLongTap();

			touch.x2 = e.touches[0].pageX;
			touch.y2 = e.touches[0].pageY;

			// 如果横向触摸滑动距离大于10px
			if (Math.abs(touch.x1 - touch.x2) > 10) {
				e.preventDefault();
			}
		}).bind("touchend", function() {
			// 清除长按定时器
			cancelLongTap();

			// 触摸滑动
			if (Math.abs(touch.x1 - touch.x2) > 30 || Math.abs(touch.y1 - touch.y2) > 30) {
				setTimeout(function() {
					touch.$elem.trigger("swipe");
					touch.$elem.trigger("swipe" + _swipeDirection());
					touch = {};
				}, 0);
			} 
			// 触摸点击
			else {
				tapTimeout=setTimeout(function(){
					var event = $.Event('tap');
					event.cancelTouch = _cancelAll;
					touch.$elem.trigger(event);

					// 双击
					if(touch.isDoubleTap){
						touch.$elem.trigger('doubleTap');
						touch={};
					}
					// 单击
					else{
						touchTimeout=setTimeout(function(){
							touchTimeout=0;
							touch.$elem.trigger('singleTap');
							touch = {};
						},250);
					}
				},0);
			}
		}).bind("touchcancel",_cancelAll);

		$(window).bind('scroll', cancelAll);
	});

	function _fixParent(elem) {
		return elem.parentElement ? elem.parentElement : elem;
	}

	function _cancelLongTap() {
		if (longTapTimeout) {
			clearTimeout(longTapTimeout);
			longTapTimeout = 0;
		}
	}

	function _cancelAll(){
		if(touchTimeout)clearTimeout(touchTimeout);
		if(swipeTimeout)clearTimeout(swipeTimeout);
		if(tapTimeout)clearTimeout(tapTimeout);
		if(longTapTimeout)clearTimeout(longTapTimeout);
		touchTimeout=swipeTimeout=tapTimeout=longTapTimeout=0;
		touch={};
	}

	function _swipeDirection() {
		var deltaX = Math.abs(touch.x1 - touch.x2),
			deltaY = Math.abs(touch.y1 - touch.y2);
		return deltaX > deltaY ? (touch.x1 > touch.x2 ? "Left" : "Right") : (touch.y1 > touch.y2 ? "Top" : "Bottom");
	}
})($, this);
