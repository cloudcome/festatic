/*!
 * 云淡然的yQuery
 * @author 云淡然 http://qianduanblog.com
 * @version 1.5
 */

/**
 * v1.0 2013年6月26日23:45:11
 * v1.1 2013年7月10日20:39:29
 * v1.2 2013年8月24日14:22:02
 * v1.3 2013年9月19日17:50:53
 * v1.4 2013年9月22日10:05:04
 * v1.5 2013年12月2日16:10:40
 */

/**
 * v1.5 重写
 * 更加规范的向HTML5靠拢
 * 使用querySelectorAll来获取DOM元素
 * 使用insertAdjacent...来操作DOM元素
 */


(function (win, undefined) {
	var doc = win.document,
		normalEventArr = "abort beforecopy beforecut beforepaste beforeunload blur change click contextmenu copy cut dblclick drag dragend dragenter dragleave dragover dragstart drop error focus hashchange input invalid keydown keypress keyup load message mousedown mouseenter mouseleave mousemove mouseout mouseover mousewheel offline online paste popstate reset resize scroll search select selectstart storage submit unload fullscreen fullscreenerror".split(" "),
		regTag = /<.*?>/;


	// 构造函数

	function yQuery(selector, context) {
		// 实例化init
		return new yQuery.prototype.init(selector, context);
	}


	// 全局化
	win.$ = yQuery;



	$.fn = yQuery.prototype = {
		constructor: $,
		init: function (selector, context) {
			var type = _type(selector),
				nodes = [];
			context = context || doc;
			if (type == "string") {
				nodes = regTag.test(selector) ? _createElement(selector) : context.querySelectorAll(selector);
			} else if (type == "element") {
				nodes = selector;
			} else if (type == "function") {
				//
			} else if (_isYquery(selector)) {
				return selector;
			}
			return _toLikeArray.call(this, nodes);
		},
		each: function (callback) {
			var i = 0,
				elem;
			for (; i < this.length; i++) {
				elem = this[i];
				callback.call(elem, i, elem);
			}
		},
		append: function (any) {
			this.each(function (index) {
				_insert(this, "beforeend", any, index);
			});
			return this;
		},
		prepend: function (any) {
			this.each(function (index) {
				_insert(this, "afterbegin", any, index);
			});
			return this;
		},
		before: function (any) {
			this.each(function (index) {
				_insert(this, "beforebegin", any, index);
			});
			return this;
		},
		after: function (any) {
			this.each(function (index) {
				_insert(this, "afterend", any, index);
			});
			return this;
		},
	};


	// 赋值init的原型链
	$.prototype.init.prototype = $.prototype;

	normalEventArr.forEach(function (ev) {
		$.fn[ev] = function (fn) {
			this.each(function () {
				_listen(this, ev, fn);
			});
		}
	});



	_each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after"
	}, function (key, val) {
		$.fn[key] = function (selector) {
			this.each(function () {
				$(selector)[val](this);
			});
			return this;
		}
	});



	["add", "remove", "has"].forEach(function (value, index) {
		$.fn[value + "Class"] = function (classString) {
			if (index == 2) {
				return _class(this[0], classString, index);
			} else {
				this.each(function () {
					_class(this, classString, index);
				});
				return this;
			}
		}
	});



	/**
	 * 方法扩展 和 合并多个对象
	 * @version 1.1
	 * @return 合并后的对象
	 * 2013年6月27日16:11:23
	 * 2013年12月2日16:44:51
	 */
	$.extend = function () {
		var A = arguments,
			A0 = A[0],
			i = 1,
			j = A.length,
			k;

		if (j == 1) {
			for (var i in A0) {
				yQuery[i] = A0[i];
			}
		} else {
			// 循环参数，从第1个开始（起始为0）
			for (; i < j; i++) {
				// 循环第i个对象
				for (k in A[i]) {
					A0[k] = A[i][k];
				}
			}
			return A0;
		}
	};


	// is方法
	["Array", "Boolean", "Element", "Function", "Infinite", "NaN", "Null", "Number", "Object", "RegExp", "String", "Undefined"].forEach(function (t) {
		$["is" + t] = function (any) {
			return _type(any) == t.toLowerCase();
		}
	});



	// 扩展
	$.extend({
		type: _type,
		each: _each,
		isPlainString: function (any) {
			return $.isString(any) || $.isNumber(any);
		}
	});


	// 私有方法



	/**
	 * 判断数据类型
	 * @link http://javascript.ruanyifeng.com/stdlib/object.html#toc3
	 * @param  {*} Anything
	 * @return {String} 数据类型
	 * 包括：array/boolean/element/function/infinite/nan/
	 *       null/number/object/regexp/string/undefined
	 * @version 1.3
	 * 2013年6月28日12:42:11
	 * 2013年7月1日18:08:02
	 * 2013年7月24日23:30:01
	 * 2013年12月3日9:45:13
	 */

	function _type(any) {
		var ret = Object.prototype.toString.call(any).match(/\s(.*?)\]/i)[1].toLowerCase();
		return /element/.test(ret) ? "element" : ret;
	}


	function _isYquery(object) {
		return _type(object) == "object" && object.length !== undefined;
	}


	/**
	 * 把NodeList转换为类数组
	 * @link http://haiyupeter.iteye.com/blog/1513403
	 * @param  {Object} NodeList
	 * @return {Array} this
	 * @version 1.2
	 * 2013年6月27日14:04:37
	 * 2013年6月28日9:40:48
	 * 2013年12月3日10:31:02
	 */

	function _toLikeArray(object) {
		if (object.length === undefined) {
			this[0] = object;
			this.length = 1;
		} else {
			for (var i = 0; i < object.length; i++) {
				this[i] = object[i];
			}
			this.length = object.length;
		}
		this.splice = [].splice;
		return this;
	}



	/**
	 * each 循环遍历
	 * @version 1.1
	 * @date 2013年6月27日14:04:37
	 * @date 2013年6月28日9:42:17
	 * @param  {object}   obj 要遍历的对象
	 * @param  {function} callback 遍历对象的每个回调
	 * @return {undefined}
	 */

	function _each(obj, callback) {
		var value,
			i = 0,
			length = obj.length;
		if (_type(obj) == "array") {
			for (; i < length; i++) {
				value = callback.call(obj[i], i, obj[i]);
				if (value === false) {
					break;
				}
			}
		} else {
			for (i in obj) {
				value = callback.call(obj[i], i, obj[i]);
				if (value === false) {
					break;
				}
			}
		}
		return obj;
	}



	/**
	 * 在父级元素上操作DOM
	 * @param  {Object} 父级元素
	 * @param  {String} 位置: beforebegin/afterbegin/beforeend/afterend
	 * @param  {*} 任何：string/text/object
	 * @param  {Number} 序号，如果大于0则复制节点
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年12月2日17:08:26
	 */

	function _insert(parent, position, any, index) {
		// 字符串
		if ($.isString(any)) {
			if (regTag.test(any)) {
				parent.insertAdjacentHTML(position, any);
			} else {
				parent.insertAdjacentText(position, any);
			}
		}
		// 数字
		else if ($.isNumber(any)) {
			parent.insertAdjacentText(position, any);
		}
		// 元素
		else if ($.isElement(any)) {
			parent.insertAdjacentElement(position, index > 0 ? any.cloneNode(true) : any);
		}
		// yQuery
		else if (_isYquery(any)) {
			any.each(function () {
				_insert(parent, position, this);
			});
		}
	}


	/**
	 * 标签字符串换换为Dom节点
	 * @param  {String} dom字符串
	 * @return {Object} dom节点
	 * @version  1.1
	 * 2013年6月28日12:40:20
	 * 2013年7月1日18:52:12
	 */

	function _createElement(string) {
		var tempWrap = doc.createElement("div");
		tempWrap.innerHTML = string;
		return tempWrap.children;
	}



	/**
	 * 操作Class
	 * @param {Object} DOM对象
	 * @param {String} 字符串，多个class以逗号分开
	 * @param {Number} 操作类型：0=add，1=remove，2=contains
	 * @return {Undefined} undefined
	 * @version 1.0
	 * 2013年12月17日11:37:47
	 */

	function _class(dom, classString, index) {
		var dcl = dom.classList,
			ret;
		(classString || "").trim().split(/\s+/).forEach(function (v) {
				switch (index) {
				case 0:
					v !== "" && dcl.add(v);
					break;
				case 1:
					v !== "" ? dcl.remove(v) : dom.className = "";
					break;
				case 2:
					return ret = v !== "" && dcl.contains(v);
				default:
					break;
				}
			});
		return ret;
	}



	/**
	 * 事件绑定
	 * @param  {Element}  DOM元素
	 * @param  {String}   事件类型
	 * @param  {Function} 事件回调
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年12月3日10:00:41
	 */

	function _listen(dom, event, fn) {
		dom.addEventListener(event, fn, 0);
	}





})(this);
