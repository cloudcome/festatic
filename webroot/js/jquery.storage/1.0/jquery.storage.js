/*!
 * jquery.storage.js
 * @author 云淡然 http://qianduanblog.com
 * @version 1.0
 * 2013年10月2日1:41:04
 */


/**
 *
 * 1. all
 * $.storage();
 * =>{a:1,b:2,...}
 *
 * 2. get
 * $.storage("a");
 * =>1
 * $.storage(["a","b"]);
 * =>{a:1,b:2}
 *
 * 3. set
 * $.storage("a","11");
 * =>{a:11}
 * $.storage({"a":"111","b":"222"});
 * =>{a:111,b:222}
 *
 * 4. remove
 * $.storage("a",null);
 * =>true
 *
 * 5. clear
 * $.storage(null);
 * =>true
 *
 * 6. listen
 * $.storage("a",function(){});
 * $.storage(["a","b"],function(){});
 *
 */



;
(function ($, undefined) {

	var _,
		defaults = {
			// 存储类型，默认为Local Storage，可选为 local 和 session
			type: "local"
		},
		lastStorage = {},
		listenQueue = [],
		isBindListen = 0;


	$.extend({
		storage: function () {
			var args = arguments,
				argL = args.length,
				objLs = {},
				temp,
				Storage = _storage(),
				i = 0,
				j = 0;

			// 1. all
			// $.storage();
			if (argL == 0) {
				j = Storage.length;
				for (; i < j; i++) {
					objLs[Storage.key(i)] = Storage.getItem(Storage.key(i));
				}
				return objLs;
			}
			// 2.1 single get
			// $.storage("a");
			else if (argL == 1 && _isStrOrNum(args[0])) {
				return Storage.getItem(args[0]);
			}
			// 2.2 multiple get
			// $.storage(["a","b"]);
			else if (argL == 1 && $.isArray(args[0])) {
				j = args[0].length;
				for (; i < j; i++) {
					temp = args[0][i];
					if (_isStrOrNum(temp)) {
						objLs[temp] = Storage.getItem(temp);
					}
				}
				return objLs;
			}
			// 3.1 single set
			// $.storage("a","1");
			else if (argL == 2 && _isStrOrNum(args[0]) && _isStrOrNum(args[1])) {
				Storage.setItem(args[0], args[1]);
				return true;
			}
			// 3.2 multiple set
			// $.storage({a:1,b:2});
			else if (argL == 1 && $.type(args[0]) == "object") {
				for (i in args[0]) {
					temp = args[0][i];
					if (_isStrOrNum(i) && _isStrOrNum(temp)) {
						Storage.setItem(i, temp);
					}
				}
				return true;
			}
			// 4.1 single remove
			// $.storage("a",null);
			else if (argL == 2 && _isStrOrNum(args[0]) && args[1] === null) {
				Storage.removeItem(args[0]);
				return true;
			}
			// 4.2 multiple remove
			// $.storage(["a","b"],null);
			else if (argL == 2 && $.isArray(args[0]) && args[1] === null) {
				j = args[0].length;
				for (; i < j; i++) {
					temp = args[0][i];
					if (_isStrOrNum(temp)) {
						Storage.removeItem(temp);
					}
				}
				return true;
			}
			// 5. clear
			// $.storage(null);
			else if (argL == 1 && args[0] === null) {
				Storage.clear();
				return true;
			}
			// 6.1 single listen
			// $.storage("a",function(){});
			else if (argL == 2 && _isStrOrNum(args[0]) && $.isFunction(args[1])) {
				_listen($.storage(), [args[0]], args[1]);
			}
			// 6.2 multiple listen
			// $.storage(["a","b"],function(){});
			else if (argL == 2 && $.isArray(args[0]) && $.isFunction(args[1])) {
				_listen($.storage(), args[0], args[1]);
			}
		}
	});

	$.storage.defaults = defaults;


	/**
	 * 获取存储对象
	 * @return {Object} window的存储对象
	 * @version 1.0
	 * 2013年9月26日10:41:30
	 */

	function _storage() {
		return defaults.type == "local" ? window.localStorage : window.sessionStorage;
	}


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
	 * storage 监听
	 * A. 因为storage的特殊性，不支持当前页面的的监听，只能监听其他页面的storage发生变化的事件
	 * B. 因为storage的特殊性，不支持并监听（参考：jquery.hash.js）
	 * @param  {String} 监听的键
	 * @param  {Function} 监听回调函数
	 * @return {undefined} 无返回
	 * @version 1.0
	 * 2013年9月26日11:14:10
	 */

	function _listen(storage, key, fn) {
		var objListen = {
			key: key,
			fn: fn
		}, originalFn,
			_lastStorage;

		// 监听事件入栈
		listenQueue.push(objListen);

		if ($.isEmptyObject(lastStorage)) {
			lastStorage = storage;
		}
		_lastStorage = lastStorage;

		originalFn = function (e) {
			var i = 0,
				j = listenQueue.length,
				temp;

			// 写入新的storage记录
			lastStorage = $.storage();

			// 每一次发生onstorage事件都进行遍历判断
			for (; i < j; i++) {
				temp = listenQueue[i];
				// 在监听的数组中
				if ($.inArray(e.key, temp.key) > -1) {
					temp.fn(e, _lastStorage, lastStorage);
				}
			}
		};

		if (!isBindListen) {
			isBindListen = 1;
			window.addEventListener("storage", originalFn, false);
		}
	}


})(jQuery);