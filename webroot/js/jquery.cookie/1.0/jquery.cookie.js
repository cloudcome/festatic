/*!
 * jquery.cookie.js
 * @author 云淡然 http://qianduanblog.com
 * @version  1.0
 */

/**
 * v1.0 2013年10月23日10:22:40
 */


/**
 *
 * 1. parse cookie
 * $.cookie();
 * =>{a:"1",b:"2",c:"3"}
 *
 * 2. get cookie
 * $.cookie("a");
 * =>"1"
 * $.cookie(["a","b"]);
 * =>{a:"1",b:"2"}
 *
 * 3. set cookie
 * $.cookie("a","11");
 * $.cookie("a","11",{...});
 * $.cookie({a:"11",b:"22"});
 * $.cookie({a:"11",b:"22"},{...});
 * =>strCookie
 *
 * 4. remove cookie
 * $.cookie("a",null);
 * $.cookie(["a","b"],null);
 * =>true
 *
 * 5. clear cookie
 * $.cookie(null);
 * =>true
 *
 */



;
(function($, undefined) {

	var regSplit = /^(.*?)=(.*?)$/,
		defaults = {
			// 是否以严格模式读取和设置cookie，默认true
			// 严格模式将编码键值对再设置，非严格模式将不进行编码
			// 严格模式将解码键值对再读取，非严格模式将不进行解码
			isStrict: true,
			// 在无域名的时候，必须设置为空才能在本地写入
			domain: location.host || "",
			// 默认cookie有效期1个小时（单位秒）
			expires: 3600,
			// 默认cookie存储路径
			path: "/",
			// 是否加密cookie
			secure: false
		};

	$.extend({
		cookie: function() {
			var args = arguments,
				argL = args.length,
				temp, i = 0,
				j = 0;
			// 1. parse
			// $.cookie();
			if (argL == 0) {
				return _parse();
			}
			// 2.1 get
			// $.cookie("a");
			else if (argL == 1 && _isStrOrNum(args[0])) {
				return _get(args[0]);
			}
			// 2.2 get
			// $.cookie(["a","b"]);
			else if (argL == 1 && $.isArray(args[0])) {
				temp = {};
				j = args[0].length;
				for (; i < j; i++) {
					temp[args[0][i]] = _get(args[0][i]);
				}
				return temp;
			}
			// 3.1 set
			// $.cookie("a","1");
			else if (argL == 2 && _isStrOrNum(args[0]) && _isStrOrNum(args[1])) {
				temp = {};
				temp[args[0]] = args[1];
				return _set(temp);
			}
			// 3.2 single set + params
			// $.cookie("a","1",{...});
			else if (argL == 3 && _isStrOrNum(args[0]) && _isStrOrNum(args[1]) && $.type(args[2]) == "object") {
				temp = {};
				temp[args[0]] = args[1];
				return _set(temp, args[2]);
			}
			// 3.3 multiple set
			// $.cookie({"a":"1","b":"2"},{...});
			else if (argL == 1 && $.type(args[0]) == "object") {
				return _set(args[0], args[1]);
			}
			// 3.4 multiple set + params
			// $.cookie({"a":"1","b":"2"},{...});
			else if (argL == 2 && $.type(args[0]) == "object" && $.type(args[1]) == "object") {
				return _set(args[0], args[1]);
			}
			// 4.1 single remove
			// $.cookie("a",null);
			else if (argL == 2 && _isStrOrNum(args[0]) && args[1] === null) {
				temp = {};
				temp[args[0]] = "";
				return _set(temp, {
					expires: -1
				});
			}
			// 4.2 single remove + params
			// $.cookie("a",null,{...});
			else if (argL == 3 && _isStrOrNum(args[0]) && args[1] === null && $.type(args[2]) == "object") {
				temp = {};
				temp[args[0]] = "";
				return _set(temp, $.extend({}, defaults, args[2], {
					expires: -1
				}));
			}
			// 4.3 multiple remove
			// $.cookie(["a","b"],null);
			else if (argL == 2 && $.isArray(args[0]) && args[1] === null) {
				temp = {};
				j = args[0].length;
				for (; i < j; i++) {
					temp[args[0][i]] = "";
				}
				return _set(temp, {
					expires: -1
				});
			}
			// 4.4 multiple remove + params
			// $.cookie(["a","b"],null,{...});
			else if (argL == 3 && $.isArray(args[0]) && args[1] === null && $.type(args[2]) == "object") {
				temp = {};
				j = args[0].length;
				for (; i < j; i++) {
					temp[args[0][i]] = "";
				}
				return _set(temp, $.extend({}, defaults, args[2], {
					expires: -1
				}));
			}
			// 5 clear
			// $.cookie(null);
			else if (argL == 1 && args[0] === null) {
				temp = _parse();
				_set(temp, {
					expires: -1
				}, true);
				return true;
			}
		}
	});

	$.cookie.defaults = defaults;

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
	 * 字符串 URI 部分编码
	 * @param {String}
	 * @return {String}
	 * @version 1.0
	 * 2013年9月25日13:19:23
	 */

	function _encode(str) {
		return _isStrOrNum(str) ? encodeURIComponent(str) : str;
	}


	/**
	 * 字符串 URI 部分解码
	 * @param {String}
	 * @return {String}
	 * @version 1.0
	 * 2013年9月25日13:19:23
	 */

	function _decode(str) {
		return _isStrOrNum(str) ? decodeURIComponent(str) : str;
	}

	/**
	 * 解析cookie成键值对
	 * cookie的特殊性，只能读取键值对，
	 * 其中path、domain、expires、secure都无法被读取
	 * @return {Object} 键值对对象
	 * @version 1.0
	 * 2013年9月25日11:36:39
	 */

	function _parse() {
		var objCookie = {}, strCookie = document.cookie,
			arrCookie = [],
			i = 0,
			j, temp, tempKey, tempVal;
		arrCookie = strCookie.split(";");
		j = arrCookie.length;
		for (; i < j; i++) {
			temp = arrCookie[i].match(regSplit);
			if (!temp || temp[1] === null || temp[2] === null) continue;
			tempKey = $.trim(temp[1]);
			tempVal = defaults.isStrict ? _encode(temp[2]) : temp[2];
			if (tempKey !== "") {
				objCookie[tempKey] = tempVal;
			}
		}
		return objCookie;
	}


	/**
	 * 获取cookie值
	 * @param  {String} 键
	 * @return {null/String/undefined}
	 * @version 1.0
	 * 2013年9月25日12:25:01
	 */

	function _get(strKey) {
		var objCookie = _parse();
		if (!_isStrOrNum(strKey)) return null;
		return defaults.isStrict ? _decode(objCookie[strKey]) : objCookie[strKey];
	}


	/**
	 * 设置cookie
	 * @param {Object} 设置的键值对
	 * @param {Object} cookie参数
	 * @param {Boolean} 是否删除值
	 * @version 1.1
	 * 2013年9月25日12:25:54
	 * 2013年10月23日10:09:23
	 */

	function _set(objSet, objParams, isRemove) {
		var Dt,
			aTemp = [],
			sTemp = "",
			i, strCookie = "",
			objParams = $.extend({}, defaults, objParams),
			tempKey, tempVal;

		for (i in objSet) {
			Dt = new Date();
			Dt.setTime(Dt.getTime() + objParams.expires * 1000);
			objParams.expires = Dt.toGMTString();

			if (!_isStrOrNum(i) || !_isStrOrNum(objSet[i])) continue;

			tempKey = $.trim(i);
			tempVal = isRemove ? "" : objParams.isStrict ? _encode(objSet[i]) : objSet[i];

			aTemp = [
				tempKey + "=" + tempVal + ";",
				objParams.expires !== undefined ? "expires=" + objParams.expires + ";" : "",
				objParams.path !== undefined ? "path=" + objParams.path + ";" : "",
				objParams.domain !== undefined ? "domain=" + objParams.domain + ";" : "",
				objParams.secure ? "secure=secure;" : ""
			];
			sTemp = aTemp.join("");
			document.cookie = sTemp;
			strCookie += sTemp;
		}

		return strCookie;
	}

})(jQuery);