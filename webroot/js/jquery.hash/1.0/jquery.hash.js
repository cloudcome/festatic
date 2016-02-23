/*!
 * jquery.hash.js
 * @author 云淡然 http://qianduanblog.com
 * @versio 1.0
 * @for ie9+、chrome、firefox
 * 2013年11月1日12:00:03
 */

/**
 *
 * 1. parse
 * $.hash();
 * =>{a:1,b:2,c:3}
 *
 * 2. get
 * $.hash("a");
 * =>1
 * $.hash(["a","b"]);
 * =>{a:1,b:2}
 *
 * 3、set
 * $.hash("a","1");
 * $.hash("a","1","?");
 * $.hash({a:1,b:2,c:3});
 * $.hash({a:1,b:2,c:3},"!");
 * =>strHash
 *
 * 4. remove
 * $.hash("a",null)
 * $.hash(["a","b"],null)
 * =>strHash
 *
 * 5. clear
 * $.hash(null);
 *
 * 6. listen
 * $.hash("listen","a",function(){});
 * $.hash("listenAnd",["a","b"],function(){});
 * $.hash("listenOr",["a","b"],function(){});
 *
 */

;
(function ($, undefined) {

	var _,
		regHashPrefix = /^#*/,
		regHashType = /^[!?]*/,
		regHashPathQuery = /^[\/&]*|[\/&]*$/g,
		lastParseObject={},
		defaults = {
			// 默认的解析类型
			hashType: "!"
		},
		// 是否绑定了监听事件
		hasBindListen = 0,
		// 绑定事件的队列
		eventQueue = [];


	$.extend({
		hash: function () {
			var args = arguments,
				argL = arguments.length,
				strHash = window.location.hash,
				objHash = {},
				objGet = {},
				objSet = {},
				i,
				j,
				temp;

			// 1、解析
			// $.hash();
			if (argL == 0) {
				return _parse(strHash);
			}
			// 2、单值获取
			// $.hash("a");
			else if (argL == 1 && _isStrOrNum(args[0])) {
				objHash = _parse(strHash);
				return objHash[args[0]];
			}
			// 2、多值获取
			// $.hash(["a","b"]);
			else if (argL == 1 && $.type(args[0]) == "array") {
				objHash = _parse(strHash);
				j = args[0].length;
				for (i = 0; i < j; i++) {
					temp = args[0][i];
					objGet[temp] = objHash[temp];
				}
				return objGet;
			}
			// 3、键+值设置
			// $.hash("a","1");
			else if (argL == 2 && _isStrOrNum(args[0]) && _isStrOrNum(args[1])) {
				objHash = _parse(strHash);
				objSet[args[0]] = args[1];
				return _set(objHash, objSet);
			}
			// 3、键+值+类型
			// $.hash("a","1","?");
			else if (argL == 3 && _isStrOrNum(args[0]) && _isStrOrNum(args[1]) && $.type(args[2]) == "string") {
				objHash = _parse(strHash);
				objSet[args[0]] = args[1];
				defaults.hashType = args[2];
				return _set(objHash,objSet);
			}
			// 3、键值对
			// $.hash({m:1,n:2});
			else if (argL == 1 && $.type(args[0]) == "object") {
				objHash = _parse(strHash);
				return _set(objHash, args[0]);
			}
			// 3、键值对+类型
			// $.hash({m:1,n:2},"?");
			else if (argL == 2 && $.type(args[0]) == "object" && $.type(args[1]) == "string") {
				objHash = _parse(strHash);
				defaults.hashType = args[1];
				return _set(objHash, args[0]);
			}
			// 4.1、键+null
			// $.hash("a",null);
			else if (argL == 2 && _isStrOrNum(args[0]) && args[1] === null) {
				objHash = _parse(strHash);
				return _remove(objHash, [args[0]]);
			}
			// 4.2、数组+null
			// $.hash(["a","b"],null);
			else if (argL == 2 && $.isArray(args[0]) && args[1] === null) {
				objHash = _parse(strHash);
				return _remove(objHash, args[0]);
			}
			// 5、清空hash
			// $.hash(null);
			else if (argL == 1 && args[0] === null) {
				window.location.hash = "";
				return "";
			}
			// 6.1、单个监听
			// $.hash("listen","a",function(){});
			else if (argL == 3 && args[0] === "listen" && _isStrOrNum(args[1]) && $.isFunction(args[2])) {
				objHash = _parse(strHash);
				_listen(objHash, "and", [args[1]], args[2]);
			}
			// 6.2、多个并监听
			// $.hash("listenAnd",["a","b"],function(){});
			else if (argL == 3 && args[0] === "listenAnd" && $.isArray(args[1]) && $.isFunction(args[2])) {
				objHash = _parse(strHash);
				_listen(objHash, "and", args[1], args[2]);
			}
			// 6.3、多个或监听
			// $.hash("listenOr",["a","b"],function(){});
			else if (argL == 3 && args[0] === "listenOr" && $.isArray(args[1]) && $.isFunction(args[2])) {
				objHash = _parse(strHash);
				_listen(objHash, "or", args[1], args[2]);
			}
		}
	});


	$.hash.defaults=defaults;


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
	 * 判断两个对象是否全不等
	 * @param  {Object} 对象1
	 * @param  {Object} 对象2
	 * @return {Boolean} 如果全不等，返回true，否则false
	 * @version 1.0
	 * 2013年9月23日23:54:09
	 */

	function _isObjAllDifferent(obj1, obj2) {
		for (var i in obj1) {
			if (obj1[i] == obj2[i]) return false;
		}
		return true;
	}



	/**
	 * 判断两个对象是否有不等
	 * @param  {Object} 对象1
	 * @param  {Object} 对象2
	 * @return {Boolean} 如果有不等，返回true，否则false
	 * @version 1.0
	 * 2013年9月23日23:54:09
	 */

	function _isObjHasDifferent(obj1, obj2) {
		for (var i in obj1) {
			if (obj1[i] != obj2[i]) return true;
		}
		return false;
	}



	/**
	 * 解析 hash 部分对象
	 * @param {String} hash 全值
	 * @return {Object} 解析之后的对象
	 * @version 1.0
	 * 2013年9月23日10:52:08
	 */

	function _parse(strHash) {
		var
		objHash = {},
			// hashType有 path(!) 和 query(?) 两种
			hashType = "!";

		// 删除所有#
		strHash = strHash.replace(regHashPrefix, "");

		if (strHash === "") return objHash;

		// 取第一个字符
		hashType = strHash.charAt(0);

		// 如果不是 path 也不是 query 则默认为 空
		if (!regHashType.test(hashType)) hashType = "";

		// 删除前置的 ! 和 ?
		strHash = strHash.replace(regHashType, "");

		// 删除前后的/ 和 &
		strHash = strHash.replace(regHashPathQuery, "");

		switch (hashType) {
		case "!":
			objHash = _parsePath(strHash);
			defaults.hashType = "!";
			break;
		case "?":
			objHash = _parseSearch(strHash);
			defaults.hashType = "?";
			break;
		default:
			objHash[strHash] = "";
			defaults.hashType = "!";
		}
		return objHash;
	}


	/**
	 * 解析 hashPath 成 Object
	 * @param  {String} hash有效值
	 * @return {Object} 对象
	 * @version 1.0
	 * 2013年9月23日13:30:43
	 */

	function _parsePath(strHash) {
		var arrHash = strHash.split("/"),
			objHash = {},
			arrKey = [],
			arrVal = [],
			// 是否为奇数
			isOdd = false,
			i = 0,
			j = arrHash.length,
			temp;

		// 按奇偶分开
		for (; i < j; i++) {
			temp = $.trim(arrHash[i]);
			// 合法字符 && 不为空
			if (_isStrOrNum(temp) && temp !== "") {
				isOdd ?
					arrVal.push(temp) :
					arrKey.push(temp);
				isOdd = !isOdd;
			}
		}

		// 重新组织
		for (i = 0, j = arrKey.length; i < j; i++) {
			objHash[arrKey[i]] = arrVal[i];
		}

		return objHash;
	}



	/**
	 * 解析 hashSearch 成 Object
	 * @param  {String} hash有效值
	 * @return {Object} 对象
	 * @version 1.0
	 * 2013年9月23日13:31:28
	 */

	function _parseSearch(strHash) {
		var arrHash = strHash.split("&"),
			objHash = {}, i = 0,
			j = arrHash.length,
			tempArr, tempKey, tempVal;

		for (; i < j; i++) {
			tempArr = arrHash[i].split("=");
			tempKey = _decode(tempArr[0]);
			tempVal = tempArr[1] === undefined ? "" : _decode(tempArr[1]);
			if (tempKey !== "" && tempKey !== undefined) {
				objHash[tempKey] = tempVal;
			}
		}

		return objHash;
	}



	/**
	 * 解析对象为 path 类型
	 * @param {Object} 解析之后的对象
	 * @return {String}
	 */

	function _stringifyPath(objHash) {
		var i, arrHash = [];
		for (i in objHash) {
			arrHash.push(_encode(i) + "/" + _encode(objHash[i]));
		}
		return "!" + arrHash.join("/");
	}



	/**
	 * 解析对象为 path 类型
	 * @param {Object} 解析之后的对象
	 * @return {String}
	 */

	function _stringifyQuery(objHash) {
		var i, arrHash = [];
		for (i in objHash) {
			arrHash.push(_encode(i) + "=" + _encode(objHash[i]));
		}
		return "?" + arrHash.join("&");
	}



	/**
	 * 设置 hash 部分对象
	 * @param {Object} 需要设置的对象1
	 * @param {Object} 需要设置的对象2
	 * @return {String} 设置后的 hash string
	 * @version 1.1
	 * 2013年9月23日15:11:37
	 * 2013年9月25日9:26:51
	 */

	function _set(objHash, objSet) {
		for (var i in objSet) {
			if (_isStrOrNum(i) && _isStrOrNum(objSet[i])) {
				objHash[i] = objSet[i];
			}
		};

		switch (defaults.hashType) {
		case "!":
		default:
			strHash = _stringifyPath(objHash);
			break;
		case "?":
			strHash = _stringifyQuery(objHash);
			break;
		}
		window.location.hash = strHash;
		return strHash;
	}



	/**
	 * 删除hash部分对象
	 * @param  {Object} 当前hash对象
	 * @param  {Array} 要删除的键数组
	 * @return {String} 删除后的 hash string
	 * @version 1.0
	 * 2013年9月25日9:27:18
	 */

	function _remove(objHash, arrRemove) {
		var i = 0,
			j = arrRemove.length;
		for (; i < j; i++) {
			if (_isStrOrNum(arrRemove[i])) {
				delete(objHash[arrRemove[i]]);
			}
		}

		switch (defaults.hashType) {
		case "!":
		default:
			strHash = _stringifyPath(objHash);
			break;
		case "?":
			strHash = _stringifyQuery(objHash);
			break;
		}
		window.location.hash = strHash;
		return strHash;
	}



	/**
	 * 监听hashchange
	 * @param  {Object} 上一次的解析对象
	 * @param  {String} 监听类型：and/or
	 * @param  {String} 监听的键
	 * @param  {Function} 监听回调
	 * @return {undefined}
	 * @version 1.0
	 * 2013年9月24日0:09:12
	 */

	function _listen(objLast, type, key, fn) {
		var objEvent = {
			// 监听类型
			type: type,
			// 监听的键[数组]
			key: key,
			// 监听回调
			fn: fn
		},
			// 原始函数
			originalFn;
		// 入栈监听队列
		eventQueue.push(objEvent);

		originalFn = function () {
			var
			strHash = window.location.hash;
			objNow = _parse(strHash),
			objOld = {},
			objNew = {},
			i = 0, j = 0, m = 0, n = 0,
			objEvent = {},
			key = [];

			// 如果未存储上一次解析对象
			if ($.isEmptyObject(lastParseObject)) {
				lastParseObject = objLast;
			}
			// 取值
			objLast = lastParseObject;
			// 赋值
			lastParseObject = objNow;

			// 遍历监听队列，判断符合的监听对象
			for (i = 0, j = eventQueue.length; i < j; i++) {
				objEvent = eventQueue[i];
				key = objEvent.key;
				fn = objEvent.fn;
				objOld = {};
				objNew = {};

				// 生成需要判断的两个对象
				for (m = 0, n = key.length; m < n; m++) {
					objOld[key[m]] = objLast[key[m]];
					objNew[key[m]] = objNow[key[m]];
				}

				if (objEvent.type == "and") {
					// 两个对象全不等
					if (_isObjAllDifferent(objOld, objNew)) {
						fn(objLast, objNow);
					}
				} else {
					// 两个对象有不等
					if (_isObjHasDifferent(objOld, objNew)) {
						fn(objLast, objNow);
					}
				}
			}
		}

		if (!hasBindListen) {
			hasBindListen = 1;
			window.addEventListener("hashchange", originalFn, 0);
		}
	}

})(jQuery);