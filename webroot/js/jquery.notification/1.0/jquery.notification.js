/*!
 * jquery.notification.js
 * @author 云淡然 http://qianduanblog.com
 * @version 1.0
 * 2013年10月2日1:40:06
 */


/**
 *
 * 1. show
 * $.notification({...});
 * $.notification("title","body");
 *
 * 2. clear
 * $.notification(null);
 *
 */



;
(function ($, win, undefined) {
	var
	_,
		// 消息队列
		queue = [],
		// http://www.w3.org/TR/2013/WD-notifications-20130912/
		defaults = {
			title: "通知标题",
			body: "通知内容",
			// 标签类别
			tag: "",
			// 通知图标
			icon: "http://festatic.aliapp.com/img/icon.png",
			// 显示通知
			onshow: function () {},
			// 关闭通知
			onclose: function () {},
			// 单击通知
			onclick: function () {},
			// 错误通知
			onerror: function () {}
		},
		Noti = win.webkitNotifications;

	// 判断浏览器是否支持notification
	$.support.notification = !! Noti;

	$.extend({
		notification: function () {
			var args = arguments,
				argL = args.length,
				temp,
				i = 0,
				j = 0;

			// 1.1 normal show
			// $.notification("title","body");
			if (argL == 2 && _isStrOrNum(args[0]) && _isStrOrNum(args[1])) {
				temp = {};
				temp.title = args[0];
				temp.body = args[1];
				_show(temp);
			}
			// 1.2 params show
			// $.notification({...});
			else if (argL == 1 && $.type(args[0]) == "object") {
				_show(args[0]);
			}
			// 2 clear
			// $.notification(null);
			else if (argL == 1 && args[0] === null) {
				_clear();
			}
		}
	});


	$.notification.defaults=defaults;



	/**
	 * 判断值是否为字符串或者数值
	 * @param  {String/Number} 字符串或数值
	 * @return {Boolean}
	 * @version 1.0
	 * 2013年9月23日15:23:04
	 */

	function _isStrOrNum(val) {
		return $.type(val) == "string" || $.type(val) == "number";
	}



	/**
	 * 获得浏览器桌面通知的许可权限
	 * @version  1.0
	 * @date 2013年7月11日22:34:20
	 * @return {Number} -1、0、1、2
	 * -1 不支持
	 * 0 已允许
	 * 1 尚未允许
	 * 2 已禁止
	 */

	function _getPermission() {
		if (!$.support.notification) return -1;
		return Noti.checkPermission();
	}



	/**
	 * 显示浏览器桌面通知
	 * @param  {Object} 传递参数
	 * @return {undefined}
	 * @version  1.0
	 * 2013年9月26日13:57:35
	 */

	function _show(params) {
		if (!$.support.notification) return;

		var permission = _getPermission(),
			newNotification,
			params = $.extend({}, defaults, params);

		// 已允许
		if (permission == 0) {
			newNotification = Noti.createNotification(params.icon, params.title, params.body);

			// 绑定事件回调
			newNotification.onshow = function () {
				params.onshow.call(newNotification);
			};

			newNotification.onclose = function () {
				params.onclose.call(newNotification);
			};

			newNotification.onclick = function () {
				params.onclick.call(newNotification);
			};

			newNotification.onerror = function () {
				params.onerror.call(newNotification);
			};

			// 入栈通知队列
			queue.push(newNotification);
			newNotification.show();
		}
		// 尚未允许
		else if (permission == 1) {
			// 重新请求允许
			Noti.requestPermission(arguments.callee);
		}
		// 已禁止
		else {
			throw ("用户已禁止桌面通知！");
		}
	}


	/**
	 * 清除所有桌面通知
	 * 对刷新之后再操作桌面通知无效
	 * @return {Boolean} true
	 * @version  1.0
	 * @2013年9月26日14:23:34
	 */

	function _clear() {
		if (!$.support.notification) return;
		var self, i = 0,
			j = queue.length;
		for (; i < j; i++) {
			self = queue[i];
			self.close();
			self.cancel();
		}
		queue = [];
		return true;
	}


})(jQuery, this);