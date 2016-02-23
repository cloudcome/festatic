/*!
 * jquery.search.js
 * @author 云淡然 http://qianduanblog.com
 * @version 1.0
 * 2013年9月26日15:17:40
 */

/**
 * 1. parse
 * $.search();
 *
 * 2. get
 * $.search("a");
 * $.search(["a","b"]);
 *
 * 3. set
 * $.search("a",1);
 * $.search("a",1,true);
 * $.search({a:1,b:2});
 * $.search({a:1,b:2},true);
 *
 * 4.remove
 * $.search("a",null);
 * $.search("a",null,true);
 * $.search(["a","b"],null);
 * $.search(["a","b"],null,true);
 *
 * 5.clear
 * $.search(null);
 * $.search(null,true);
 *
 */



;
(function ($, win, undefined) {

	$.extend({
		search: function () {
			var _,
				args = arguments,
				argL = args.length,
				strSearch = win.location.search,
				objSearch = {},
				temp,
				i = 0,
				j = 0;

			// 1. parse
			// $.search();
			if (argL == 0) {
				return _parse(strSearch);
			}
			// 2.1 single get
			// $.search("a");
			else if (argL == 1 && _isStrOrNum(args[0])) {
				objSearch=_parse(strSearch);
				temp = _get(objSearch, [args[0]]);
				return temp[args[0]];
			}
			// 2.2 multiple get
			// $.search(["a","b"]);
			else if (argL == 1 && $.isArray(args[0])) {
				objSearch=_parse(strSearch);
				return _get(objSearch, args[0]);
			}
			// 3.1 single set
			// $.search("a","1");
			// $.search("a","1",true);
			else if (_isStrOrNum(args[0]) && _isStrOrNum(args[1])) {
				objSearch = _parse(strSearch);
				temp = {};
				temp[args[0]] = args[1];
				return _stringify($.extend({}, objSearch, temp), args[2]);
			}
			// 3.2 multiple set
			// $.search({a:1,b:2});
			// $.search({a:1,b:2},true);
			else if ($.type(args[0]) == "object") {
				objSearch = _parse(strSearch);
				return _stringify($.extend({}, objSearch, args[0]), args[1]);
			}
			// 4.1 single remove
			// $.search("a", null) 
			// $.search("a", null,true) 
			else if (_isStrOrNum(args[0]) && args[1] === null) {
				objSearch = _parse(strSearch);
				return _remove(objSearch, [args[0]], args[2]);
			}
			// 4.2 multiple remove
			// $.search(["a","b"], null);
			// $.search(["a","b"], null,true);
			else if ($.isArray(args[0]) && args[1] === null) {
				objSearch = _parse(strSearch);
				return _remove(objSearch, args[0], args[2]);
			}
			// 5. clear
			// $.search(null);
			// $.search(null,true);
			else if (args[0] === null) {
				return _remove({}, [], args[1]);
			}
		}
	});



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
	 * 解析 search string 为 object
	 * @param  {String} hash有效值
	 * @return {Object} 对象
	 * @version 1.0
	 * 2013年9月23日13:31:28
	 */

	function _parse(strSearch) {
		strSearch = strSearch.replace(/^\?*/, "");
		var arrSearch = strSearch.split("&"),
			objSearch = {}, i = 0,
			j = arrSearch.length,
			tempArr, tempKey, tempVal;

		for (; i < j; i++) {
			tempArr = arrSearch[i].split("=");
			tempKey = _decode(tempArr[0]);
			tempVal = _decode(tempArr[1]);
			if (tempKey !== "" && tempKey !== undefined) {
				objSearch[tempKey] = tempVal;
			}
		}

		return objSearch;
	}

	/**
	 * 获得search值
	 * @param  {Object} 解析后的对象
	 * @param  {Array} get数组
	 * @return {Object}
	 * @version 1.0
	 * 2013年9月26日15:57:49
	 */

	function _get(objSearch, arrGet) {
		var i = 0,
			j = arrGet.length,
			objGet = {},
			tempKey;
		for (; i < j; i++) {
			tempKey = arrGet[i];
			if (_isStrOrNum(tempKey)) {
				objGet[tempKey] = objSearch[tempKey];
			}
		}
		return objGet;
	}



	/**
	 * 解析 object 为 search string
	 * @param {Object} search 对象
	 * @param {Boolean} 是否自动跳转
	 * @version 1.0
	 * 2013年9月26日15:46:20
	 */

	function _stringify(objSearch, isLocation) {
		var i, strSearch = "",
			arrSearch = [];
		for (i in objSearch) {
			if (objSearch[i] !== undefined) {
				arrSearch.push(_encode(i) + "=" + _encode(objSearch[i]));
			}
		}
		strSearch += arrSearch.join("&");

		if (isLocation) {
			win.location.search = strSearch;
		} else {
			return strSearch;
		}
	}



	/**
	 * 清除对象
	 * @param {Object} 被清除的对象
	 * @param {Array} 清除数组
	 * @param {Boolead} 是否自动跳转
	 * @return {Object} 清楚后的对象
	 * @version 1.0
	 * 2013年9月26日16:09:08
	 */

	function _remove(objSearch, arrSearch, isLocation) {
		var i = 0,
			j = arrSearch.length;
		for (; i < j; i++) {
			delete(objSearch[arrSearch[i]]);
		}
		return _stringify(objSearch, isLocation);
	}


})(jQuery, this);