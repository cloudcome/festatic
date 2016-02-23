/*!
 * 云淡然的yQuery
 * @author 云淡然 http://qianduanblog.com
 * @version 1.0
 * @time 2013年6月26日23:45:11
 */

/**
 * 注意：传入的参数内容，请遵循规范，
 * 为了代码体积，未严格过滤传入参数
 */

(function (win, undefined)
{
	win.dataStore = {};
	var
	// 库的版本
	version = "1.0",
		// 防止$符号被覆盖
		_$ = win.$,
		// document
		doc = win.document,
		// 缓存内容
		// dataStore = {},
		// 缓存自增索引
		dataIndex = 0,
		// 缓存dom属性
		dataAttr = _getRandom(),
		// 系统缓存前缀，防止缓存
		dataPrefix = _getRandom() + ".",
		// 正则id
		regId = /^#/,
		// 正则className
		regClass = /^\./,
		// 正则tagName.className
		regTagClass = /^([a-z][a-z1-6]*)\.([\w\-]*)$/i,
		// 正则<tagName
		regTagElem = /^<([^>\/]+)\s*\/?>/,
		// HTML5标签
		html5Tags = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
		// 正则html5标签
		regHtml5Tag = new RegExp("<(?:" + html5Tags + ")[\\s/>]", "i"),
		// 正则iframe标签
		regIframeTag = /^iframe$/i,
		// 正则JSON
		regJSON = /^[\],:{}\s]*$/,
		// 正则JSON空白
		regJSONspace = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
		// 正则JSON特殊字符
		regJSONtoken = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
		// 正则JSON括号
		regJSONbraces = /(?:^|:|,)(?:\s*\[)+/g,
		styleExtraType = {
			"inner": ["padding"],
			"outer": ["padding", "margin", "border"]
		},
		styleExtraName = {
			"Width": ["Left", "Right"],
			"Height": ["Top", "Bottom"]
		},
		// 事件数组
		eventArr = "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select submit keydown keypress keyup error contextmenu".split(" "),
		// 空函数
		emptyFn = function () {},
		// ajax默认参数
		ajaxDefaults = {
			url: location.href,
			charset: "utf-8",
			username: "",
			password: "",
			type: "get",
			data: "",
			dataType: "json",
			success: emptyFn,
			error: emptyFn
		},
		oEventTaget,
		// 对象类型检测
		class2type = {},
		toString = class2type.toString,
		ie = (function ()
		{
			var v = 3,
				div = _newElement('div'),
				a = div.all || [];
			while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->', a[0]);
			return v > 4 ? v : !v;
		}());


	function yQuery(vArg)
	{
		return new yQuery.fn.init(vArg);
	}



	/*================================[ 原型 ]=================================*/
	yQuery.fn = yQuery.prototype = {
		/**
		 * 初始化
		 * @version 1.2
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @date 2013年6月28日9:06:59
		 * @param  字符串、函数、对象
		 * @return 类数组
		 */
		init: function (vArg)
		{
			var nodes;
			switch (typeof vArg)
			{
				// 字符串
			case "string":
				// dom字符串
				if (regTagElem.test(vArg))
				{
					nodes = _stringToNode(vArg);
				}
				// 选择器字符串
				else
				{
					nodes = _getElements(doc, vArg);
				}
				break;
				// 函数
			case "function":
				_bind(win, "load", vArg);
				return;
				break;
				// 对象
			case "object":
				// window 对象
				if (vArg === win)
				{
					nodes = win;
				}
				// document 对象
				else if (vArg === doc)
				{
					nodes = doc;
				}
				// 为空或未定义
				else if (!vArg)
				{
					nodes = [];
				}
				// 空 或者 （不是数组 并且也没length属性）
				else if (!_isArray(vArg) && !("length" in vArg))
				{
					nodes = [];
					nodes.push(vArg);
				}
				// 其他，可能为yQuery对象或者nodelist对象
				else
				{
					nodes = vArg;
				}
				break;
			default:
				return;
				break;
			}


			_makeArray.call(this, nodes);
			return this;
		},
		/**
		 * 循环遍历this
		 * @version  1.0
		 * @date 2013年6月29日17:26:56
		 * @param  {Function} 遍历回调
		 * @return {Object} this
		 */
		each: function (fn)
		{
			var the = this;
			_each(the, function (index, item)
			{
				fn.call(the, index, item);
			});
			return this;
		},
		/**
		 * 选择集合的第几个
		 * @version 1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @param  索引序号
		 * @return yQuery
		 */
		eq: function (index)
		{
			// 元素长度
			var len = this.length;

			// 如果超过长度
			if (index + 1 > len) return this;

			// 重新包装node对象成类数组
			return yQuery.call(this, this[index]);
		},
		/**
		 * 返回元素的个数
		 * @return {元素个数} 如果存在返回1+，不存在返回0
		 */
		length: function ()
		{
			return this.length;
		},
		/**
		 * 查找子元素
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @param  选择器
		 * @return yQuery
		 */
		find: function (vArg)
		{
			var oResult = {},
				i = 0,
				j = this.length;

			// 遍历类数组元素
			for (; i < j; i++)
			{
				oResult = yQuery.extend(oResult, _getElements(this[i], vArg));
			}

			// 重新包装对象成类数组
			return yQuery(oResult);
		},
		/**
		 * 查找第一个匹配元素的所有兄弟元素
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @return yQuery
		 */
		siblings: function ()
		{
			// 所有兄弟包含自己的元素集合
			var aBrother = this[0].parentNode.children,
				i = 0,
				j = aBrother.length,
				aResult = [];

			// 循环遍历
			for (; i < j; i++)
			{
				if (this[0] !== aBrother[i])
				{
					aResult.push(aBrother[i]);
				}
			}

			// 重新包装数组成类数组
			return yQuery(aResult);
		},
		/**
		 * 返回元素最近的祖先元素
		 * @version  1.0
		 * @date 2013年6月28日13:42:51
		 * @param  {String} 选择器
		 * @return {Object} 该祖先元素的yQuery对象
		 */
		closest: function (sSelector)
		{
			var
			// 找到的node对象
			oFind,
				// 当前的node对象
				oCur = this[0],
				// 是否找到
				find = false,
				// 目标对象
				oTgt = yQuery(sSelector)[0];

			while (!find)
			{
				oCur = oCur.parentNode;
				if (oCur.nodeType != 1) continue;
				if (oCur.nodeType == 9) break;
				if (oCur === oTgt)
				{
					find = true;
				}
			}
			return find ? yQuery(oCur) : null;
		},
		/**
		 * 获得同级索引
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @param {string} 标签
		 * @return {number} 如果存在返回-1，其他返回0+
		 */
		index: function (sTagName)
		{
			sTagName = (sTagName || "").toUpperCase();

			// 所有兄弟包含自己的元素集合
			var aBrother = this[0].parentNode.children,
				i = 0,
				j = aBrother.length,
				the = this[0];

			// 循环遍历
			for (; i < j; i++)
			{
				if (sTagName)
				{
					if (aBrother[i] == the && aBrother[i].nodeName == sTagName)
						return i;
				}
				else
				{
					if (aBrother[i] == the)
						return i;
				}
			}
			return -1;
		},
		/**
		 * 事件绑定
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @param  {string} 要绑定的事件类型
		 * @param  {Function} 要绑定的事件
		 * @return undefined
		 */
		bind: function (type, fn)
		{
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				_bind(this[i], type, fn);
			}
			return this;
		},
		/**
		 * 事件取消绑定，仍需改进
		 * @version 1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @param  {string} 事件类型
		 * @return undefined
		 */
		unbind: function (sType)
		{
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				_unbind(this[i], sType);
			}
			return this;
		},
		/**
		 * 事件触发
		 * @version 1.0
		 * @date 2013年6月29日1:35:08
		 * @link http://stylechen.com/wp-content/uploads/demo/trigger/event.js
		 * @param {String} 事件类型
		 * @param {Array} 触发传递的参数
		 * @return this
		 */
		trigger: function (sType, aData)
		{
			aData = _isArray(aData) ? aData : [];
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				_eventTrigger(this[i], sType, aData);
			}
			return this;
		},
		/**
		 * 动态事件绑定
		 * @version  1.0
		 * @date 2013年6月29日14:29:14
		 * @link http://easyjs.org/docs/core/event/on.html
		 * @param  {String} 单个事件类型
		 * @param  {String} 1级选择器
		 * @param  {Function} 执行函数
		 * @return {Object} this
		 */
		on: function (sType, sSelector, fn)
		{
			if (arguments.length == 2)
			{
				fn = arguments[1];
				sSelector = "window";
			}
			var oTarget,
				i = 0,
				j = this.length,
				k,
				originalFn, key = dataPrefix + sType + "on" + sSelector,
				elem;

			for (i = 0; i < j; i++)
			{
				elem = this[i];
				originalFn = function (e)
				{
					e = _fixEvent(e);
					oTarget = yQuery(this).find(sSelector);
					k = oTarget.length

					for (i = 0; i < k; i++)
					{
						if (e.target == oTarget[i])
						{
							fn.call(oTarget[i]);
						}
					}
				}
				_bind(elem, sType, originalFn);
				// 保存动态事件绑定的函数指针
				data = _getData(elem, key) || _setData(elem, key, []);
				data.push(originalFn);
				_setData(elem, key, data);
			}

			return this;
		},
		/**
		 * 取消动态事件绑定
		 * @param  {String} 单个事件类型
		 * @param  {String} 1级选择器
		 * @return {Object} this
		 */
		off: function (sType, sSelector)
		{
			var i = 0,
				j = this.length,
				elem, key = dataPrefix + sType + "on" + sSelector,
				data,
				originalFn;
			for (; i < j; i++)
			{
				elem = this[i];
				// 获得每个函数指针
				data = _getData(elem, key);
				if (data && data.length > 0)
				{
					// 出栈第0个
					originalFn = data.shift();
					_setData(elem, key, data);
					_unbind(elem, sType, originalFn);
				}
			}
		},
		/**
		 * 读取 和 设置 style css
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:16:01
		 * @param  {String} 读取
		 * @param  {String+String} 设置
		 * @param  {Object} 设置
		 * @return style值 或者 yQuery
		 */
		css: function ()
		{
			var A = arguments,
				L = A.length,
				A0 = A[0],
				A1 = A[1],
				i = 0,
				j = this.length,
				json = {};

			if (L == 1 && typeof (A0) == "string")
			{
				return _getStyle(this[0], A0);
			}
			else
			{
				L == 1 ? A0 : json[A0] = A1;
				for (; i < j; i++)
				{
					_setStyle(this[i], A0);
				}
			}
			return this;
		},
		/**
		 * 读取 和 设置 attribute
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:17:01
		 * @param  string 或者 json对象
		 * @return 属性值 或 yQuery
		 */
		attr: function (vArg)
		{
			var i = 0,
				j = this.length;
			if (typeof vArg == "string")
			{
				return _getAttr(this[0], vArg);
			}
			else
			{
				for (; i < j; i++)
				{
					_setAttr(this[i], vArg);
				}
			}
			return this;
		},
		/**
		 * 读取 存储 data
		 * @param {String} 读取
		 * @param {Object} 存储
		 * @param {String+*} 存储
		 * @return {*}
		 */
		data: function ()
		{
			var A = arguments,
				L = A.length,
				A0 = A[0],
				A1 = A[1],
				i = 0,
				j = this.length,
				k,
				json = {};

			if (L == 1 && _type(A0) == "string")
			{
				return _getData(this[0], A0);
			}
			else
			{
				L == 1 ? json = A0 : json[A0] = A1;
				for (; i < j; i++)
				{
					for (k in json)
					{
						_setData(this[i], k, json[k]);
					}
				}
			}
			return this;
		},
		/**
		 * 是否包含该 className
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:17:01
		 * @param  {string} 单个class值
		 * @return {boolean} 如果包含则返回true，否则返回false
		 */
		hasClass: function (sClass)
		{
			return _hasClass(this[0], sClass);
		},
		/**
		 * 添加 className
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:17:01
		 * @param  {string} 单个 class 值
		 * @return yQuery
		 */
		addClass: function (sClass)
		{
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				_addClass(this[i], sClass);
			}
			return this;
		},
		/**
		 * 移除 className
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:17:01
		 * @param  {string} 单个 class 值
		 * @return yQuery
		 */
		removeClass: function (sClass)
		{
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				_removeClass(this[i], sClass);
			}
			return this;
		},
		/**
		 * 在父对象内部追加单个子对象
		 * @version 1.1
		 * @date 2013年6月26日14:54:23
		 * @date 2013年6月27日16:22:10
		 * @param  子对象
		 * @return 父对象的yQuery
		 */
		append: function (oChild)
		{
			var i = 0,
				j = this.length;
			oChild = yQuery(oChild)[0];

			for (; i < j; i++)
			{
				if (this[i].nodeType === 1)
				{
					this[i].appendChild(oChild);
				}
			}
			return this;
		},
		/**
		 * 在父对象内部前置单个子对象
		 * @version 1.1
		 * @date 2013年6月26日14:54:23
		 * @date 2013年6月27日16:22:10
		 * @param  子对象
		 * @return 父对象的yQuery
		 */
		prepend: function (oChild)
		{
			var i = 0,
				j = this.length;
			oChild = yQuery(oChild)[0];

			for (; i < j; i++)
			{
				if (this[i].nodeType === 1)
				{
					this[i].insertBefore(oChild, this[i].firstChild);
				}
			}
			return this;
		},
		/**
		 * 在目标对象前邻近添加单个对象
		 * @version  1.2
		 * @date 2013年6月26日15:01:02
		 * @date 2013年6月27日0:55:10
		 * @date 2013年6月27日16:29:43
		 * @param  添加对象
		 * @return 父对象的yQuery
		 */
		before: function (oChild)
		{
			var i = 0,
				j = this.length,
				oParent;
			oChild = yQuery(oChild)[0];

			for (; i < j; i++)
			{
				oParent = this[i].parentNode
				if (this[i].nodeType === 1 && oParent)
				{
					oParent.insertBefore(oChild, this[i]);
				}
			}
			return this;
		},
		/**
		 * 在目标对象后邻近添加单个对象
		 * @version  1.1
		 * @date 2013年6月26日15:01:12
		 * @date 2013年6月27日16:29:43
		 * @param  添加对象
		 * @return 父对象的yQuery
		 */
		after: function (oChild)
		{
			var i = 0,
				j = this.length,
				oParent;
			oChild = yQuery(oChild)[0];

			for (; i < j; i++)
			{
				if (this[i].nodeType !== 1) continue;
				oParent = this[i].parentNode;
				if (oParent && this[i] == oParent.lastChild)
				{
					oParent.appendChild(oChild);
				}
				else if (oParent)
				{
					oParent.insertBefore(oChild, this[i].nextSibling);
				}
			}
			return this;
		},
		/**
		 * 清空节点内容
		 * @version 1.0
		 * @date 2013年6月28日14:29:26
		 * @return this
		 */
		empty: function ()
		{
			for (var i = 0, elem;
			(elem = this[i]) != null; i++)
			{
				while (elem.firstChild)
				{
					elem.removeChild(elem.firstChild);
				}
			}
			return this;
		},
		/**
		 * 返回一个由原数组中的每个元素调用一个指定方法后的返回值组成的新数组
		 * @link https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Array/map
		 * @version 1.0
		 * @date 2013年6月28日14:54:50
		 * @param  {Function} 回调处理函数
		 * @return {Array} 数组
		 */
		map: function (fn)
		{
			var arr = [],
				the = this,
				i = 0,
				j = the.length;
			for (; i < j; i++)
			{
				arr.push(the[i]);
			}
			return _map(arr, function (elem, index)
			{
				return fn.call(elem, elem, index, the);
			});
		},
		/**
		 * 克隆对象
		 * @version 1.0
		 * @date 2013年6月28日14:31:09
		 * @return {Object} 克隆对象的yQuery对象
		 */
		clone: function ()
		{
			return this.map(function (elem, index)
			{
				return yQuery.support.html5Clone || _isXML(elem) || !regHtml5Tag.test("<" + elem.nodeName + ">") ? elem.cloneNode(true) : _stringToNode(elem.outerHTML);
			});
		},
		/**
		 * 移除文档节点
		 * @version  1.0
		 * @date 2013年6月28日16:53:28
		 * @return {Object} this
		 */
		remove: function ()
		{
			var i = 0,
				j = this.length,
				elem;
			for (; i < j; i++)
			{
				elem = this[i];
				if (elem.parentNode)
				{
					elem.parentNode.removeChild(elem);
				}
			}
		},
		/**
		 * 获取 或者 设置节点的innerHTML
		 * @version  1.0
		 * @date 2013年6月28日14:16:59
		 * @param  {String or Object} 字符串或者节点
		 * @return {undefined or this}
		 */
		html: function (vArg)
		{
			if (!arguments.length)
			{
				return this[0].innerHTML;
			}
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				this[i].innerHTML = yQuery(vArg)[0].outerHTML;
			}
			return this;
		},
		/**
		 * 获取 或者 设置节点的outerHTML
		 * 设置的时候相当于jQuery的replaceWith
		 * @version  1.0
		 * @date 2013年6月28日16:41:35
		 * @param {String or Object}
		 * @return {String or Object}
		 */
		outerHtml: function (vArg)
		{
			if (!arguments.length)
			{
				return this[0].outerHTML;
			}
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				this[i].outerHTML = yQuery(vArg)[0].outerHTML;
			}
			return this;
		},
		/**
		 * 读取 或者 设置 节点的纯文本
		 * @version  1.0
		 * @date 2013年6月30日0:02:36
		 * @param  {String} 纯文本
		 * @return {String or Object}
		 */
		text: function (text)
		{
			var i = 0,
				j = this.length,
				reslut = "";
			if (text !== undefined)
			{
				for (; i < j; i++)
				{
					this[i].innerText = text;
				}
				return this;
			}
			for (; i < j; i++)
			{
				reslut += this[i].innerText
			}
			return reslut;
		},
		/**
		 * 查找匹配元素内部所有的子节点（包括文本节点）
		 * 如果元素是一个iframe，则查找文档内容
		 * @version  1.0
		 * @date 2013年6月28日16:38:54
		 * @return {Object} 文档节点的yQuery对象
		 */
		contents: function ()
		{
			var elem = this[0];
			return yQuery(regIframeTag.test(elem.nodeName) ?
				elem.contentDocument || elem.contentWindow.document :
				elem.childNodes);
		},
		/**
		 * 获得元素相对document边缘的位移
		 * @version 1.0
		 * @date 2013年6月29日21:58:32
		 * @return {Object} 包含top、left属性
		 */
		offset: function ()
		{
			var elem = this[0],
				elemD, elmE, base = {};
			if (!elem) return;
			elemD = elem.ownerDocument,
			elemE = elemD.documentElement;
			base = {
				top: 0,
				left: 0
			};

			// 元素有 getBoundingClientRect 方法
			if ( !! elem.getBoundingClientRect)
			{
				base = elem.getBoundingClientRect();
			}

			return {
				top: base.top + (win.pageYOffset || elemE.scrollTop) - (elemE.clientTop || 0),
				left: base.left + (win.pageXOffset || elemE.scrollLeft) - (elemE.clientLeft || 0),
			};
		},
		/**
		 * 获得元素相对于最近定位元素的位移
		 * @version  1.0
		 * @date 2013年6月29日23:14:22
		 * @return {Object} 包含top、left属性
		 */
		position: function ()
		{
			var offsetParent, offset,
				parentOffset = {
					top: 0,
					left: 0
				},
				elem = this[0],
				find, oParent;

			// 固定元素是相对于document定位的
			if (_getStyle(elem, "position") === "fixed" && ie !== 6)
			{
				offset = elem.getBoundingClientRect();
			}
			else
			{
				// 获得相对定位元素，最大的是body
				offsetParent = elem.offsetParent;

				// 如果不支持offsetParent属性，则循环逐级寻找
				if (!offsetParent)
				{
					find = false;
					oParent = elem;
					while (!find)
					{
						if (oParent.nodeType === 9) break;
						if (oParent.nodeType !== 1) continue;
						if (_getStyle(oParent, "position") !== "static")
						{
							offsetParent = oParent;
							find = true;
						}
						oParent = oParent.parentNode;
					}
					if (!find) offsetParent = doc;
				}

				// 获得offset属性对象值
				offset = this.offset();

				if (!_nodeName(elem, "html"))
				{
					parentOffset = yQuery(offsetParent).offset();
				}

				parentOffset.top += _getStyle(offsetParent, "borderTopWidth", true);
				parentOffset.left += _getStyle(offsetParent, "borderLeftWidth", true);
			}

			return {
				top: offset.top - parentOffset.top - _getStyle(elem, "marginTop", true),
				left: offset.left - parentOffset.left - _getStyle(elem, "marginLeft", true)
			};
		}
	};


	// Give the init function the yQuery prototype for later instantiation
	// 参考于 jquery
	yQuery.fn.init.prototype = yQuery.fn;



	// 各种宽度、高度获取和设置
	_each(["inner", "", "outer"], function (i, type)
	{
		_each(["Width", "Height"], function (j, name)
		{
			var fnVal = type + name,
				name2 = name.toLowerCase(),
				docE,
				aStyle = [],
				i,
				j,
				reslut = 0,
				extra = 0,
				styleJSON = {};
			if (type == "") fnVal = fnVal.toLowerCase();
			yQuery.fn[fnVal] = function (number)
			{
				elem = this[0];
				// window
				if (elem === win)
				{
					return type ?
						win[type + name] :
						win.document.documentElement["client" + name];
				}
				// document
				else if (elem === doc)
				{
					docE = doc.documentElement;
					return !type ?
						doc[name.toLowerCase()] :
						Math.max(doc.body["scroll" + name], docE["scroll" + name], doc.body["offset" + name], docE["offset" + name], docE["client" + name]);
				}
				// normal node
				else
				{
					aStyle = [];
					reslut = 0;
					if (type)
					{
						for (i in styleExtraName[name])
						{
							for (j in styleExtraType[type])
							{
								aStyle.push(styleExtraType[type][j] + styleExtraName[name][i]);
							}
						}
					}


					if (number === undefined)
					{
						aStyle.push(name2);
					}


					for (i = 0, j = aStyle.length; i < j; i++)
					{
						reslut += _getStyle(elem, aStyle[i], true);
					}

					if (number !== undefined)
					{
						for (i = 0, j = this.length; i < j; i++)
						{
							styleJSON[name2] = Math.abs(parseFloat(number) - reslut) + "px";
							_setStyle(this[i], styleJSON);
						}
						return this;
					}
					else
					{
						return reslut;
					}
				}
			}
		});
	});



	// 原生事件绑定
	_each(eventArr, function (key, value)
	{
		yQuery.fn[value] = function (fn)
		{
			var the = this;
			this.bind(value, fn);
			return the;
		};
	});



	// 改良事件绑定
	_each(
	{
		"mouseover": "mouseenter",
		"mouseout": "mouseleave"
	}, function (key, value)
	{
		yQuery.fn[value] = function (fn)
		{
			this.bind(key, _eventConvert.call(this, fn));
			return this;
		};
	});



	/**
	 * 方法扩展 和 合并多个对象
	 * @version 1.0
	 * @date 2013年6月27日16:11:23
	 * @return 合并后的对象
	 */
	yQuery.extend = function (oJSON)
	{
		var A = arguments,
			j = A.length,
			A0 = A[0],
			i = 1,
			k;
		if (j == 1)
		{
			for (var i in A0)
				yQuery[i] = A0[i];
		}
		else
		{
			// 循环参数，从第1个开始（起始为0）
			for (; i < j; i++)
			{
				// 循环第i个对象
				for (k in A[i])
				{
					A0[k] = A[i][k];
				}
			}
			return A0;
		}
	};



	/*================================[ 扩展 ]=================================*/
	// 扩展
	yQuery.extend(
	{
		type: _type,
		isArray: _isArray,
		isFunction: _isFunction,
		map: _map,
		each: _each,
		parseJSON: _parseJSON,
		stringifyJSON: _stringifyJSON,
		parseXML: _parseXML,
		inArray: _inArray,
		support: _support,
		/**
		 * ajax请求并回调
		 * @param  {对象} options 接收以下参数
		 * @param url 请求的地址
		 * @param charset 请求内容的编码：utf-8
		 * @param type 请求的类型：post、get
		 * @param data 请求的数据：json格式或者字符串
		 * @param dataType 数据的类型：json、html、text、script、xml
		 * @param success 请求成功回调，参数为返回内容
		 * @param error 请求失败回调，参数为失败内容
		 * @return {undefined}
		 */
		ajax: function (options)
		{
			var options = yQuery.extend(
			{}, ajaxDefaults, options),
				headers = {},
				i,
				xhr,
				status,
				temp;

			if (!xhr)
			{
				options.error("浏览器不支持ajax", -1);
				return;
			}

			// 头信息
			headers["Content-type"] = "application/x-www-form-urlencoded; charset=" + options.charset;
			headers["X-Requested-With"] = "XMLHttpRequest";

			// 创建xhr对象
			xhr = _newXHR();


			options.url.replace(/#.*$/, "");
			options.type = (options.type).toLowerCase();
			if (options.type == "get")
			{
				temp = [];
				for (i in options.data)
				{
					temp.push(i + "=" + (options.data)[i]);
				}
				temp = temp.join("&");

				options.url += options.url.indexOf("?") == -1 ?
					"?" + temp :
					"&" + temp;

				options.data = null;
			}

			// 打开请求
			if (options.username)
			{
				xhr.open(options.type, options.url, true, options.username, options.password);
			}
			else
			{
				xhr.open(options.type, options.url, true);
			}

			// 重写mime
			if ( !! xhr.overrideMimeType)
			{
				xhr.overrideMimeType(_getXHRmime(options.dataType));
			}

			// 发送头信息
			try
			{
				for (i in headers)
				{
					xhr.setRequestHeader(i, headers[i]);
				}
			}
			catch (e)
			{}

			xhr.onreadystatechange = function ()
			{
				if (xhr.readyState === 4)
				{
					status = xhr.status;
					if (status >= 200 && status < 300 || status === 304)
					{
						if (options.success)
						{
							options.success(_parseResponseText(options.dataType, options.url, xhr.responseText));
							options.success = null;
						}
					}
					else
					{
						if (options.error)
						{
							options.error(xhr.responseText, xhr.status);
							options.error = null;
						}
					}
				}
			};

			// 发送
			xhr.send(options.data);
		}
	});



	// 全局$
	win.$ = yQuery;


	/*=============================[ 以下是私有函数 ]============================*/


	/**
	 * 根据mime缩写返回mime类型
	 * @version 1.0
	 * @date 2013年6月28日12:26:27
	 * @param  {string} dataType mime缩写
	 * @return {string} mime类型
	 */

	function _getXHRmime(sDataType)
	{
		var mime = "application/json";
		switch (sDataType)
		{
		case "script":
			mime = "text/javascript, application/javascript";
			break;
		case "xml":
			mime = "application/xml, text/xml";
			break;
		case "html":
			mime = "text/html";
			break;
		case "text":
			mime = "text/plain";
			break;
		}
		return mime;
	}


	/**
	 * 根据数据类型解析返回内容
	 * @version  1.0
	 * @date 2013年6月28日12:26:39
	 * @param  {string} 数据类型
	 * @param  {string} url
	 * @param  {string} 返回的数据
	 * @return {*} 根据数据类型返回不同的内容
	 */

	function _parseResponseText(sDataType, sUrl, sText)
	{
		var script;
		sDataType = _trim(sDataType);
		switch (sDataType)
		{
		case "script":
			script = _newElement("script");
			script.async = false;
			script.defer = false;
			script.src = sUrl;
			yQuery("head").append(script);
			break;
		case "xml":
			sText = _parseXML(sText);
			break;
		case "html":
			sText = yQuery(sText);
			break;
		case "text":
			break;
		case "json":
			sText = _parseJSON(sText);
			break;
		}
		return sText;
	}


	/**
	 * 去除字符串的开头和结尾的空格
	 * @version  1.0
	 * @date 2013年6月28日12:27:33
	 * @param  {String} 字符串
	 * @return {String} 字符串
	 */

	function _trim(string)
	{
		return !!String.prototype.trim ? string.trim() : string.toString().replace(/^\s*|\s*$/, "");
	}



	/**
	 * 解析字符串为JSON
	 * @version  1.0
	 * @date 2013年6月28日12:39:08
	 * @param  {String} 字符串
	 * @return {Object} json对象
	 */

	function _parseJSON(string)
	{
		if (typeof string !== "string" || !string)
		{
			return null;
		}

		string = _trim(string);

		if ( !! win.JSON && !! win.JSON.parse)
		{
			return win.JSON.parse(string);
		}

		if (regJSON.test(string.replace(regJSONspace, "@").replace(regJSONtoken, "]").replace(regJSONbraces, "")))
		{
			return (new Function("return " + string))();
		}
		return null;
	}



	/**
	 * JSON转换为字符串
	 * @version  1.0
	 * @date 2013年6月29日23:22:15
	 * @link https://github.com/orkungo/jquery-stringifyJSON/blob/master/jquery.stringifyjson.js
	 * @param  {Object} JSON对象
	 * @return {String} JSON字符串
	 */

	function _stringifyJSON(json)
	{
		if (!json) return;
		if ( !! JSON && !! JSON.stringify)
		{
			return JSON.stringify(json);
		}

		var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
			meta = {
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'"': '\\"',
				'\\': '\\\\'
			};

		return str("",
		{
			"": json
		});

		function quote(string)
		{
			return '"' + string.replace(escapable, function (a)
			{
				var c = meta[a];
				return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"';
		}

		function f(n)
		{
			return n < 10 ? "0" + n : n;
		}

		function str(key, holder)
		{
			var i, v, len, partial, value = holder[key],
				type = typeof value;

			if (value && typeof value === "object" && typeof value.toJSON === "function")
			{
				value = value.toJSON(key);
				type = typeof value;
			}

			switch (type)
			{
			case "string":
				return quote(value);
			case "number":
				return isFinite(value) ? String(value) : "null";
			case "boolean":
				return String(value);
			case "object":
				if (!value)
				{
					return "null";
				}

				switch (Object.prototype.toString.call(value))
				{
				case "[object Date]":
					return isFinite(value.valueOf()) ? '"' + value.getUTCFullYear() + "-" + f(value.getUTCMonth() + 1) + "-" + f(value.getUTCDate()) + "T" +
						f(value.getUTCHours()) + ":" + f(value.getUTCMinutes()) + ":" + f(value.getUTCSeconds()) + "Z" + '"' : "null";
				case "[object Array]":
					len = value.length;
					partial = [];
					for (i = 0; i < len; i++)
					{
						partial.push(str(i, value) || "null");
					}

					return "[" + partial.join(",") + "]";
				default:
					partial = [];
					for (i in value)
					{
						if (Object.prototype.hasOwnProperty.call(value, i))
						{
							v = str(i, value);
							if (v)
							{
								partial.push(quote(i) + ":" + v);
							}
						}
					}

					return "{" + partial.join(",") + "}";
				}
			}
		}
	}



	/**
	 * 解析字符串为XML
	 * @version  1.0
	 * @date 2013年6月28日12:39:56
	 * @param  {String} 字符串
	 * @return {Node Object} XML Node 对象
	 */

	function _parseXML(string)
	{
		if (typeof string !== "string" || !string)
		{
			return null;
		}
		var xml, tmp;
		try
		{
			if (win.DOMParser)
			{ // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString(string, "text/xml");
			}
			else
			{ // IE
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = "false";
				xml.loadXML(string);
			}
		}
		catch (e)
		{
			xml = undefined;
		}

		return xml;
	}



	/**
	 * 新建一个dom节点
	 * @version  1.0
	 * @date 2013年6月28日12:40:08
	 * @param  {string} sTag 标签名称
	 * @return {object} 返回该节点
	 */

	function _newElement(sTag)
	{
		return doc.createElement(sTag);
	}



	/**
	 * 创建一个新的XHR对象
	 * @version 1.0
	 * @date 2013年6月28日15:56:20
	 * @return {[type]} [description]
	 */

	function _newXHR()
	{
		var xhr;
		try
		{
			xhr = new win.XMLHttpRequest();
		}
		catch (e)
		{
			try
			{
				xhr = new win.ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{}
		}
		return xhr;
	}



	/**
	 * 标签字符串换换为Dom节点
	 * @version  1.0
	 * @date 2013年6月28日12:40:20
	 * @param  {标签字符串} string
	 * @return {dom节点} object
	 */

	function _stringToNode(string)
	{
		var tempWrap = _newElement("div");
		tempWrap.innerHTML = string;
		return tempWrap.children;
	}



	/**
	 * 把dom nodes 转换成 类数组
	 * 其实是一个对象，模拟成数组了
	 * @link http://haiyupeter.iteye.com/blog/1513403
	 * @version 1.1
	 * @date 2013年6月27日14:04:37
	 * @date 2013年6月28日9:40:48
	 * @param {Object} nodeList
	 * @return {Object} nodeArrayObject
	 */

	function _makeArray(nodes)
	{
		if (nodes === win || nodes === doc)
		{
			this[0] = nodes;
			this.length = 1;
		}
		else
		{
			for (var i = 0; i < nodes.length; i++)
			{
				this[i] = nodes[i];
			}
			this.length = nodes.length;
		}

		this.splice = [].splice;
		return this;
	}


	/**
	 * 元素在数组内的位置
	 * @version  1.0
	 * @date 2013年6月28日12:41:18
	 * @param  {*} elem 要判断的数组元素
	 * @param  {Array} 要判断的数组
	 * @param  {Number} 判断开始的索引
	 * @return {Number} 如果存在返回0+，如果不存在返回-1
	 */

	function _inArray(elem, array, fromIndex)
	{
		var len;
		fromIndex = fromIndex === undefined ? 0 : fromIndex;

		if (_isArray(array))
		{
			if ( !! Array.prototype.indexOf)
			{
				return array.indexOf(elem, fromIndex);
			}

			len = array.length;

			fromIndex < 0 ?
				Math.max(0, len + fromIndex) :
				fromIndex;

			for (; fromIndex < len; fromIndex++)
			{
				// Skip accessing in sparse arrays
				if (fromIndex in array && array[fromIndex] === elem)
				{
					return fromIndex;
				}
			}
		}

		return -1;
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

	function _each(obj, callback)
	{
		var value,
			i = 0,
			length = obj.length;
		if (_isArray(obj))
		{
			for (; i < length; i++)
			{
				value = callback.call(obj[i], i, obj[i]);
				if (value === false)
				{
					break;
				}
			}
		}
		else
		{
			for (i in obj)
			{
				value = callback.call(obj[i], i, obj[i]);
				if (value === false)
				{
					break;
				}
			}
		}
		return obj;
	}


	/**
	 * 重新包装数组
	 * @param  {Array} 数组或者类数组（有length属性）
	 * @param  {Function} 每一个元素的回调处理并返回
	 * @return {Array}
	 */

	function _map(array, callback)
	{
		var newArr = [];

		// 数组不存在
		if (array == null) return array;

		// 回调不是函数
		if (_isFunction(callback)) return array;

		// 系统有Array.map方法
		if ( !! Array.prototype.map)
		{
			return array.map(callback);
		}

		for (var i in array)
		{
			newArr[i] = callback.call(this ? this : null, array[i], i, array);
		}

		return newArr;
	}



	/**
	 * 判断对象类型，参考于jQuery源代码
	 * @version 1.0
	 * @date 2013年6月28日12:42:11
	 * @param  {Object} 对象
	 * @return {String} 对象类型
	 */

	function _type(obj)
	{
		return obj == null ? String(obj) : class2type[toString.call(obj)] || "object";
	}



	/**
	 * 判断对象是否为函数（方法）
	 * @version 1.0
	 * @date 2013年6月28日12:42:11
	 * @param  {Object} 传入对象
	 * @return {Boolean} 如果是返回true，否则返回false
	 */

	function _isFunction(obj)
	{
		return _type(obj) === "function";
	}



	/**
	 * 判断对象是否为数组
	 * @version 1.0
	 * @date 2013年6月28日12:42:11
	 * @param  {Object} 传入对象
	 * @return {Boolean} 如果是返回true，否则返回false
	 */

	function _isArray(obj)
	{
		return !!Array.isArray ?
			Array.isArray(obj) :
			obj instanceof Array;
	}



	/**
	 * 判断文档节点是否为XML
	 * @param  {Object} 文档节点
	 * @return {Boolean} 如果是返回true，否则返回false
	 */

	function _isXML(elem)
	{
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

		return documentElement ? documentElement.nodeName !== "HTML" : false;
	}



	/**
	 * 获得node对象的属性值
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {Object} 属性名称
	 * @return {String or Object} 如果存在返回属性值，不存在返回null
	 */

	function _getAttr(obj, sName)
	{
		return obj.getAttribute(sName);
	}

	/**
	 * 获得node对象的属性值
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {Object} 属性名称和属性值组织的JSON对象
	 * @return {undefined}
	 */

	function _setAttr(obj, oJSON)
	{
		for (var i in oJSON)
			obj.setAttribute(i, oJSON[i]);
	}



	/**
	 * 获得node对象的currentStyle
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {String} 单个style属性名称
	 * @param  {Boolean} 是否格式化为数值
	 * @return {String or Object} 如果存在返回style属性值，不存在返回null
	 */

	function _getStyle(obj, sName, bReturnNum)
	{
		var value = !! obj.currentStyle ?
			obj.currentStyle[sName] :
			getComputedStyle(obj, 0)[sName];
		return bReturnNum === true ? parseFloat(value) : value;
	}



	/**
	 * 设置node对象的style属性值
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {Object} 属性名称和属性值组织的json对象
	 * @return {undefined}
	 */

	function _setStyle(obj, oJSON)
	{
		for (var i in oJSON)
			obj.style[i] = oJSON[i];
	}



	/**
	 * 根据上下文和单个选择器获得node对象
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} 上下文
	 * @param  {String} 单个选择器
	 * @return {Object} node对象
	 */

	function _getElements(context, sSelector)
	{
		var nodeList = [],
			s1 = sSelector.substring(1),
			tempNode, i = 0,
			j = 0,
			tempArr = [];
		// 支持 querySelectorAll
		if ( !! doc.querySelectorAll)
		{
			nodeList = context.querySelectorAll(sSelector);
		}
		else
		{
			// id 选择器 #id
			if (regId.test(sSelector))
			{
				nodeList.push(context.getElementById(s1));
			}
			// class 选择器 .class
			else if (regClass.test(sSelector))
			{
				nodeList = _getByClass(context, s1);
			}
			// 混合选择 div.class
			else
			{
				tempArr = sSelector.match(regTagClass);
				context = _getByTag(context, tempArr[0]);
				nodeList = _getByTag(context, tempArr[1]);
			}
		}
		return nodeList;
	}



	/**
	 * 根据上下文和单个标签获得node对象
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} 上下文
	 * @param  {String} 单个标签名称
	 * @return {Object} node对象
	 */

	function _getByTag(context, sTag)
	{
		return context.getElementsByTagName(sTag);
	}


	/**
	 * 根据上下文和单个类名称获得node对象
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} 上下文
	 * @param  {String} 单个类名称
	 * @return {Object} node对象
	 */

	function _getByClass(context, sClass)
	{
		var nodeList = [],
			tempNode, i, j;
		// 支持 className
		if ( !! doc.getElementsByClassName)
		{
			nodeList = context.getElementsByClassName(sClass);
		}
		else
		{
			tempNode = context.getElementsByTagName("*");
			for (i = 0, j = tempNode.length; i < j; i++)
			{
				if (_hasClass(tempNode[i], sClass))
					nodeList.push(tempNode[i]);
			}
		}
		return nodeList;
	}



	/**
	 * 获得node对象的className
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} 上下文
	 * @return {String} class值
	 */

	function _getClass(obj)
	{
		//
		return obj.className ? obj.className.replace(/^\s*|\s*$/, "").split(/\s+/).join(" ") : "";
	}



	/**
	 * 设置node对象的className
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {String} 单个或多个class值
	 * @return {undefined}
	 */

	function _setClass(obj, sClass)
	{
		//
		obj.className = sClass;
	}

	/**
	 * 判断node对象是否包含该class值
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {String} 单个class值
	 * @return {Boolean} 如果存在返回true，否则返回false
	 */

	function _hasClass(obj, sClass)
	{
		var cls = _getClass(obj);
		return new RegExp("\\b" + sClass + "\\b").test(cls);
	}



	/**
	 * 添加node对象单个class
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {String} 单个class
	 * @return {undefined}
	 */

	function _addClass(obj, sClass)
	{
		var cls = _getClass(obj);
		if (!_hasClass(obj, sClass))
		{
			cls += " " + sClass;
			_setClass(obj, cls);
		}
	}

	/**
	 * 移除node对象单个class
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {Object} 单个class
	 * @return {undefined}
	 */

	function _removeClass(obj, sClass)
	{
		var cls = _getClass(obj);
		cls = cls.replace(new RegExp("\\b" + sClass + "\\b"), "");
		_setClass(obj, cls);
	}



	/**
	 * 判断元素是否为该标签
	 * @version 1.0
	 * @date 2013年6月29日22:50:27
	 * @param  {Object} node元素
	 * @param  {String} 标签名称
	 * @return {Boolean} 如果是返回true，否则返回false
	 */

	function _nodeName(elem, name)
	{
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	}



	/**
	 * 生成随机数字符串
	 * @version 1.0
	 * @date 2013年6月29日1:07:10
	 * @return {string}
	 */

	function _getRandom()
	{
		return "yQuery" + new Date().getTime();
	}



	/**
	 * 设置数据缓存
	 * @version 1.0
	 * @date 2013年6月29日1:08:14
	 * @link http://stylechen.com/cachedata.html
	 * @param {Object} 元素对象或普通对象
	 * @param {String} 键
	 * @param {*} 值
	 * @return 键值
	 */

	function _setData(elem, key, value)
	{
		// 索引
		var index;
		// 如果不存在索引值
		if (!elem[dataAttr])
		{
			index = elem[dataAttr] = ++dataIndex;
		}
		// 获得索引值
		else
		{
			index = elem[dataAttr];
		}
		if (!dataStore[index])
		{
			dataStore[index] = {};
		}
		dataStore[index][key] = value;
		return dataStore[index][key];
	}



	/**
	 * 读取数据缓存
	 * @version 1.0
	 * @date 2013年6月29日1:08:37
	 * @link http://stylechen.com/cachedata.html
	 * @param  {Object} 元素对象或普通对象
	 * @param  {String} 键
	 * @return {*} 返回键值，如果不存在返回null
	 */

	function _getData(elem, key)
	{
		// 不存在索引值
		if (!elem[dataAttr]) return null;
		var index = elem[dataAttr],
			value = dataStore[index][key];
		return value !== undefined ? value : null;
	}



	/**
	 * 移除数据缓存
	 * @version 1.0
	 * @date 2013年6月29日1:08:37
	 * @link http://stylechen.com/cachedata.html
	 * @param  {Object} 元素对象或普通对象
	 * @param  {String} 键，如果为空则清空
	 * @return {Boolean} 移除成功返回true，否则返回false
	 */

	function _removeData(elem, key)
	{
		// 不存在索引值
		if (!elem[dataAttr]) return false;
		var index = elem[dataAttr];
		return key === undefined ?
			delete(dataStore[index]) :
			delete(dataStore[index][key]);
	}



	/**
	 * 绑定事件
	 * @version 1.0
	 * @date 2013年6月29日1:08:37
	 * @param {Object} 元素对象
	 * @param {String} 事件类型
	 * @param {Function} 事件回调
	 */

	function _addEvent(elem, type, fn)
	{
		if (elem.addEventListener)
		{
			elem.addEventListener(type, fn, false);
		}
		else if (elem.attachEvent)
		{
			elem.attachEvent('on' + type, fn);
		}
	}



	/**
	 * 取消事件绑定
	 * @version 1.0
	 * @date 2013年6月29日1:08:37
	 * @param  {Object} 元素对象
	 * @param  {String} 事件类型
	 * @param  {Function} 事件回调
	 */

	function _removeEvent(elem, type, fn)
	{
		if (elem.addEventListener)
		{
			elem.removeEventListener(type, fn, false);
		}
		else if (elem.attachEvent)
		{
			elem.detachEvent('on' + type, fn);
		}
	}



	/**
	 * 修复IE浏览器支持常见的标准事件的API
	 * @version 1.0
	 * @date 2013年6月29日1:13:34
	 * @link http://stylechen.com/easyevent.html
	 * @param {Object} 处理事件的event
	 * @return {Object} 修复后的event
	 */

	function _fixEvent(e)
	{
		// 支持DOM 2级标准事件的浏览器无需做修复
		if (e.target)
		{
			return e;
		}
		var _e = {}, name;
		_e.target = e.srcElement || document;
		_e.preventDefault = function ()
		{
			e.returnValue = false;
		};

		_e.stopPropagation = function ()
		{
			e.cancelBubble = true;
		};
		// IE6/7/8在原生的win.event中直接写入自定义属性
		// 会导致内存泄漏，所以采用复制的方式
		for (name in e)
		{
			_e[name] = e[name];
		}
		return _e;
	}



	/**
	 * 依次执行事件绑定的函数
	 * 把绑定在该元素上的某类事件类型依次组成队列数组
	 * 并且在触发时依次按顺序执行，避免低级浏览器不能按顺序执行的BUG
	 * @version 1.0
	 * @date 2013年6月29日1:15:56
	 * @link http://stylechen.com/easyevent.html
	 * @param {Object} 要绑定事件的对象
	 * @param {String} 事件类型
	 */

	function _addEventHandler(elem, type)
	{
		return function (e)
		{
			e = _fixEvent(e || win.event);
			var
			queue = _getData(elem, dataPrefix + type + "Queue"),
				i = 0,
				j = queue.length,
				fn;

			for (; i < j; i++)
			{
				fn = queue[i];
				if (!fn) continue;
				if (fn.call(elem, e) === false)
				{
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}
	}



	/**
	 * 依次删除事件
	 * @todo 这里其实没有完美，不能依次删除绑定事件
	 * @version 1.0
	 * @date 2013年6月29日1:18:04
	 * @link http://stylechen.com/easyevent.html
	 * @param {Object} 元素对象
	 * @param {String} 事件类型
	 * @param {Function} 事件回调
	 */

	function _removeEventHandler(elem, type, fn)
	{
		// 获得事件队列数组
		var queue = _getData(elem, dataPrefix + type + "Queue"),
			find = -1,
			eventHandler;

		if (!queue || queue.length == 0) return;

		if (fn)
		{
			// 找到fn
			find = _inArray(fn, queue);
			if (find != -1)
			{
				queue.splice(find, 1);
			}
		}
		else
		{
			// 删除全部
			queue = [];
		}

		// 如果事件队列为空，则删除handler，清空缓存
		if (queue.length == 0)
		{
			eventHandler = _getData(elem, dataPrefix + type + 'Handler');
			_removeEvent(elem, type, eventHandler);
			_removeData(elem, dataPrefix + type + "Queue");
			_removeData(elem, dataPrefix + type + 'Handler');
		}
	}



	/**
	 * 对象事件绑定
	 * @link http://www.html5china.com/js/jsbase/20111124_2904.html
	 * @link http://www.dewen.org/q/8200/%E5%85%B3%E4%BA%8E%E5%A6%82%E4%BD%95%E6%8E%A7%E5%88%B6JS%E7%BB%91%E5%AE%9A%E4%BA%8B%E4%BB%B6%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F%E7%9A%84%E9%97%AE%E9%A2%98%3F
	 * @link http://stylechen.com/easyevent.html
	 * @version  1.2
	 * @date 2013年6月27日13:07:50
	 * @date 2013年6月28日13:07:50
	 * @date 2013年6月29日1:19:59
	 * @param  {Object} 要绑定事件的对象
	 * @param  {String} window已经注册的事件类型或自定义的事件类型
	 * @param  {Function} 事件回调
	 * @return {undefined}
	 */

	function _bind(elem, type, fn)
	{
		var key = dataPrefix + type + "Queue",
			queue = _getData(elem, key) || _setData(elem, key, []),
			eventHandler;

		// 将事件函数添加到队列中
		queue.push(fn);
		_setData(elem, key, queue);

		// 同一事件类型只注册一次事件，防止重复注册
		if (queue.length === 1)
		{
			eventHandler = _addEventHandler(elem, type);
			_setData(elem, dataPrefix + type + 'Handler', eventHandler);
			_addEvent(elem, type, eventHandler);
		}
	}



	/**
	 * 取消对象事件绑定
	 * @link http://stylechen.com/easyevent.html
	 * @version  1.2
	 * @date 2013年6月27日13:07:50
	 * @date 2013年6月28日13:07:50
	 * @date 2013年6月29日1:20:47
	 * @param  {Object} 要取消事件绑定的对象
	 * @param  {String} window已经注册的事件类型或自定义的事件类型
	 * @return {undefined}
	 */

	function _unbind(elem, type, fn)
	{
		// 如果有具体的函数则只删除一个
		if (fn)
		{
			_removeEventHandler(elem, type, fn);
		}
		// 如果没有传入要删除的函数则删除该事件类型所有
		else
		{
			_removeEventHandler(elem, type);
		}
	}



	/**
	 * 事件触发器
	 * @version 1.0
	 * @date 2013年6月29日1:35:21
	 * @link http://stylechen.com/trigger.html
	 * @param { Object } DOM元素
	 * @param { String / Object } 事件类型 / event对象
	 * @param { Array }  传递给事件处理函数的附加参数
	 */

	function _eventTrigger(elem, sType, aData)
	{
		var
		parent = elem.parentNode || elem.ownerDocument || elem === elem.ownerDocument && win,
			handler = _getData(elem, dataPrefix + sType + 'Handler'),
			e = {
				type: sType,
				preventDefault: emptyFn,
				stopPropagation: function ()
				{
					isStopPropagation = true;
				},
				target: elem
			};
		aData.unshift(e);
		if (handler)
		{
			handler.apply(elem, aData);
		}
	}



	/**
	 * 事件转换处理，用 mouseover mouseout
	 * @version 1.0
	 * @date 2013年6月28日17:26:33
	 * @link http://xiebiji.com/2010/02/js_mouseenter_mouseleave/
	 * @param  {Function} 事件回调
	 * @return {*}
	 */

	function _eventConvert(fn)
	{
		return function (e)
		{
			e = e || win.event;

			// 上一响应mouseover/mouseout事件的元素
			var parent = e.relatedTarget;

			// 假如存在这个元素并且这个元素不等于目标元素（被赋予mouseenter事件的元素）
			while (parent != this && parent)
			{
				try
				{
					// 上一响应的元素开始往上寻找目标元素
					parent = parent.parentNode;
				}
				catch (e)
				{
					break;
				}
			}

			// 以mouseenter为例，假如找不到，表明当前事件触发点不在目标元素内
			// 运行目标方法，否则不运行
			if (parent != this) fn(e);
		}
	}



	function _support()
	{
		return {};
	}
})(this);