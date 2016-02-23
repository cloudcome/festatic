/*!
 * 云淡然的yQuery
 * @author ydr.me
 * @version 1.6
 */

/**
 * v1.0 2013年6月26日23:45:11
 * v1.1 2013年7月10日20:39:29
 * v1.2 2013年8月24日14:22:02
 * v1.3 2013年9月19日17:50:53
 * v1.4 2013年9月22日10:05:04
 * v1.5 2013年12月2日16:10:40
 * v1.6 2013年12月30日0:02:36
 */

/**
 * v1.5
 * 重写
 * 更加规范的向HTML5靠拢
 * 使用querySelectorAll来获取DOM元素
 * 使用insertAdjacent...来操作DOM元素
 * 使用classList来操作class
 *
 * v1.6
 * 使用XMLHttpRequest来操作ajax，适合发布任何data数据（包括字符串、二进制以及文件）
 * 使用FormData传输数据会自动替换为POST请求
 * DOM匹配以及操作DOM的attribute和property
 * 获取各种client/offset/scroll/width/height/inner/outer距离
 * 获取和操作DOM的css/style
 * 事件委托与事件触发，事件委托无法触发！？
 *
 */


(function(win, undefined) {
	var doc = win.document,
		// html对象
		htmlElem = doc.documentElement,
		browserPrefix = ["", "webkit", "moz", "ms", "o", "khtml"],
		normalEventArr = "abort beforecopy beforecut beforepaste beforeunload blur change click contextmenu copy cut dblclick drag dragend dragenter dragleave dragover dragstart drop error focus hashchange input invalid keydown keypress keyup load message mousedown mouseenter mouseleave mousemove mouseout mouseover mousewheel offline online paste popstate reset resize scroll search select selectstart storage submit unload fullscreen fullscreenerror".split(" "),
		booleanPropArr = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped".split("|"),
		// 文档准备完毕之后运行的事件队列
		readyFnQueue = [],
		// 匹配DOM的选择器方法
		matchesSelector,
		regTag = /<.*?>/,
		emptyFn = function() {},
		defaults = {
			ajax: {
				url: "",
				header: null,
				data: null,
				type: "get",
				charset: "utf-8",
				username: null,
				password: null,
				dataType: "json",
				timeout: 0,
				isNoCache: true,
				isUpload: false,
				onsuccess: emptyFn,
				onerror: emptyFn,
				oncomplete: emptyFn,
				onabort: emptyFn,
				ontimeout: emptyFn,
				// 仅在上传文件时有效
				onprogress: emptyFn
			},
			getScript: {
				url: "",
				onsuccess: emptyFn,
				onerror: emptyFn
			},
			crossDomain: {
				url: "",
				type: "jsonp",
				callback: "yquery_" + Date.now(),
				onsuccess: emptyFn,
				onerror: emptyFn
			}
		};



	// 构造函数

	function yQuery(selector, context) {
		// 实例化init
		return new yQuery.prototype.init(selector, context);
	}


	// 全局化
	win.$ = yQuery;
	$.isReady = false;



	$.fn = yQuery.prototype = {
		constructor: $,
		/**
		 * 初始化
		 * @param  {String/Function/Element}
		 * @param  {Element} 父级上下文
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:41:59
		 */
		init: function(selector, context) {
			var nodes = [],
				type=_type(selector);

			context=context||doc;

			if (type == "string") {
				nodes = regTag.test(selector) ? _parseElement(selector) : context.querySelectorAll(selector);
			} else if (type == "element" || type == "array" || type == "nodelist") {
				nodes = selector;
			} else if (selector == win || selector == doc) {
				nodes = selector;
				this.length = 1;
			} else if (type == "function") {
				$.isReady ? selector() : readyFnQueue.push(selector);
				return $(doc);
			} else if (_isYquery(selector)) {
				return selector;
			}
			return _toLikeArray.call(this, nodes);
		},
		/**
		 * 根据选择器在集合对象中查找子代对象集合
		 * @param  {String} 选择器
		 * @return new this
		 * @version 1.0
		 * 2013年12月29日23:30:20
		 */
		find:function(selector){
			var $ret=$();
			this.each(function(){
				$ret=$ret.add(this.querySelectorAll(selector));
			});
			return $ret;
		},
		/**
		 * 遍历this
		 * @param  {Function} 遍历回调
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:42:58
		 */
		each: function(callback) {
			var i = 0,
				elem;
			for (; i < this.length; i++) {
				callback.call(this[i], i, elem);
			}
			return this;
		},
		/**
		 * 返回指定索引值的元素
		 * @param  {Number} 元素索引值，倒数最后一个为-1
		 * @return new this
		 * @version 1.0
		 * 2013年12月29日3:33:45
		 */
		eq:function(index){
			var the=$.extend([],this);
			return $(the.splice(index,1))
		},
		/**
		 * 将元素后插到当前元素（集合）内
		 * @param  {String/Element/Function}
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:44:15
		 */
		append: function(any) {
			return this.each(function(index) {
				_insert(this, "beforeend", any, index);
			});
		},
		/**
		 * 将元素前插到当前元素（集合）内
		 * @param  {String/Element/Function}
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:44:15
		 */
		prepend: function(any) {
			return this.each(function(index) {
				_insert(this, "afterbegin", any, index);
			});
		},
		/**
		 * 将元素前插到当前元素（集合）前
		 * @param  {String/Element/Function}
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:44:15
		 */
		before: function(any) {
			return this.each(function(index) {
				_insert(this, "beforebegin", any, index);
			});
		},
		/**
		 * 将元素后插到当前元素（集合）后
		 * @param  {String/Element/Function}
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:44:15
		 */
		after: function(any) {
			return this.each(function(index) {
				_insert(this, "afterend", any, index);
			});
		},
		/**
		 * 移除当前元素（集合）
		 * @return null
		 * @version 1.0
		 * 2013年12月29日1:44:15
		 */
		remove: function() {
			this.each(function() {
				this.remove();
			});
			return null;
		},
		/**
		 * 清空当前元素（集合）内容
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:44:15
		 */
		empty: function() {
			return this.each(function() {
				this.innerHTML = "";
			});
		},
		/**
		 * 获取和设置当前元素（集合）的 innerHTML 内容
		 * @param  {String/Element/Function}
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:48:05
		 */
		html: function(any) {
			var elem = this[0];
			// get
			if (any === undefined) {
				return elem.innerHTML;
			}
			// set
			else {
				return this.each(function() {
					this.innerHTML = "";
					_insert(this, "afterbegin", any);
				});
			}
		},
		/**
		 * 获取和设置当前元素（集合）的 textContent 内容
		 * @param  {String/Function}
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:48:05
		 */
		text: function(string) {
			var elem = this[0];
			// get
			if (string === undefined) {
				return elem.textContent;
			}
			// set
			else {
				return this.each(function() {
					this.textContent = $.isFunction(string) ? string.call(this) : string;
				});
			}
		},
		// /**
		//  * 获取和设置当前元素（集合）的 outerHTML 内容
		//  * @param  {String/Function}
		//  * @return this
		//  * @version 1.0
		//  * 2013年12月29日1:48:05
		//  */
		// outerHtml: function(any) {
		// 	var elem = this[0],
		// 		parent;
		// 	// get
		// 	if (any === undefined) {
		// 		return elem.outerHTML;
		// 	}
		// 	// set
		// 	else {
		// 		return this.each(function() {
		// 			_insert(this, "afterend", any);
		// 			this.outerHTML = "";
		// 		});
		// 	}
		// },
		/**
		 * 获取匹配选择器距离当前元素（集合）的最近祖先元素，包括当前元素（集合）
		 * @param  {String} 选择器
		 * @return new this
		 * @version 1.0
		 * 2013年12月29日1:50:50
		 */
		closest: function(selector) {
			var elem = this[0];
			while (elem !== htmlElem && !_matchesSelector(elem, selector)) {
				elem = elem.parentElement;
			}
			return yQuery(elem);
		},
		/**
		 * 获取当前元素的前一个兄弟元素
		 * @return new this
		 * @version 1.0
		 * 2013年12月29日2:06:02
		 */
		prev: function() {
			return $(this[0].previousElementSibling);
		},
		/**
		 * 获取当前元素的后一个兄弟元素
		 * @return new this
		 * @version 1.0
		 * 2013年12月29日2:06:02
		 */
		next: function() {
			return $(this[0].nextElementSibling);
		},
		/**
		 * 获取当前元素的兄弟元素集合
		 * @return new this
		 * @version 1.0
		 * 2013年12月29日2:14:20
		 */
		siblings: function() {
			var elem = this[0],
				children = elem.parentElement.children,
				child, ret = [];
			for (var i in children) {
				child = children[i];
				if (child.nodeType == 1 && !child.isEqualNode(elem)) ret.push(child);
			}
			return $(ret);
		},
		/**
		 * 判断目标元素是否在当前元素集合中
		 * @param  {String/Element/Function}
		 * @return {Boolean}
		 * @version 1.0
		 * 2013年12月29日2:23:07
		 */
		has: function(any) {
			var ret = false,
				elem = $(any)[0];
			this.each(function() {
				if (this.isEqualNode(elem)) {
					ret = true;
					return false;
				}
			});
			return ret;
		},
		// /**
		//  * 判断目标元素（集合）是否为当前元素（集合）
		//  * @param  {String/Element/Function}
		//  * @return {Boolean}
		//  * @version 1.0
		//  * 2013年12月29日3:00:42
		//  */
		// isElem: function(any) {
		// 	var the = this,
		// 		targets = $($.isFunction(any) ? any.call(this) : any),
		// 		thisLength = this.length,
		// 		targetsLength = targets.length,
		// 		equalLength = 0;
		// 	if (thisLength != targetsLength) return false;
		// 	targets.each(function() {
		// 		if ($(the).has(this)) equalLength++;
		// 	});
		// 	return equalLength == thisLength;
		// },
		/**
		 * 判断当前元素中是否包含目标元素
		 * @param  {String/Element/Function}
		 * @return {Boolean}
		 * @version 1.0
		 * 2013年12月29日2:30:36
		 */
		contains: function(any) {
			var elem = this[0],
				targets = $($.isFunction(any) ? any.call(this) : any),
				ret = false;
			targets.each(function() {
				if (elem.contains(this)) {
					ret = true;
					return false;
				}
			});
			return ret;
		},
		/**
		 * 将目标元素加入到当前元素集合中，返回新的元素集合
		 * @param {String/Element/yquery}
		 * @return new this
		 * @version 1.0
		 * 2013年12月29日23:17:19
		 */
		add: function(any) {
			var the = this,
				type = _type(any),
				$elems = $(any),
				ret = $.extend([], this);

			$elems.each(function() {
				if (!$(the).has(this)) {
					ret.push(this);
				}
			});

			return $(ret);
		},
		/**
		 * 将目标元素从当前元素集合中移除，返回新的元素集合
		 * @param {String/Element/Function}
		 * @return new this
		 * @version 1.0
		 * 2013年12月29日23:17:19
		 */
		not: function(any) {
			var the = this,
				type = _type(any),
				$elems = $(any),
				ret = $.extend([], this);

			if (type == "function") {
				$elems =[];
				this.each(function(){
					if(any.call(this)==true){
						$elems .push(this);
					}
				});
				$elems =$($elems);
			}

			$elems.each(function() {
				if ($(the).has(this)) {
					_removeArray(this, ret);
				}
			});

			return $(ret);
		},
		/**
		 * 将目标元素从当前元素集合中取出，返回新的元素集合
		 * @param {String/Element/Function}
		 * @return new this
		 * @version 1.0
		 * 2013年12月29日23:17:19
		 */
		filter:function(any){
			var the = this,
				type = _type(any),
				$elems  = $(any),
				ret = [];

			if (type == "function") {
				$elems=[];
				this.each(function(){
					if(any.call(this)==true){
						$elems.push(this);
					}
				});
				$elems=$($elems);
			}

			$elems.each(function() {
				if ($(the).has(this)) {
					ret.push(this);
				}
			});

			return $(ret);
		},
		/**
		 * 获取和设置当前元素（集合）的一个或多个 attribute（属性）
		 * @param  {String/Object} 属性名称或属性JSON对象
		 * @param  {String} 属性值
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:52:47
		 */
		attr: function(key, val) {
			// set
			if (_type(key) == "object" || (_isPlainString(key) && arguments.length == 2)) {
				return this.each(function() {
					_attr(this, key, val);
				});
			}
			// get
			else if (_isPlainString(key)) {
				return _attr(this[0], key);
			}
		},
		/**
		 * 判断当前元素是否包含该属性值
		 * @param  {String}  属性值
		 * @return {Boolean}
		 * @version 1.0
		 * 2013年12月29日1:53:55
		 */
		hasAttr: function(key) {
			return this[0].hasAttribute(key);
		},
		/**
		 * 移除当前元素集合指定属性值
		 * @param  {String}  属性值
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:53:55
		 */
		removeAttr: function(key) {
			return this.each(function() {
				this.removeAttribute(key);
			});
		},
		/**
		 * 获取和设置当前元素（集合）的一个或多个 property（性质）
		 * @param  {String/Object} 性质名称或属性JSON对象
		 * @param  {String} 性质值
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:52:47
		 */
		prop: function(key, val) {
			// set
			if (_type(key) == "object" || (_isPlainString(key) && arguments.length == 2)) {
				return this.each(function() {
					_prop(this, key, val);
				});
			}
			// get
			else if (_isPlainString(key)) {
				return _prop(this[0], key);
			}
		},
		/**
		 * 判断当前元素是否包含该性质值
		 * @param  {String}  性质值
		 * @return {Boolean}
		 * @version 1.0
		 * 2013年12月29日1:53:55
		 */
		hasProp: function(key) {
			return this[0][key] !== undefined;
		},
		/**
		 * 移除当前元素集合指定性质值
		 * @param  {String}  性质值
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:53:55
		 */
		removeProp: function(key) {
			return this.each(function() {
				this[key] = undefined;
			});
		},
		/**
		 * 返回当前元素的 value 性质值
		 * @return {String} 性质值
		 * @version 1.0
		 * 2013年12月29日1:55:19
		 */
		val: function() {
			return this.prop("value");
		},
		/**
		 * 设置和获取css
		 * @param  {String} css键
		 * @param  {String} css值
		 * @return this
		 * @version 1.0
		 * 2013年12月29日1:55:41
		 */
		css: function(key, value) {
			var elem = this[0],
				cssJSON = {};
			// set
			if (value !== undefined || _type(key) == "object") {
				value !== undefined ? cssJSON[key] = value : cssJSON = key;
				return this.each(function() {
					elem = this;
					_each(cssJSON, function(k, v) {
						_css3(elem, k, v);
					});
				});
			}
			// get
			else {
				return _css3(elem, key);
			}
		},
		/**
		 * 返回元素相对于文档的绝对距离
		 * 不包括元素的边框和外边距
		 * @return {Object} 含 top/right/bottom/left 的对象
		 * @version 1.0
		 * 2013年12月27日10:02:30
		 */
		offset: function() {
			var elem = this[0],
				bounding = elem.getBoundingClientRect();

			return {
				top: bounding.top + win.scrollY,
				right: bounding.right + win.scrollX,
				bottom: bounding.bottom + win.scrollY,
				left: bounding.left + win.scrollX
			};
		},
		/**
		 * 返回元素相对于最近定位祖先元素的绝对距离
		 * 不包括元素的边框和外边距
		 * @return {Object} 含 top/right/bottom/left 的对象
		 * @version 1.0
		 * 2013年12月27日10:11:33
		 */
		position: function() {
			var elem = this[0],
				top = elem.offsetTop - parseFloat(_css3(elem, "marginTop")),
				left = elem.offsetLeft - parseFloat(_css3(elem, "marginLeft")),
				outerWidth = $(elem).outerWidth(),
				outerHeight = $(elem).outerHeight();
			return {
				top: top,
				right: left + outerWidth,
				bottom: top + outerHeight,
				left: left
			};
		},
		/**
		 * 事件委托
		 * @param  {String}   事件名称
		 * @param  {String}   选择器（可省略）
		 * @param  {Function} 事件函数
		 * @return this
		 * @version 1.0
		 * 2013年12月29日19:30:25
		 */
		on:function(event,selector,fn){
			return this.each(function(){
				var the=this;
				_listen(this,event,function(e){
					// 顶层
					if(fn===undefined){
						if(selector.call(this,e)===false){
							_eventFalse(e);
						}
					}else if($(selector,the).has(e.target)){
						if(fn.call(e.target,e)===false){
							_eventFalse(e);
						}
					}
				});
			});
		},
		/**
		 * 触发事件
		 * https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
		 * @param  {String} 事件名称
		 * @return this
		 * @version 1.0
		 * 2013年12月29日23:41:55
		 */
		trigger:function(eventString){
			return this.each(function(){
				var e=new Event(eventString);
				this.dispatchEvent(e);
			});
		}
	};



	// 赋值init的原型链
	$.prototype.init.prototype = $.prototype;

	normalEventArr.forEach(function(ev) {
		$.fn[ev] = function(fn) {
			this.each(function() {
				_listen(this, ev, fn);
			});
		}
	});



	_each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after"
	}, function(key, val) {
		$.fn[key] = function(selector) {
			this.each(function() {
				$(selector)[val](this);
			});
			return this;
		}
	});


	// 返回的是以内容盒模型为准的值
	["", "inner", "outer"].forEach(function(prefix, key1) {
		["width", "height"].forEach(function(suffix) {
			$.fn[key1 ? _toHumpString(prefix + "-" + suffix) : suffix] = function(value) {
				var elem = this[0];
				if (value === undefined) {
					return _widthOrHeight(elem, suffix)[key1];
				} else {
					return this.each(function() {
						this.style[suffix] = _widthOrHeight(elem, suffix, value)[key1] + "px";
					});
				}
			}
		});
	});



	["Top", "Left"].forEach(function(suffix) {
		var fnName = "scroll" + suffix;
		$.fn[fnName] = function(value) {
			var elem = this[0];

			// get
			if (value === undefined) {
				return elem == htmlElem || elem == doc.body ? (htmlElem[fnName] || doc.body[fnName]) : elem[fnName];
			}
			// set
			else {
				return this.each(function() {
					if (this == htmlElem || this == doc.body) {
						htmlElem[fnName] = value;
						doc.body[fnName] = value;
					} else {
						this[fnName] = value;
					}
				});
			}
		}
	});



	["add", "remove", "has"].forEach(function(value, index) {
		$.fn[value + "Class"] = function(classString) {
			if (index == 2) {
				return _class(this[0], classString, index);
			} else {
				this.each(function() {
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
	$.extend = function() {
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
	["Array", "Boolean", "Element", "Function", "Infinite", "NaN", "Null", "Number", "Object", "RegExp", "String", "Undefined"].forEach(function(t) {
		$["is" + t] = function(any) {
			return _type(any) == t.toLowerCase();
		}
	});



	// 扩展
	$.extend({
		type: _type,
		each: _each,
		inArray: _inArray,
		removeArray: _removeArray,
		toHumpString: _toHumpString,
		// 创建QueryString
		param: _httpBuildQuery,
		// ajax
		ajax: function(settings) {
			var xhr = new XMLHttpRequest(),
				options = $.extend({}, defaults.ajax, settings),
				hasCallback = 0,
				isGet = options.type == "get",
				isFormData = options.data.constructor == FormData;

			if (isFormData) {
				options.type = "post";
			} else {
				if (isGet) {
					options.url = _URLParm(options.url, options.data, options.isNoCache);
					options.data = null;
				} else {
					options.header = $.extend({}, options.header, {
						"Content-type": "application/x-www-form-urlencoded; charset=" + options.charset
					});
					options.data = _httpBuildQuery(options.data);
				}
			}

			// ajax结束
			xhr.onloadend = function() {
				options.oncomplete();
			}
			xhr.onload = function() {
				var response = xhr.responseText,
					status = xhr.status,
					state = xhr.readyState;
				if (!hasCallback && state == 4) {
					hasCallback = 1;
					if (status == 200) {
						if (options.dataType == "json") {
							try {
								response = JSON.parse(response);
							} catch (e) {
								response = null;
							}
						}
						options.onsuccess(response);
					} else {
						options.onerror();
					}
				}
			}
			xhr.onerror = function() {
				options.onerror();
			}
			xhr.onabort = function() {
				options.onabort();
			}
			xhr.ontimeout = function() {
				options.ontimeout();
			}
			if (options.isUpload)
				xhr.upload.onprogress = function(e) {
					if (e.lengthComputable) options.onprogress(e);
				}
			xhr.open(options.type, options.url, true, options.username, options.password);
			$.each(options.header, function(key, val) {
				xhr.setRequestHeader(key, val);
			});
			xhr.send(options.data);
			return xhr;
		},
		// 获取脚本
		getScript: function(settings) {
			var
			options = $.extend({}, defaults.getScript, settings),
				script = doc.createElement('script');
			script.src = _URLParm(options.url, null, true);
			script.onload = function() {
				options.onsuccess(script);
			}
			script.onerror = function() {
				options.onerror(script);
			}
			$("head").append(script);
		},
		// 跨域请求获得JSON数据
		crossDomain: function(settings) {
			var options = $.extend({}, defaults.crossDomain, settings),
				fnName = "yquery_" + Date.now(),
				data = {};

			if (_isVisibleObject(options.type) && _isVisibleObject(options.callback)) {
				data[options.type] = options.callback;
			}

			if (options.type != "var") {
				fnName = options.callback;
			}
			win[fnName] = function() {
				options.onsuccess(arguments[0]);
			}

			$.getScript({
				url: _URLParm(options.url, data),
				onsuccess: function(script) {
					if (options.type == "var") {
						win[fnName](win[options.callback]);
						win[options.callback] = null;
					}
					win[fnName] = null;
					script.remove();
				},
				onerror: function(script) {
					win[fnName] = null;
					script.remove();
					options.onerror();
				}
			});
		}
	});







	// 私有方法



	/**
	 * 转换字符串为驼峰形式
	 * 如-webkit-animate => webkitAnimate
	 * @param  {String}  带转换字符串
	 * @param  {Boolean} 是否大写首字母
	 * @return {String}  转换后的字符串
	 * @version 1.0
	 * 2013年12月27日10:39:19
	 */

	function _toHumpString(string, isUpperCaseFirstLetter) {
		string = string.replace(/-([a-z])/g, function(match, match1) {
			return match1.toUpperCase();
		});
		return isUpperCaseFirstLetter ? string.replace(/^[a-z]/, function(match) {
			return match.toUpperCase();
		}) : string;
	}






	/**
	 * 获取html5的对象
	 * @param  {Object}  父级对象
	 * @param  {String}  对象标准名称（参考w3c）
	 * @param  {Boolean} 是否返回支持浏览器的该对象
	 * @return {Object}  对象
	 * @version 1.0
	 * 2013年12月27日10:39:19
	 */

	function _html5(parentObj, fnName, isReturnObject) {
		var ret = null,
			valName = "";
		for (var i in browserPrefix) {
			valName = browserPrefix[i] + fnName.replace(/^[a-z]/, function(v) {
				return browserPrefix[i] ? v.toUpperCase() : v;
			});
			if ((ret = parentObj[valName]) !== undefined) break;
			else valName = "";
		}
		return isReturnObject ? ret : valName;
	}






	/**
	 * 获取设设置元素的css值
	 * @param  {Object} 元素
	 * @param  {String} css键
	 * @param  {String} css值
	 * @return {Number} css值
	 * @version 1.0
	 * 2013年12月27日10:37:27
	 */

	function _css3(elem, key, value) {
		var keyName = "",
			prefix = "",
			isGet = value === undefined,
			ret = undefined;

		for (var i in browserPrefix) {
			prefix = browserPrefix[i];
			keyName = _toHumpString(prefix ? prefix + "-" + key : key, prefix)
			// get
			if (isGet) {
				if ((ret = getComputedStyle(elem)[keyName]) !== undefined) break;
			}
			// set
			else {
				if (keyName in elem.style) {
					elem.style[keyName] = value;
					break;
				}
			}
		}
		return ret;
	}








	/**
	 * 获取和设置元素的宽度
	 * @param  {Object} 元素
	 * @param  {String} 宽度或高度
	 * @param  {Number} 值
	 * @return {Number} 返回获取值
	 * @version 1.0
	 * 2013年12月29日0:26:04
	 */

	function _widthOrHeight(elem, key, value) {
		var content = 0,
			boxSizing = "content-box",
			isGet = value === undefined,
			valName = _toHumpString(key, true),
			isVertical = /height/.test(key),
			padding = 0,
			border = 0,
			inner = 0,
			outer = 0;

		if (elem == win || elem == doc) {
			content = win["inner" + valName];
			inner = content;
			outer = win["outer" + valName];
		} else {
			padding = isVertical ? parseFloat(_css3(elem, "paddingTop")) + parseFloat(_css3(elem, "paddingBottom")) : parseFloat(_css3(elem, "paddingLeft")) + parseFloat(_css3(elem, "paddingRight"));
			border = isVertical ? parseFloat(_css3(elem, "borderTopWidth")) + parseFloat(_css3(elem, "borderBottomWidth")) : parseFloat(_css3(elem, "borderLeftWidth")) + parseFloat(_css3(elem, "borderRightWidth"));
			boxSizing = _css3(elem, "boxSizing");

			// get
			if (isGet) {
				outer = elem["offset" + valName];
				// 边框盒模型
				if (boxSizing == "border-box") {
					inner = outer - border;
					content = inner - padding;
				}
				// 边距盒模型
				else if (boxSizing == "padding-box") {
					inner = outer - border;
					content = inner - padding;
				}
				// 内容盒模型
				else {
					content = outer - padding - border;
					inner = outer - border;
				}
			}
			// set
			else {
				value = parseFloat(value);
				// 边框盒模型
				if (boxSizing == "border-box") {
					outer = value;
					content = value + padding + border;
					inner = value + padding;
				}
				// 边距盒模型
				else if (boxSizing == "padding-box") {
					inner = value;
					content = value + padding;
					outer = value - border;
				}
				// 内容盒模型
				else {
					content = value;
					inner = value - padding;
					outer = inner - border;
				}
			}
		}

		return [content, inner, outer];
	}


	/**
	 * 是否为可视的对象
	 * @param  {*}  任何
	 * @return {Boolean}
	 * @version 1.0
	 * 2013年12月27日10:42:16
	 */

	function _isVisibleObject(obj) {
		return obj !== null && obj !== undefined && obj !== "";
	}




	/**
	 * 是否为可输出的字符串
	 * 包括数字和字符串
	 * @param  {*}  任何
	 * @return {Boolean}
	 * @version 1.0
	 * 2013年12月27日10:42:16
	 */

	function _isPlainString(obj) {
		var type = _type(obj);
		return type == "string" || type == "number";
	}





	/**
	 * 判断数据类型
	 * @link http://javascript.ruanyifeng.com/stdlib/object.html#toc3
	 * @param  {*} Anything
	 * @return {String} 数据类型
	 * 包括：array/boolean/element/function/infinite/nan/
	 *	   null/number/object/regexp/string/undefined
	 * @version 1.4
	 * 2013年6月28日12:42:11
	 * 2013年7月1日18:08:02
	 * 2013年7月24日23:30:01
	 * 2013年12月3日9:45:13
	 * 2014年2月11日22:14:36
	 */

	function _type(any) {
		var ret = Object.prototype.toString.call(any).match(/\s(.*?)\]/i)[1].toLowerCase();
		if(ret=="number" && isNaN(any))return "nan";
		if(/element/.test(ret))return "element";
		return ret;
	}


	/**
	 * 判断是否为yquery对象
	 * @param  {*} 任何
	 * @return {Boolean}
	 * @version 1.0
	 * 2013年12月20日10:43:31
	 */

	function _isYquery(object) {
		return _type(object) == "object" && object.length !== undefined;
	}


	/**
	 * 判断数据是否在数组中
	 * @param  {*} 任何
	 * @param  {Array} 数组
	 * @return {Number}	不在返回-1，存在返回索引值
	 * @version 1.0
	 * 2013年12月27日10:43:31
	 */

	function _inArray(value, array) {
		for (var i in array) {
			if (array[i] === value) return i * 1;
		}
		return -1;
	}




	/**
	 * 移除数组中指定的数据
	 * @param  {*} 任何
	 * @param  {Array} 数组
	 * @return {Array} 新数组
	 * @version 1.0
	 * 2013年12月29日2:57:22
	 */

	function _removeArray(value, array) {
		for (var i in array) {
			if (array[i] === value) array.splice(i, 1);
		}
		return array;
	}






	function _mergeArray(array1){

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
		if (this.length == 1 || object.length === undefined) {
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
	 * @version 1.2
	 * @param  {object}   obj 要遍历的对象
	 * @param  {function} callback 遍历对象的每个回调
	 * @return {undefined}
	 * 2013年6月27日14:04:37
	 * 2013年6月28日9:42:17
	 * 2013年12月26日11:21:57
	 */

	function _each(obj, callback) {
		if (obj === null || obj === undefined) return obj;
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
	 * DOM匹配选择器
	 * @param  {Object} 元素
	 * @param  {String} 选择器
	 * @return {Boolean}
	 * @version 1.0
	 * 2013年12月26日15:55:48
	 */

	function _matchesSelector(element, selector) {
		return selector ? element[matchesSelector](selector) : element;
	}




	/**
	 * 构建URLparam部分
	 * @param  {[type]} url [description]
	 * @return {[type]}	 [description]
	 */

	function _URLParm(url, data, isNoCache) {
		var reg, begin = "_",
			hasFind = 0,
			time = Date.now();
		url = url.replace(/#.*$/, "");
		url += url.indexOf("?") == -1 ? "?" : "&";
		data = data || {};
		if (data !== undefined) {
			// 无缓存
			if (isNoCache) {
				reg = new RegExp("\\?" + begin + "=|&" + begin + "=");
				hasFind = reg.test(url);
				while (hasFind) {
					reg = new RegExp("\\?" + begin + "=|&" + begin + "=");
					if (reg.test(url)) {
						begin += "_";
					} else {
						hasFind = 0;
					}
				};
				data[begin] = time;
			}
			url += _httpBuildQuery(data);
		}
		return url;
	}






	/**
	 * 转换对象为 querystring 字符串
	 * @version  1.1
	 * @param  {Object} 对象
	 * @return {String} 字符串
	 * 2013年7月18日22:18:59
	 * 2013年12月26日13:23:41
	 */

	function _httpBuildQuery(object) {
		function _(key, val) {
			var t, i, v, a = [],
				deepKey,
				key = key || "";
			for (i in val) {
				v = val[i];
				t = $.type(v);
				deepKey = (key ? key + "[" : "") + i + (key ? "]" : "");
				if (_isPlainString(v)) {
					a.push(deepKey + "=" + v);
				} else if (t == "array" || t == "object") {
					a.push(_(deepKey, v));
				}
			}
			return a.join("&");
		}
		return _("", object);
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
		if ($.isFunction(any)) {
			any = any.call(parent);
		}

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
			any.each(function() {
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

	function _parseElement(string) {
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
		(classString || "").trim().split(/\s+/).forEach(function(v) {
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
	 * 操作DOM的attribute
	 * @param  {[type]} elem [description]
	 * @param  {[type]} key  [description]
	 * @param  {[type]} val  [description]
	 * @return {[type]}	  [description]
	 * @version 1.0
	 * 2013年12月26日16:39:58
	 */

	function _attr(elem, key, val) {
		var ret = false;
		if (_type(key) == "object") {
			for (var i in key) {
				elem.setAttribute(i, key[i]);
			}
		} else if (_isPlainString(key)) {
			_isPlainString(val) ? elem.setAttribute(key, val) : ret = elem.getAttribute(key);
		}
		return ret;
	}


	/**
	 * 操作DOM的property
	 * @param  {[type]} elem [description]
	 * @param  {[type]} key  [description]
	 * @param  {[type]} val  [description]
	 * @return {[type]}	  [description]
	 * @version 1.0
	 * 2013年12月26日16:39:58
	 */

	function _prop(elem, key, val) {
		var ret = false;
		if (_type(key) == "object") {
			for (var i in key) {
				elem[i] = key[i];
			}
		} else if (_isPlainString(key)) {
			arguments.length == 3 ? (elem[key] = _inArray(key, booleanPropArr) == -1 ? val : String(Boolean(val))) : (ret = _inArray(key, booleanPropArr) == -1 ? elem[key] : Boolean(elem[key]));
		}
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
	_listen(doc, "DOMContentLoaded", function() {
		$.isReady = true;
		matchesSelector = _html5(doc.body, "matchesSelector");
		readyFnQueue.forEach(function(fn) {
			fn();
		});
	});




	/**
	 * 阻止事件传递
	 * @param  {Object} 事件对象
	 * @return {Undefined}
	 * @version 1.0
	 * 2013年12月29日23:00:01
	 */
	function _eventFalse(e){
		e.preventDefault();
		e.stopPropagation();
	}


})(this);
