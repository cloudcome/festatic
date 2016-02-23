/*!
 * jquery.geolocation.js
 * @author 云淡然 http://qianduanblog.com
 * @version 1.0
 * 2013年10月2日1:25:12
 */


/**
 *
 * 1. get current position
 * $.geolocation("get",{...});
 *
 * 2. watch position
 * $.geolocation("watch",{...});
 *
 * 3. clear
 * $.geolocation("clear",watchId);
 *
 */



;
(function ($, win, undefined) {

	var GL = win.navigator.geolocation,
		defaults = {
			// onsuccess回调
			// 参考：http://www.w3.org/TR/geolocation-API/#position
			// 参数1： latitude （纬度，单位°）
			// 参数2： longitude （经度，单位°）
			// 参数3： altitude （高度，单位m）
			// 参数4： accuracy （精度，单位m）
			// 参数5： altitudeAccuracy （高精度，单位m）
			// 参数6： heading （角度，[0,360)）
			// 参数7： speed （速度，单位m/s）
			onsuccess: function () {},
			// onerror回调
			// 参考：http://www.w3.org/TR/geolocation-API/#position-error
			// 参数1：code
			// 参数1值1：用户已禁止共享地理位置信息
			// 参数1值2：地理位置信息不可用
			// 参数1值3：地理位置信息获取超时
			onerror: function () {},
			// 参考：http://www.w3.org/TR/geolocation-API/#position-options
			options: {
				// 是否启用高精度请求，将开启GPS设备
				enableHighAccuracy: true,
				// 超时，1000ms
				timeout: 1000,
				// 有效期，60*60*1000ms
				maximumAge: 3600000
			}
		};

	$.support.geolocation = !! GL;

	if (!$.support.geolocation) {
		throw ("浏览器不支持HTML5的地理位置定位");
	}

	// 参考1：http://www.cnblogs.com/lhb25/archive/2012/07/10/html5-geolocation-api-demo.html
	// 参考2：http://www.w3.org/TR/geolocation-API/

	$.extend({
		geolocation: function () {
			var args = arguments,
				argL = args.length,
				temp;
			// 1. get current position
			// $.geolocation("get",{...});
			if (argL == 2 && args[0] === "get" && $.type(args[1]) == "object") {
				return _get(args[1]);
			}
			// 2. watch position
			// $.geolocation("watch",{...});
			if (argL == 2 && args[0] === "watch" && $.type(args[1]) == "object") {
				return _watch(args[1]);
			}
			// 3. clear watch
			// $.geolocation("clear",watchId);
			else if (argL == 2 && args[0] === "clear" && $.type(args[1]) == "number") {
				return _clear(args[1]);
			}
		}
	});

	$.geolocation.defaults=defaults;


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
	 * 请求用户授权，获取地理位置信息
	 * 参考：http://www.w3.org/TR/geolocation-API/#get-current-position
	 * @param  {Object} 参数
	 * @return {undefined}
	 * @version 1.0
	 * 2013年9月27日10:39:11
	 */

	function _get(params) {
		var options = $.extend({}, defaults.options, params);
		return GL.getCurrentPosition(params.onsuccess, params.onerror, options.options);
	}


	/**
	 * 在获得授权情况下，获取地理位置信息
	 * 参考：http://www.w3.org/TR/geolocation-API/#watch-position
	 * @param  {Object} 参数
	 * @return {Number} 查看ID（长整形）
	 * @version 1.0
	 * 2013年9月27日10:41:18
	 */

	function _watch(params) {
		var options = $.extend({}, defaults.options, params);
		return GL.watchPosition(params.onsuccess, params.onerror, options.options);
	}


	/**
	 * 清除查看的地理位置信息记录？
	 * 参考：http://www.w3.org/TR/geolocation-API/#clear-watch
	 * @param  {Number} 查看ID
	 * @return {[type]}         [description]
	 */

	function _clear(watchId) {
		return GL.clearWatch(watchId);
	}

})(jQuery, this);