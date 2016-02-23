/*!
 * 云淡然的yQuery
 * @author 云淡然 http://qianduanblog.com
 * @version 1.1
 */

(function (win, undefined)
{
	var
	yquery = {
		version: "1.1",
		time: "2013年7月10日20:39:29",
		authorName: "云淡然",
		authorEmail: "cloudcome@163.com",
		authorUrl: "http://qianduanblog.com/",
		src: ""
	},
		// 防止$符号被覆盖
		_$ = win.$,
		// document
		doc = win.document,
		// 缓存内容
		dataStore = {},
		// 缓存自增索引
		dataIndex = 0,
		// 缓存dom属性
		dataAttr = _getRandom(),
		// 系统缓存前缀，防止缓存
		dataPrefix = _getRandom() + ".",
		// 正则<tagName
		regTagElem = /^<([^>\/]+)\s*\/?>/,
		// 正则 标签 id class
		regTagIdClass = /((?!#|\.)[\w]*)?(:?#([\w\-]*))?(:?\.([\w\-]*))?/,
		// 需要额外计算的样式
		styleExtraType = {
			"inner": ["padding"],
			"outer": ["padding", "margin", "border"]
		},
		styleExtraName = {
			"Width": ["Left", "Right"],
			"Height": ["Top", "Bottom"]
		},
		// 事件数组
		normalEventArr = "blur focus focusin focusout load unload click dblclick mousedown mouseup mousemove mouseover mouseout change select submit keydown keypress keyup error contextmenu hashchange".split(" "),
		delayEventArr = ["scroll", "resize"],
		// 布尔值的属性 property
		regBooleanAttr = /^checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped$/i,
		// 空函数
		emptyFn = function () {},
		oEventTaget,
		// 对象类型检测
		class2type = {},
		toString = class2type.toString,
		// css3浏览器私有前缀
		aCss3Prefix = ["-webkit-", "-moz-", "-ms-", "-o-", "-khtml-", ""],
		// css3动画执行完毕回调监听方法
		css3AnimateStopListen = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
		css3AnimateEasingPrefix = 'cubic-bezier(',
		css3AnimateEasing = {
			'in': 'ease-in',
			'out': 'ease-out',
			'in-out': 'ease-in-out',
			'snap': css3AnimateEasingPrefix + '0,1,.5,1)',
			'linear': css3AnimateEasingPrefix + '0.250, 0.250, 0.750, 0.750)',
			'ease-in-quad': css3AnimateEasingPrefix + '0.550, 0.085, 0.680, 0.530)',
			'ease-in-cubic': css3AnimateEasingPrefix + '0.550, 0.055, 0.675, 0.190)',
			'ease-in-quart': css3AnimateEasingPrefix + '0.895, 0.030, 0.685, 0.220)',
			'ease-in-quint': css3AnimateEasingPrefix + '0.755, 0.050, 0.855, 0.060)',
			'ease-in-sine': css3AnimateEasingPrefix + '0.470, 0.000, 0.745, 0.715)',
			'ease-in-expo': css3AnimateEasingPrefix + '0.950, 0.050, 0.795, 0.035)',
			'ease-in-circ': css3AnimateEasingPrefix + '0.600, 0.040, 0.980, 0.335)',
			'ease-in-back': css3AnimateEasingPrefix + '0.600, -0.280, 0.735, 0.045)',
			'ease-out-quad': css3AnimateEasingPrefix + '0.250, 0.460, 0.450, 0.940)',
			'ease-out-cubic': css3AnimateEasingPrefix + '0.215, 0.610, 0.355, 1.000)',
			'ease-out-quart': css3AnimateEasingPrefix + '0.165, 0.840, 0.440, 1.000)',
			'ease-out-quint': css3AnimateEasingPrefix + '0.230, 1.000, 0.320, 1.000)',
			'ease-out-sine': css3AnimateEasingPrefix + '0.390, 0.575, 0.565, 1.000)',
			'ease-out-expo': css3AnimateEasingPrefix + '0.190, 1.000, 0.220, 1.000)',
			'ease-out-circ': css3AnimateEasingPrefix + '0.075, 0.820, 0.165, 1.000)',
			'ease-out-back': css3AnimateEasingPrefix + '0.175, 0.885, 0.320, 1.275)',
			'ease-out-quad': css3AnimateEasingPrefix + '0.455, 0.030, 0.515, 0.955)',
			'ease-out-cubic': css3AnimateEasingPrefix + '0.645, 0.045, 0.355, 1.000)',
			'ease-in-out-quart': css3AnimateEasingPrefix + '0.770, 0.000, 0.175, 1.000)',
			'ease-in-out-quint': css3AnimateEasingPrefix + '0.860, 0.000, 0.070, 1.000)',
			'ease-in-out-sine': css3AnimateEasingPrefix + '0.445, 0.050, 0.550, 0.950)',
			'ease-in-out-expo': css3AnimateEasingPrefix + '1.000, 0.000, 0.000, 1.000)',
			'ease-in-out-circ': css3AnimateEasingPrefix + '0.785, 0.135, 0.150, 0.860)',
			'ease-in-out-back': css3AnimateEasingPrefix + '0.680, -0.550, 0.265, 1.550)'
		},
		defaults = {
			// 动画默认参数
			transition:
			{
				easing: "in-out",
				duration: 500,
				delay: 0,
			},
			// ajax默认参数
			ajax:
			{
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
			cookie:
			{
				// 因为设置空domain才能在本地正常写入
				domain: "",
				// 默认cookie有效期1个小时
				expires: 3600000,
				// 默认cookie存储路径
				path: "/"
			}
		},
		supports = {
			xpath: !! (document.evaluate),
			air: !! (window.runtime),
			query: !! (document.querySelector)
		},
		browser = {
			pf: navigator.platform.toLowerCase(),
			ua: navigator.userAgent.toLowerCase(),
			pg: navigator.plugins
		},
		ie = (function ()
		{
			var v = 3,
				div = document.createElement('div'),
				a = div.all || [];
			while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->', a[0]);
			return v > 4 ? v : 0;
		}());



	function yQuery(vArg)
	{
		return new yQuery.fn.init(vArg);
	}



	/*================================[ 原型 ]=================================*/
	yQuery.fn = yQuery.prototype = {
		constructor: yQuery,
		/**
		 * 初始化
		 * @version 1.3
		 * @date 2013年7月1日18:45:16
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @date 2013年6月28日9:06:59
		 * @param  {String / Object / Function}
		 * @return {Array / Array / undefined}
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
					nodes = _querySelector(vArg, doc);
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
				// 是nodeArray
				else if ( !! vArg.length)
				{
					nodes = vArg;
				}
				// 节点
				else if ( !! vArg.nodeType && vArg.nodeType === 1)
				{
					nodes = [];
					nodes.push(vArg);
				}
				else
				{
					nodes = [];
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
		 * 动画
		 * @version  1.0
		 * @date 2013年7月7日16:30:28
		 * @param  {Object} 目标的css样式
		 * @param  {Object} 动画属性参数
		 * @param  {Object} 动画执行参数
		 * @param  {Function} 执行完成回调
		 * @return {Object} this
		 */
		animate: function (oProperty, oTransition, fn)
		{
			var i = 0,
				j = this.length,
				_this = this,
				k = 0;

			if (!_isFunction(fn)) fn = emptyFn;

			for (; i < j; i++)
			{
				_animate(this[i], oProperty, oTransition, function ()
				{
					k++;
					// 只触发一次回调
					if (k === j) fn.call(_this);
				});
			}
			return this;
		},
		/**
		 * 变换透明度
		 * @version  1.0
		 * @date 2013年7月9日21:28:18
		 * @param  {Number} 透明度
		 * @param  {Object} 动画属性参数
		 * @param  {Function} 变换结束回调
		 * @return {Object} this
		 */
		fadeTo: function (nOpacity, oTransition, fn)
		{
			var oProperty = {
				"opacity": nOpacity
			};

			return this.animate(oProperty, oTransition, fn);
		},
		/**
		 * 旋转
		 * @version 1.0
		 * @date 2013年7月9日17:39:25
		 * @param  {Number} 旋转的角度
		 * @param  {Object} 动画属性参数
		 * @param  {Function} 变换结束回调
		 * @return {Object} this
		 */
		rotate: function (nDeg, oTransition, fn)
		{
			var oProperty = _css3Prefix(
			{
				"transform": "rotate(" + nDeg + "deg)"
			}, 1);

			return this.animate(oProperty, oTransition, fn);
		},
		/**
		 * 停止停止当前动画并执行最后的动画动画
		 * @version  1.0
		 * @date 2013年7月7日16:40:39
		 * @param  {Boolean} 是否清除动画队列
		 * @param  {Boolean} 是否立即完成动画
		 * @return {Object} this
		 */
		stop: function (bClearQueue, bJumpToEnd)
		{
			var A = arguments,
				AL = A.length,
				_bClearQueue, _bJumpToEnd,
				i = 0,
				j = this.length;
			if (AL == 0)
			{
				_bClearQueue = false;
				_bJumpToEnd = false;
			}
			else if (AL == 1)
			{
				_bClearQueue = !! A[0];
				_bJumpToEnd = false;
			}
			else
			{
				_bClearQueue = !! A[0];
				_bJumpToEnd = !! A[1];
			}
			for (; i < j; i++)
			{
				_animateStop(this[i], _bClearQueue, _bJumpToEnd);
			}
			return this;
		},
		/**
		 * 将停止的动画继续运行
		 * @version  1.0
		 * @date 2013年7月7日17:23:06
		 * @return {Object} this
		 */
		"continue": function ()
		{
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				_animateDo(this[i]);
			}
			return this;
		},
		/**
		 * 延迟一段时间并进行下一个动画
		 * @version 1.0
		 * @date 2013年7月9日21:31:44
		 * @param  {Number} 延迟时间
		 * @return {Object} this
		 */
		delay: function (nTime)
		{
			// 在对象的动画队列添加一个延迟静止动画
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				_animateDelay(this[i], nTime);
			}
			return this;
		},
		/**
		 * 循环遍历this，并执行回调
		 * @version  1.1
		 * @date 2013年7月1日19:03:00
		 * @date 2013年6月29日17:26:56
		 * @param  {Function} 遍历回调
		 * @return {Object} this
		 */
		each: function (fn)
		{
			var arr = [],
				i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				arr.push(this[i]);
			}

			_each(arr, function (index, item)
			{
				fn(index, item);
			});
			return this;
		},
		/**
		 * 选择集合的第几个（从0开始）
		 * @version 1.1
		 * @date 2013年6月27日16:09:03
		 * @date 2013年6月27日2:03:15
		 * @param  索引序号
		 * @return {Object}
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
		 * 获取第1个元素
		 * @version  1.0
		 * @date 2013年7月1日22:58:26
		 * @return {Object}
		 */
		first: function ()
		{
			return yQuery(this[0]);
		},
		/**
		 * 获取最后一个元素
		 * @version  1.0
		 * @date 2013年7月1日22:58:26
		 * @return {Object}
		 */
		last: function ()
		{
			return yQuery(this[this.length - 1]);
		},
		/**
		 * 返回元素的个数
		 * @version  1.0
		 * @date 2013年6月27日16:09:03
		 * @return {元素个数} 如果存在返回1+，不存在返回0
		 */
		length: function ()
		{
			// 
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
		find: function (sSelector)
		{
			var aResult = [],
				i = 0,
				j = this.length;

			// 遍历类数组元素
			for (; i < j; i++)
			{
				aResult = yQuery.extend(aResult, _querySelector(sSelector, this[i]));
			}

			// 重新包装对象成类数组
			return yQuery(aResult);
		},
		/**
		 * 获得元素相邻的下一个元素
		 * @version  1.0
		 * @date 2013年7月1日23:20:23
		 * @return {Object}
		 */
		next: function ()
		{
			return jQuery(_siblingElem(this[0], "nextSibling"));
		},
		/**
		 * 获得元素相邻的上一个元素
		 * @version  1.0
		 * @date 2013年7月1日23:20:23
		 * @return {Object}
		 */
		prev: function ()
		{
			return jQuery(_siblingElem(this[0], "previousSibling"));
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
		 * 返回从元素自身开始到符合条件的第一个祖先元素
		 * @version  1.1
		 * @date 2013年7月1日19:32:31
		 * @date 2013年6月28日13:42:51
		 * @param  {String} 基本一级选择器
		 * @return {Object} 该祖先元素的yQuery对象
		 */
		closest: function (sSelector)
		{
			var json = _parseSelector(sSelector),
				elem = this[0],
				oParent = elem,
				find = false;
			if (!elem) return null;
			while (!find)
			{
				if (oParent.nodeType === 9) break;
				if (oParent.nodeType !== 1) continue;
				if (
				(!json.tag || _nodeName(oParent, json.tag)) && (!json.id || _getAttr(oParent, "id") === json.id) && (!json["class"] || _hasClass(oParent, "class") === json["class"]))
				{
					find = true;
					break;
				}
				oParent = oParent.parentNode;
			}
			return find ? yQuery(oParent) : null;
		},
		/**
		 * 返回从元素父级开始到符合条件的第一个祖先元素
		 * @version  1.1
		 * @date 2013年7月1日22:46:43
		 * @date 2013年6月28日13:42:51
		 * @param  {String} 基本一级选择器
		 * @return {Object} 该祖先元素的yQuery对象
		 */
		parent: function (sSelector)
		{
			var json = _parseSelector(sSelector),
				elem = this[0],
				oParent = elem,
				find = false;
			if (!elem) return null;
			while (!find)
			{
				oParent = oParent.parentNode;
				if (oParent.nodeType === 9) break;
				if (oParent.nodeType !== 1) continue;
				if (
				(!json.tag || _nodeName(oParent, json.tag)) && (!json.id || _getAttr(oParent, "id") === json.id) && (!json["class"] || _hasClass(oParent, "class") === json["class"]))
				{
					find = true;
					break;
				}
			}
			return find ? yQuery(oParent) : null;
		},
		/**
		 * 返回从元素父级开始到符合条件的所有祖先元素
		 * @version  1.1
		 * @date 2013年7月1日22:46:43
		 * @date 2013年6月28日13:42:51
		 * @param  {String} 基本一级选择器
		 * @return {Object} 该祖先元素的yQuery对象
		 */
		parents: function (sSelector)
		{
			var json = _parseSelector(sSelector),
				elem = this[0],
				oParent = elem,
				aResult = [];
			if (!elem) return null;
			while (oParent.nodeType !== 9)
			{
				oParent = oParent.parentNode;
				if (oParent.nodeType !== 1) continue;
				if (
				(!json.tag || _nodeName(oParent, json.tag)) && (!json.id || _getAttr(oParent, "id") === json.id) && (!json["class"] || _hasClass(oParent, "class") === json["class"]))
				{
					aResult.push(oParent);
				}
			}
			return yQuery(aResult);
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
		 * @param  {string} 要绑定的事件类型，多个事件以空格分开
		 * @param  {Function} 要绑定的事件
		 * @return undefined
		 */
		bind: function (sType, fn)
		{
			var i = 0,
				j = this.length,
				aType = _trim(sType).split(/\s+/),
				m = 0,
				n = aType.length;
			for (; i < j; i++)
			{
				for (m = 0; m < n; m++)
				{
					_bind(this[i], aType[m], fn);
				}
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
							fn.call(oTarget[i], e);
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
		 * 鼠标滚轮事件
		 * @version  1.0
		 * @date 2013年7月4日22:37:31
		 * @link http://help.dottoro.com/ljmracjb.php
		 * @param  {Function} fn [description]
		 * @return {Object} this
		 */
		mousewheel: function (fn)
		{
			function originalFn(e)
			{
				e = _fixEvent(e);
				if ("wheelDelta" in e)
				{
					rolled = e.wheelDelta;
				}
				else
				{
					rolled = -40 * event.detail;
				}
				fn(e, rolled);
			}
			this.bind("mousewheel", _delayRunFn(originalFn, 100));
			this.bind("DOMMouseScroll", _delayRunFn(originalFn, 100));
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

			if (L == 1 && _type(A0) === "string")
			{
				return _getStyle(this[0], A0);
			}

			L == 1 ? json = A0 : json[A0] = A1;

			for (; i < j; i++)
			{
				_setStyle(this[i], json);
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
		attr: function (sAttrName, sAttrValue)
		{
			var i = 0,
				j = this.length,
				json = {},
				A = arguments,
				A0 = A[0],
				A1 = A[1],
				L = A.length;

			if (L == 1 && _type(A0) === "string")
			{
				return _getAttr(this[0], A0);
			}

			L == 1 ? json = A0 : json[A0] = A1;

			for (; i < j; i++)
			{
				_setAttr(this[i], json);
			}
			return this;
		},
		/**
		 * 移除属性
		 * @version  1.0
		 * @date 2013年7月6日23:29:36
		 * @param  {String} 属性值
		 * @return {Object} this
		 */
		removeAttr: function (sAttrName)
		{
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				_removeAttr(this[i], sAttrName);
			}
			return this;
		},
		/**
		 * 设置元素的value属性
		 * @version  1.0
		 * @date 2013年7月6日23:29:36
		 * @param  {String} 属性值
		 * @return {*}
		 */
		val: function (sValue)
		{
			return this.attr("value", sValue);
		},
		/**
		 * 设置元素的布尔属性值
		 * @version  1.0
		 * @date 2013年7月6日23:29:36
		 * @param  {String} 布尔属性
		 * @param  {Boolean} 布尔值
		 * @return {Object} this
		 */
		prop: function (sPropName, bPropValue)
		{
			// 属于布尔属性
			if (sPropName && regBooleanAttr.test(sPropName))
			{
				return bPropValue ?
					this.attr(sPropName, "") :
					this.removeAttr(sPropName);
			}
			else
			{
				return this.attr(arguments);
			}
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
		 * 在父对象内部追加子对象
		 * @version 1.2
		 * @date 2013年7月6日16:20:20
		 * @date 2013年6月27日16:22:10
		 * @date 2013年6月26日14:54:23
		 * @param  {String or Object}
		 * @return {Object} 目标对象
		 */
		append: function (vArg)
		{
			var i = 0,
				j = this.length,
				oTarget,
				aChild = yQuery(vArg),
				m = 0,
				n = aChild.length,
				oChild;

			for (; i < j; i++)
			{
				oTarget = this[i];
				if (oTarget.nodeType === 1)
				{
					for (m = 0; m < n; m++)
					{
						oChild = aChild[m];
						if (oChild.nodeType === 1)
						{
							oTarget.appendChild(oChild);
						}
					}
				}
			}

			return this;
		},
		/**
		 * 在父对象内部前置子对象
		 * @version 1.2
		 * @date 2013年7月6日16:43:02
		 * @date 2013年6月27日16:22:10
		 * @date 2013年6月26日14:54:23
		 * @param  {String or Object}
		 * @return {Object} 目标对象
		 */
		prepend: function (vArg)
		{
			var i = 0,
				j = this.length,
				oTarget,
				aChild = yQuery(vArg),
				m = 0,
				n = aChild.length,
				oChild;

			for (; i < j; i++)
			{
				oTarget = this[i];
				if (oTarget.nodeType === 1)
				{
					for (m = 0; m < n; m++)
					{
						oChild = aChild[m];
						if (oChild.nodeType === 1)
						{
							oTarget.insertBefore(oChild, oTarget.firstChild);
						}
					}
				}
			}

			return this;
		},
		/**
		 * 在目标对象前邻近添加对象
		 * @version  1.2
		 * @date 2013年7月6日16:56:47
		 * @date 2013年6月27日0:55:10
		 * @date 2013年6月26日15:01:02
		 * @param  {String or Object}
		 * @return {Object} 目标对象
		 */
		before: function (vArg)
		{
			var i = 0,
				j = this.length,
				oParent,
				oTarget,
				aChild = yQuery(vArg),
				m = 0,
				n = aChild.length;

			for (; i < j; i++)
			{
				oTarget = this[i];
				oParent = oTarget.parentNode
				if (oParent && oParent.nodeType === 1)
				{
					for (m = 0; m < n; m++)
					{
						oChild = aChild[m];
						if (oChild.nodeType === 1)
						{
							oParent.insertBefore(oChild, oTarget);
						}
					}
				}
			}

			return this;
		},
		/**
		 * 在目标对象后邻近添加单个对象
		 * @version  1.2
		 * @date 2013年7月6日16:59:10
		 * @date 2013年6月27日16:29:43
		 * @date 2013年6月26日15:01:12
		 * @param  {String or Object}
		 * @return {Object} 目标对象
		 */
		after: function (vArg)
		{
			var i = 0,
				j = this.length,
				oParent,
				oTarget,
				aChild = yQuery(vArg),
				m = 0,
				n = aChild.length,
				oChild;

			for (; i < j; i++)
			{
				oTarget = this[i];
				if (oTarget.nodeType === 1)
				{
					oParent = this[i].parentNode;
					if (oParent && oParent.nodeType === 1)
					{
						for (m = 0; m < n; m++)
						{
							oChild = aChild[m];
							if (oTarget === oParent.lastChild)
							{
								oParent.appendChild(oChild);
							}
							else
							{
								oParent.insertBefore(oChild, oTarget.nextElementSibling || oTarget.nextSibling);
							}
						}
					}
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
			// TODO
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
		 * @version  1.1
		 * @date 2013年7月1日18:20:06
		 * @date 2013年6月28日14:16:59
		 * @param  {String} 字符串
		 * @return {String or Object}
		 */
		html: function (sHtml)
		{
			if (!arguments.length)
			{
				return this[0].innerHTML;
			}
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				this[i].innerHTML = sHtml;
			}
			return this;
		},
		/**
		 * 获取 或者 设置节点的outerHTML
		 * 设置的时候相当于jQuery的replaceWith
		 * @version  1.0
		 * @date 2013年6月28日16:41:35
		 * @param {String}
		 * @return {String or Object}
		 */
		outerHtml: function (sHtml)
		{
			if (!arguments.length)
			{
				return this[0].outerHTML;
			}
			var i = 0,
				j = this.length;
			for (; i < j; i++)
			{
				this[i].outerHTML = sHtml;
			}
			return this;
		},
		/**
		 * 读取 或者 设置 节点的纯文本
		 * @version  1.1
		 * @date 2013年7月1日18:20:17
		 * @date 2013年6月30日0:02:36
		 * @param  {String} 纯文本
		 * @return {String or Object}
		 */
		text: function (sText)
		{
			var i = 0,
				j = this.length,
				reslut = "";
			if (!arguments.length)
			{
				for (; i < j; i++)
				{
					reslut += _getText(this[i]);
				}
				return reslut;
			}
			for (; i < j; i++)
			{
				_setText(this[i], sText);
			}
			return this;
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
			return yQuery(_nodeName(elem.nodeName, "iframe") ?
				elem.contentDocument || elem.contentWindow.document :
				elem.children);
		},
		/**
		 * 获得元素相对当前窗口的位移
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
			if (_getStyle(elem, "position") === "fixed")
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



	/**
	 * 显示
	 * @version 1.1
	 * @date 2013年7月9日21:28:34
	 * @date 2013年7月8日20:10:18
	 * @param  {Number} 动画时间
	 * @param  {String} 动画缓冲
	 * @param  {Function} 动画执行完毕回调
	 * @return {Object} this
	 */
	_each(["fadeIn", "show", "slideRight", "slideDown"], function (index, animateType)
	{
		yQuery.fn[animateType] = function (nDuration, sEasing, fn)
		{
			var A = arguments,
				AL = A.length,
				oProperty = {},
				oTransition = {
					duration: nDuration
				},
				fn = emptyFn,
				i = 0,
				j = this.length,
				_this = this,
				// 触发次数
				k = 0,
				the;


			// 2个参数，第2个参数是easing
			if (AL == 2 && _type(A[1]) === "string")
			{
				oTransition.easing = A[1];
			}
			// 2个参数，第2个参数是function
			else
			{
				if (_isFunction(A[1])) fn = A[1];
			}


			for (; i < j; i++)
			{
				the = yQuery(this[i]);
				switch (index)
				{
					// fadeIn
				case 0:
					oProperty = {
						opacity: "1"
					};
					break;
					// show
				case 1:
					oProperty = {
						width: the.data(dataPrefix + "css.width") || "auto",
						height: the.data(dataPrefix + "css.height") || "auto",
						"padding-top": the.data(dataPrefix + "css.padding-top") || "0",
						"padding-right": the.data(dataPrefix + "css.padding-right") || "0",
						"padding-bottom": the.data(dataPrefix + "css.padding-bottom") || "0",
						"padding-left": the.data(dataPrefix + "css.padding-left") || "0",
						"border-top-width": the.data(dataPrefix + "css.border-top-width") || "0",
						"border-right-width": the.data(dataPrefix + "css.border-right-width") || "0",
						"border-bottom-width": the.data(dataPrefix + "css.border-bottom-width") || "0",
						"border-left-width": the.data(dataPrefix + "css.border-left-width") || "0"
					};
					break;
					// slideRight
				case 2:
					oProperty = {
						width: the.data(dataPrefix + "css.width") || "auto",
						"padding-right": the.data(dataPrefix + "css.padding-right") || "0",
						"padding-left": the.data(dataPrefix + "css.padding-left") || "0",
						"border-right-width": the.data(dataPrefix + "css.border-right-width") || "0",
						"border-left-width": the.data(dataPrefix + "css.border-left-width") || "0"
					};
					break;
					// slideDown
				case 3:
					oProperty = {
						height: the.data(dataPrefix + "css.height") || "auto",
						"padding-top": the.data(dataPrefix + "css.padding-top") || "0",
						"padding-bottom": the.data(dataPrefix + "css.padding-bottom") || "0",
						"border-top-width": the.data(dataPrefix + "css.border-top-width") || "0",
						"border-bottom-width": the.data(dataPrefix + "css.border-bottom-width") || "0"
					};
					break;
				}

				// 这里必须预先设置为display block，否则不会触发动画
				the.css("display", the.data(dataPrefix + "css.display") || "block");

				_animate(the[0], oProperty, oTransition, function ()
				{
					k++;
					if (k === j) fn.call(_this);
				});
			}

			return this;
		}
	})


	/**
	 * 隐藏
	 * @version 1.1
	 * @date 2013年7月9日21:28:41
	 * @date 2013年7月8日20:10:18
	 * @param  {Number} 动画时间
	 * @param  {String} 动画缓冲
	 * @param  {Function} 动画执行完毕回调
	 * @return {Object} this
	 */
	_each(["fadeOut", "hide", "slideLeft", "slideUp"], function (index, animateType)
	{
		yQuery.fn[animateType] = function (nDuration, sEasing, fn)
		{
			var A = arguments,
				AL = A.length,
				oProperty = {},
				oTransition = {
					duration: nDuration
				},
				fn,
				the,
				i = 0,
				j = this.length,
				_this = this,
				k = 0;

			switch (index)
			{
				// fadeOut
			case 0:
				oProperty = {
					"opacity": "0"
				};
				break;
				// hide
			case 1:
				oProperty = {
					"width": "0",
					"height": "0",
					"padding-top": "0",
					"padding-right": "0",
					"padding-bottom": "0",
					"padding-left": "0",
					"border-top-width": "0",
					"border-right-width": "0",
					"border-bottom-width": "0",
					"border-left-width": "0"
				};
				break;
				// slideLeft
			case 2:
				oProperty = {
					"width": "0",
					"padding-right": "0",
					"padding-left": "0",
					"border-right-width": "0",
					"border-left-width": "0"
				};
				break;
				// slideUp
			case 3:
				oProperty = {
					"height": "0",
					"padding-top": "0",
					"padding-bottom": "0",
					"border-top-width": "0",
					"border-bottom-width": "0"
				};
				break;
			}

			// overflow、display不知道transition，所以必须单独写
			// 但是不好控制，多个元素就会出现紊乱
			// TODO

			// 2个参数，第2个参数是easing
			if (AL == 2 && _type(A[1]) == "string")
			{
				oTransition.easing = A[1];
			}
			// 2个参数，第2个参数是function
			else if (AL == 2 && _isFunction(A[1]))
			{
				fn = A[1];
			}

			// 存储样式
			for (; i < j; i++)
			{
				the = yQuery(this[i]);
				_each(["display", "width", "height", "overflow", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width"], function (j, v)
				{
					the.data(dataPrefix + "css." + v, the.css(v));
				});
				the.css("overflow", "hidden");

				_animate(the[0], oProperty, oTransition, function ()
				{
					k++;
					if (k === j) fn.call(_this);
				});
			}

			return this;
		}

	})



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



	// 普通事件绑定
	_each(normalEventArr, function (key, value)
	{
		yQuery.fn[value] = function (fn)
		{
			this.bind(value, fn);
			return this;
		};
	});


	// 延迟事件绑定
	_each(delayEventArr, function (key, value)
	{
		yQuery.fn[value] = function (fn)
		{
			this.bind(value, _delayRunFn(fn, 100));
			return this;
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
		/**
		 * yquery的一些基础信息
		 * @type {Object}
		 */
		yquery: yquery,
		"default": defaults,
		type: _type,
		isArray: _isArray,
		isFunction: _isFunction,
		map: _map,
		each: _each,
		parseJSON: _parseJSON,
		stringifyJSON: _stringifyJSON,
		parseXML: _parseXML,
		inArray: _inArray,
		support: supports,
		/**
		 * 获取操作平台的特征属性
		 * @type {Object} 对象集合
		 */
		platform:
		{
			// 名称
			name: (win.orientation != undefined) ? 'iPod' : (browser.pf.match(/mac|win|linux/i) || ['unknown'])[0],
			version: 0,
			iPod: 0,
			iPad: 0,
			iPhone: 0,
			android: 0,
			win: 0,
			linux: 0,
			mac: 0
		},
		/**
		 * 获取浏览器的特征属性
		 * @type {Object} 对象集合
		 */
		browser:
		{
			name: "unknown",
			version: 0,
			ie: ie,
			chrome: 0,
			firefox: 0,
			opera: 0,
			safari: 0,
			mobileSafari: 0,
			adobeAir: 0,
			flash: _getBrowserFlashVersion(),
			/**
			 * 获取浏览器核心的特征属性
			 * @type {Object} 对象集合
			 */
			engine:
			{
				name: "unknown",
				version: 0,
				version: 0,
				webkit: 0,
				trident: 0,
				gecko: 0,
				presto: 0
			}
		},
		/**
		 * ajax请求并回调
		 * @param {Object} options 接收以下参数
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
			{}, defaults.ajax, options),
				headers = {},
				i,
				xhr,
				status,
				temp;

			if (!supports.ajax)
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
		},
		/**
		 * 产生随机数
		 * @version  1.0
		 * @date 2013年7月9日17:06:33
		 * @param  {Number} min 最小整数（含）
		 * @param  {Number} max 最大整数（含）
		 * @return {Number} 随机数
		 */
		random: function (min, max)
		{
			return Math.floor(Math.random() * (max - min + 1) + min);
		},
		/**
		 * 设置、获取、清除、清空 cookie
		 * @version 1.0
		 * @date 2013年7月10日21:23:17
		 * @example
		 * all=>$.cookie();
		 * get=>$.cookie("name");
		 * set=>$.cookie("name","value");
		 * remove=>$.cookie("name",null);
		 * clear=>$.cookie(null);
		 *
		 * @param  {String} cookie 名称
		 * @param  {String} cookie 值
		 * @param  {[type]} cookie 参数 path、domain、expires
		 * @return {*}
		 */
		cookie: function (sName, sValue, oOption)
		{
			oOption = oOption ||
			{};
			var A = arguments,
				AL = A.length,
				ck = doc.cookie,
				oTemp = {},
				i;
			// all
			if (AL === 0)
			{
				return _getCookies();
			}
			// clear
			else if (AL === 1 && sName === null)
			{
				oOption.expires = -1;
				oTemp = _getCookies();
				for (i in oTemp)
				{
					_setCookie(i, "", oOption);
				}
			}
			// get
			else if (AL === 1 && _type(sName) === "string")
			{
				return _getCookies()[sName];
			}
			// remove
			else if (AL === 2 && sValue === null)
			{
				oOption.expires = -1;
				_setCookie(sName, "", oOption);
			}
			// set
			else if (AL >= 2 && _type(sValue) === "string")
			{
				_setCookie(sName, sValue, oOption);
			}
		},
		/**
		 * 设置、获取、清除、清空 localstorage
		 * @version 1.0
		 * @date 2013年7月10日21:11:02
		 * @example
		 * all=>$.localStorage();
		 * get=>$.localStorage("name");
		 * set=>$.localStorage("name","value");
		 * remove=>$.localStorage("name",null);
		 * clear=>$.localStorage(null);
		 *
		 * @param  {String} localStorage的key
		 * @param  {String} localStorage的value
		 * @return {*}
		 */
		localStorage: function (sKey, sValue)
		{
			if (!supports.localStorage) return;
			var A = arguments,
				AL = A.length,
				lc = win.localStorage,
				oResult = {}, i = 0,
				j = lc.length;

			// all
			if (AL === 0)
			{
				for (; i < j; i++)
				{
					oResult[lc.key(i)] = lc.getItem(lc.key(i));
				}
				return oResult;
			}
			// clear
			if (AL === 1 && sKey === null)
			{
				lc.clear();
			}
			// get
			else if (AL === 1 && _type(sKey) === "string")
			{
				return lc.getItem(sKey);
			}
			// remove
			else if (AL === 2 && sValue === null)
			{
				lc.removeItem(sKey);
			}
			// set
			else if (AL === 2 && _type(sValue) === "string")
			{
				lc.setItem(sKey, sValue);
			}
		},
		/**
		 * 获取鼠标选中的区域文本
		 * @todo 还没有做设置
		 * @version 1.0
		 * @date 2013年7月10日22:15:06
		 * @return {String} 返回选中的文本
		 */
		selection: function ()
		{
			// 高级浏览器
			if ( !! win.getSelection)
			{
				return win.getSelection().toString();
			}
			// 低级浏览器
			else if ( !! doc.getSelection)
			{
				return doc.getSelection();
			}
			// ie废材浏览器
			else
			{
				return doc.selection.createRange().text;
			}
		}
	});


	yQuery.browser = yQuery.extend(
	{}, browser, yQuery.browser);


	// 全局$
	win.$ = yQuery;


	/*=============================[ 以下是私有函数 ]============================*/

	/**
	 * 设置对象的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @param {Object} 对象
	 * @param {String} 名称
	 * @param {String} 版本号
	 * @return {undefined}
	 */
	function _setNameAndVersion(object, name, version)
	{
		object.name = name;
		object.version = version;
		object[name] = version;
	}


	/**
	 * 设置操作平台的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @param {String} 名称
	 * @param {String} 版本号
	 * @return {undefined}
	 */
	function _setPlatform(name, version)
	{
		var p = yQuery.platform;
		_setNameAndVersion(p, name, version);
	}




	/**
	 * 根据ua获取操作平台的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @return {undefined}
	 */
	function _getPlatform()
	{
		var s, ua = browser.ua;
		(s = ua.match(/windows ([\d.]+)/)) ? _setPlatform("win", _toFixedVersion(s[1])) :
			(s = ua.match(/windows nt ([\d.]+)/)) ? _setPlatform("win", _toFixedVersion(s[1])) :
			(s = ua.match(/linux ([\d.]+)/)) ? _setPlatform("linux", _toFixedVersion(s[1])) :
			(s = ua.match(/mac ([\d.]+)/)) ? _setPlatform("mac", _toFixedVersion(s[1])) :
			(s = ua.match(/ipod ([\d.]+)/)) ? _setPlatform("iPod", _toFixedVersion(s[1])) :
			(s = ua.match(/ipad[\D]*os ([\d_]+)/)) ? _setPlatform("iPad", _toFixedVersion(s[1])) :
			(s = ua.match(/iphone ([\d.]+)/)) ? _setPlatform("iPhone", _toFixedVersion(s[1])) :
			(s = ua.match(/android ([\d.]+)/)) ? _setPlatform("android", _toFixedVersion(s[1])) : 0;
	}
	_getPlatform();






	/**
	 * 设置浏览器的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @param {String} 名称
	 * @param {String} 版本号
	 * @return {undefined}
	 */
	function _setBrowser(name, version)
	{
		var b = yQuery.browser;
		_setNameAndVersion(b, name, version);
	}





	/**
	 * 根据ua获取浏览器的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @return {undefined}
	 */
	function _getBrowser()
	{
		var s, ua = browser.ua;
		(s = ua.match(/msie ([\d.]+)/)) ? _setBrowser("ie", _toFixedVersion(s[1])) :
			(s = ua.match(/firefox\/([\d.]+)/)) ? _setBrowser("firefox", _toFixedVersion(s[1])) :
			(s = ua.match(/chrome\/([\d.]+)/)) ? _setBrowser("chrome", _toFixedVersion(s[1])) :
			(s = ua.match(/opera.([\d.]+)/)) ? _setBrowser("opera", _toFixedVersion(s[1])) :
			(s = ua.match(/adobeair\/([\d.]+)/)) ? _setBrowser("adobeAir", _toFixedVersion(s[1])) :
			(s = ua.match(/version\/([\d.]+).*safari/)) ? _setBrowser("safari", _toFixedVersion(s[1])) : 0;
		(s = ua.match(/version\/([\d.]+).*mobile.*safari/)) ? browser.set("mobileSafari", toFixedVersion(s[1])) : 0;
		if (yQuery.platform.iPad) _setBrowser('mobileSafari', '0.0');
	}
	_getBrowser();






	/**
	 * 设置浏览器核心的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @param {String} 名称
	 * @param {String} 版本号
	 * @return {undefined}
	 */
	function _setBrowserEngine(name, version)
	{
		var e = yQuery.browser.engine;
		_setNameAndVersion(e, name, version);
	}





	/**
	 * 根据ua获取浏览器核心的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @return {undefined}
	 */
	function _getBrowserEngine()
	{
		var s, ua = browser.ua;
		(s = ua.match(/trident\/([\d.]+)/)) ? _setBrowserEngine("trident", _toFixedVersion(s[1])) :
			(s = ua.match(/gecko\/([\d.]+)/)) ? _setBrowserEngine("gecko", _toFixedVersion(s[1])) :
			(s = ua.match(/applewebkit\/([\d.]+)/)) ? _setBrowserEngine("webkit", _toFixedVersion(s[1])) :
			(s = ua.match(/presto\/([\d.]+)/)) ? _setBrowserEngine("presto", _toFixedVersion(s[1])) : 0;
		if (browser.ie == 6)
		{
			_setBrowserEngine("trident", _toFixedVersion("4"));
		}
		else if (browser.ie == 7 || browser.ie == 8)
		{
			_setBrowserEngine("trident", _toFixedVersion("5"));
		}
	}
	_getBrowserEngine();


	


	/**
	 * 修复获取后的版本号
	 * @version 1.0
	 * @date 2013年7月10日23:07:01
	 * @link https://github.com/AlloyTeam/JX/blob/master/src/jx.browser.js
	 * @param  {String} 版本号
	 * @param  {Number} 精度
	 * @return {Number} 版本号
	 */

	function _toFixedVersion(ver, floatLength)
	{
		ver = ("" + ver).replace(/_/g, ".");
		floatLength = floatLength || 1;
		ver = String(ver).split(".");
		ver = ver[0] + "." + (ver[1] || "0");
		ver = Number(ver).toFixed(floatLength);
		return ver;
	}



	/**
	 * 获取浏览器的flash版本
	 * @version 1.0
	 * @date 2013年7月10日23:06:17
	 * @link https://github.com/AlloyTeam/JX/blob/master/src/jx.browser.js
	 * @return {String} 版本号
	 */

	function _getBrowserFlashVersion()
	{
		var ver = 0;
		if (browser.pg && browser.pg.length)
		{
			var flash = browser.pg['Shockwave Flash'];
			if (flash && flash.description)
			{
				ver = _toFixedVersion(flash.description.match(/\b(\d+)\.\d+\b/)[1], 1) || ver;
			}
		}
		else
		{
			var startVer = 13;
			while (startVer--)
			{
				try
				{
					new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startVer);
					ver = _toFixedVersion(startVer);
					break;
				}
				catch (e)
				{}
			}
		}

		return ver;
	}



	/**
	 * 输出对象的所有key
	 * @version  1.0
	 * @date 2013年7月7日16:21:52
	 * @param  {Object} 对象
	 * @return {Array} 对象key数组
	 */

	function _getObjectKey(obj)
	{
		var i, a = [];
		for (i in obj)
		{
			a.push(i);
		}
		return a;
	}



	/**
	 * 获得对象的长度
	 * @version  1.0
	 * @date 2013年7月7日14:37:18
	 * @param  {Object} 对象
	 * @return {Number} 0+
	 */

	function _getObjectLength(obj)
	{
		if (obj.length) return obj.length;
		var i = 0,
			j;
		for (j in obj)
			i++;
		return i;
	}



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
	 * @date 2013年7月1日18:42:59
	 * @date 2013年6月28日12:39:08
	 * @param  {String} 字符串
	 * @return {Object} json对象
	 */

	function _parseJSON(string)
	{
		if (!string) return null;

		return win.JSON.parse(string);
	}



	/**
	 * JSON转换为字符串
	 * @version  1.1
	 * @date 2013年7月1日18:42:54
	 * @date 2013年6月29日23:22:15
	 * @param  {Object} JSON对象
	 * @return {String} JSON字符串
	 */

	function _stringifyJSON(json)
	{
		if (!json) return "";

		return win.JSON.stringify(json);
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
	 * @version  1.1
	 * @date 2013年7月1日18:52:12
	 * @date 2013年6月28日12:40:20
	 * @param  {String} dom字符串
	 * @return {Object} dom节点
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
		fromIndex = fromIndex === undefined ? 0 : fromIndex;

		if (_isArray(array))
		{
			return array.indexOf(elem, fromIndex);
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
	 * @version  1.1
	 * @date 2013年7月1日23:12:25
	 * @param  {Array} 数组或者类数组（有length属性）
	 * @param  {Function} 每一个元素的回调处理并返回
	 * @return {Array}
	 */

	function _map(array, callback)
	{
		var newArr = [];

		// 数组不存在 不是数组 不是回调函数
		if (!array || !_isArray(array) || !_isFunction(callback)) return array;

		// 系统有Array.map方法
		if ( !! Array.prototype.map)
		{
			return array.map(callback);
		}

		return newArr;
	}



	/**
	 * 判断对象类型，参考于jQuery源代码
	 * @version 1.1
	 * @date 2013年6月28日12:42:11
	 * @date 2013年7月1日18:08:02
	 * @param  {Object} 对象
	 * @return {String} 对象类型
	 */

	function _type(obj)
	{
		if (typeof (obj) !== "object")
			return typeof (obj);
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
	 * @param  {Object} element对象
	 * @param  {Object} 属性名称和属性值组织的JSON对象
	 * @return {undefined}
	 */

	function _setAttr(obj, oJSON)
	{
		for (var i in oJSON)
			obj.setAttribute(i, oJSON[i]);
	}



	/**
	 * 移除属性
	 * @param  {Object} element对象
	 * @param  {String} 属性名称
	 * @return {undefined}
	 */

	function _removeAttr(obj, sAttr)
	{
		obj.removeAttribute(sAttr);
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
	 * 获得node对象的className
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} 上下文
	 * @return {String} class值
	 */

	function _getClass(obj)
	{
		//
		return obj.className ? _trim(obj.className).split(/\s+/).join(" ") : "";
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
	 * 解析简单的一级选择器
	 * @version  1.0
	 * @date 2013年7月1日22:42:10
	 * @param  {String} 如 ：div#id1.class1
	 * @return {Object} 如果有就包含tag、id、class属性值
	 */

	function _parseSelector(sSelector)
	{
		var matches = sSelector.match(regTagIdClass),
			oResult = {};
		if (!matches) return null;
		if (matches[1]) oResult.tag = matches[1];
		if (matches[3]) oResult.id = matches[3];
		if (matches[5]) oResult["class"] = matches[5];
		return oResult;
	}


	/**
	 * 根据当前元素和目标条件查找符合条件元素
	 * 来源 jquery
	 * @version  1.0
	 * @date 2013年7月1日23:23:24
	 * @param  {Object} 当前元素
	 * @param  {Object} 目标条件
	 * @return {Object} 匹配元素
	 */

	function _siblingElem(cur, dir)
	{
		do {
			cur = cur[dir];
		} while (cur && cur.nodeType !== 1);

		return cur;
	}



	/**
	 * 获取元素的text
	 * @version 1.0
	 * @date 2013年7月1日18:16:55
	 * @param {Object} 元素
	 * @param {String} 字符串
	 */

	function _getText(elem, text)
	{
		return elem.innerText ?
			elem.innerText :
			elem.textContent;
	}



	/**
	 * 设置元素的text
	 * @version 1.0
	 * @date 2013年7月1日18:16:55
	 * @param {Object} 元素
	 * @param {String} 字符串
	 */

	function _setText(elem, text)
	{
		elem.innerText ?
			elem.innerText = text :
			elem.textContent = text;
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
		_e.target = e.srcElement || doc;
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
			e = _fixEvent(e || win.event);

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


	/**
	 * 特性检测
	 * @version 1.0
	 * @date 2013年7月10日21:00:22
	 * @return {Object}
	 */

	function _yQueryInit()
	{
		var scripts;
		if (!yquery.src)
		{
			// 此部分参考于 腾讯前端 jx
			// @link https://github.com/AlloyTeam/JX
			scripts = _querySelector("script");
			yquery.src = scripts[scripts.length - 1].src;
			yquery.file = yquery.src.replace(/(.*\/){0,}([^\\]+).*/ig, "$2");
			yquery.path = yquery.src.split(yquery.file)[0];
		}

		supports.localStorage = ('localStorage' in window) && window['localStorage'] !== null;
		supports.ajax = !! _newXHR();
	}
	_yQueryInit();



	/**
	 * 设置cookie
	 * @version 1.0
	 * @date 2013年7月10日21:49:38
	 * @param {String} cookie 名称
	 * @param {String} cookie 值
	 * @param {Object} cookie 其他参数
	 */

	function _setCookie(sName, sValue, oOption)
	{
		oOption = yQuery.extend(
		{}, defaults.cookie, oOption);
		var D = new Date(),
			a = [];
		D.setTime(D.getTime() + oOption.expires * 1);
		oOption.expires = D.toGMTString();
		a = [
			sName + "=" + sValue + "; ",
			oOption.expires ? "expires=" + oOption.expires + "; " : "",
			oOption.path ? "path=" + oOption.path + "; " : "",
			oOption.domain ? "domain=" + oOption.domain + "; " : ""
		];
		return doc.cookie = a.join("");
	}



	/**
	 * 获取所有cookie
	 * @version  1.0
	 * @date 2013年7月10日22:23:55
	 * @return {Object} cookie的键值对对象
	 */

	function _getCookies()
	{
		var sCookies = doc.cookie,
			aCookies = [],
			i, nPos, aTemp, oResult = {};
		aCookies = sCookies.split(";");
		for (i in aCookies)
		{
			aTemp = aCookies[i];
			nPos = aTemp.indexOf("=");
			oResult[_trim(aTemp.slice(0, nPos))] = _trim(aTemp.slice(nPos + 1));
		}
		return oResult;
	}



	/**
	 * 延迟运行函数
	 * @version 1.0
	 * @date 2013年7月6日15:48:37
	 * @param  {Function}  函数
	 * @param  {Number} 间隔事件
	 * @return {Function} a new Function
	 */

	function _delayRunFn(fn, timeout)
	{
		var timer;

		return function ()
		{
			var self = this,
				args = arguments;

			clearTimeout(timer);

			timer = setTimeout(function ()
			{
				fn.apply(self, args);
			}, timeout);
		};
	}



	/**
	 * 组织生成css3私有前缀的CSS
	 * @version  1.0
	 * @date 2013年7月7日16:21:52
	 * @param  {Object} 属性对象
	 * @param  {Number} 属性值有多个重复对象
	 * @return {Object} 组织后的属性对象
	 */

	function _css3Prefix(oJSON, nLength)
	{
		var oResult = {}, aTemp = new Array(nLength),
			i = 0;
		_each(oJSON, function (cssName, cssValue)
		{
			_each(aCss3Prefix, function (key, prefix)
			{
				for (i = 0; i < nLength; i++)
				{
					aTemp[i] = cssValue;
				}
				oResult[prefix + cssName] = aTemp.join(",");
			});
		});
		return oResult;
	}



	/**
	 * css3 animate 动画
	 * 每个元素都有一个动画队列，其data属性为 dataPrefix+"animateQueue"
	 * 在增加新的动画的时候，只需要往队列里push即可
	 * 在完成一个动画之后，清除该动画
	 * @link https://github.com/visionmedia/move.js/blob/master/move.js
	 *
	 * @version 1.1
	 * @date 2013年7月9日22:05:26
	 * @date 2013年7月7日12:43:35
	 * @param {Object} 动画元素对象
	 * @param {Object} 动画css属性对象
	 * @param {Object} 动画过渡属性对象
	 * @param {Function} 动画完成回调
	 */

	function _animate(oElem, oProperty, oTransition, fn)
	{
		// 存储动画队列data
		oTransition = yQuery.extend(
		{}, defaults.transition, oTransition);

		// 进入动画队列
		_animatePush(oElem, oProperty, oTransition, fn);

		// 执行动画
		_animateDo(oElem);
	}



	/**
	 * 执行动画队列第一个动画
	 * 并在动画完成的时候触发callback
	 *
	 * @version  1.1
	 * @date 2013年7月9日15:13:29
	 * @date 2013年7月7日12:43:35
	 * @param  {Object} 动画元素
	 * @return {undefined}
	 */

	function _animateDo(oElem)
	{
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData),
			animateNow, length, property, duration, easing, delay,
			animateStyle = {}, A = arguments;

		// 有动画队列
		if (animateQueue && animateQueue.length)
		{
			// 取第一个动画
			animateNow = animateQueue[0];

			// 如果第一个动画正在运行
			if (animateNow.animating) return;

			// 如果是一个延迟静止动画
			if ( !! animateNow.delay && _getObjectLength(animateNow) === 1)
			{
				setTimeout(function ()
				{
					// 完成清除
					_animateShift(oElem);

					// 并执行下一个动画
					A.callee(oElem);
				}, animateNow.delay);
			}
			else
			{
				// 动画执行长度
				length = animateNow.length;
				// 动画执行属性
				property = animateNow.property;
				// 动画执行时间
				duration = animateNow.duration;
				// 动画执行缓冲
				easing = animateNow.easing;
				// 动画执行延迟
				delay = animateNow.delay;

				// 样式
				animateStyle = yQuery.extend(
					_css3Prefix(
				{
					"transition-property": _getObjectKey(property).join(",")
				}, 1),
					_css3Prefix(
				{
					"transition-duration": duration + "ms",
					"transition-delay": delay + "ms",
					"transition-timing-function": css3AnimateEasing[easing]
				}, length),
					property);
				_setStyle(oElem, animateStyle);
				animateNow.animating = true;

				// 写入动画的开始时间
				animateNow.timestamp = new Date().getTime();
				animateQueue[0] = animateNow;

				// 存储该动画的属性
				_setData(oElem, animateQueueData, animateQueue);

				// 动画执行定时器
				animateNow.timer = setTimeout(function ()
				{
					// 标记完成
					animateNow.animating = false;
					animateNow.timer = 0;

					// 设置结果样式
					styleJSON = _css3Prefix(
					{
						"transition-property": "",
						"transition-duration": "",
						"transition-delay": "",
						"transition-timing-function": ""
					}, 1);
					_setStyle(oElem, styleJSON);

					// 执行回调
					animateNow.callback();

					// 完成清除
					_animateShift(oElem);

					// 并执行下一个动画
					A.callee(oElem);
				}, duration + delay);
			}
		}
	}



	/**
	 * 增加动画入队列
	 * @version  1.1
	 * @date 2013年7月9日15:14:37
	 * @date 2013年7月7日12:43:35
	 * @param  {Object} 动画的元素
	 * @param  {Object} 动画的属性和属性值组成的JSON对象
	 * @param  {Number} 动画的执行时间
	 * @return {undefined}
	 */

	function _animatePush(oElem, oProperty, oTransition, fn)
	{
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData) || _setData(oElem, animateQueueData, []),
			animateJSON = {};

		animateJSON = {
			// 动画属性
			property: oProperty,
			// 动画长度
			length: _getObjectLength(oProperty),
			// 动画执行时间
			duration: oTransition.duration,
			// 动画执行效果
			easing: oTransition.easing,
			// 动画执行延迟
			delay: oTransition.delay,
			// 动画执行完毕回调
			callback: fn,
			// 动画是否正在执行
			animating: false,
			// 动画定时器
			timer: 0
		};
		// push入队列
		animateQueue.push(animateJSON);
		// 写入data
		_setData(oElem, animateQueueData, animateQueue)
	}



	/**
	 * 删除动画队列第一个动画
	 * @version  1.0
	 * @date 2013年7月7日12:43:35
	 * @param  {Object} 动画元素
	 * @return {undefined}
	 */

	function _animateShift(oElem)
	{
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData);
		if (animateQueue && animateQueue.length)
		{
			animateQueue.shift();
			_setData(oElem, animateQueueData, animateQueue);
		}
	}



	/**
	 * 停止当前动画并执行最后的动画
	 * @version  1.0
	 * @date 2013年7月7日16:40:39
	 * @param  {Object} 元素
	 * @param  {Boolean} 是否清除动画队列
	 * @param  {Boolean} 是否立即完成动画
	 */

	function _animateStop(oElem, bClearQueue, bJumpToEnd)
	{
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData),
			i, j, animateNow, property, easing, length, callback, timer,
			styleJSON = {};

		if (animateQueue && animateQueue.length)
		{
			animateNow = animateQueue[0];
			property = animateNow.property;
			easing = animateNow.easing;
			length = animateNow.length;
			callback = animateNow.callback;
			timer = animateNow.timer;
		}

		// 清除动画队列 && 当前有动画
		if (bClearQueue && animateNow)
		{
			// 如果存在动画队列
			if (animateNow)
			{
				// 遍历动画队列
				for (i = 0, j = animateQueue.length; i < j; i++)
				{
					_animateClearTimeout(oElem, i);
				}
			}
			_setData(oElem, animateQueueData, []);
		}


		// 设置最终样式
		if (bJumpToEnd)
		{
			// 如果没有设置清除队列 => 清除当前动画和定时器 并 执行回调
			if (!bClearQueue)
			{
				_animateClearTimeout(oElem, 0);
				_animateShift(oElem);
				callback();
			}
		}
		// 设置当前样式
		else
		{
			for (i in property)
			{
				styleJSON[i] = _getStyle(oElem, i);
			}
			_setStyle(oElem, styleJSON);
			// 如果没有设置清除队列
			if (!bClearQueue && animateNow)
			{
				// 清除当前定时器
				_animateClearTimeout(oElem, 0);
				// 已经消耗的时间
				past = new Date().getTime() - animateNow.timestamp;
				// 剩余动画时间
				animateNow.duration -= past;
				animateQueue[0] = animateNow;
				_setData(oElem, animateQueueData, animateQueue);
			}
		}

		// 清除样式
		_setStyle(oElem, _css3Prefix(
		{
			"transition-property": "",
			"transition-duration": "",
			"transition-delay": "",
			"transition-timing-function": ""
		}, 1));
	}


	/**
	 * 清除元素动画队列的定时器
	 * @version 1.0
	 * @date 2013年7月9日15:25:38
	 * @param  {Object} 动画对象
	 * @param  {Number} 动画队列索引
	 * @return {undefined}
	 */

	function _animateClearTimeout(oElem, index)
	{
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData);
		// 如果有定时器 => 清除定时器
		if (animateQueue[index].timer)
		{
			// 停止计时器
			clearTimeout(animateQueue[index].timer);
			// 清空计时器
			animateQueue[index].timer = 0;
			// 标记动画暂停
			animateQueue[index].animating = false;
		}
	}



	/**
	 * 给元素的当前动画之后添加一个延时
	 * @version 1.0
	 * @date 2013年7月9日21:37:04
	 * @param {Object} 动画元素对象
	 * @param {Number} 延迟的时间
	 * @return {undefined}
	 */

	function _animateDelay(oElem, nTime)
	{
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData) || _setData(oElem, animateQueueData, []),
			animateJSON = {
				delay: nTime
			};

		// push入队列
		animateQueue.push(animateJSON);
		// 写入data
		_setData(oElem, animateQueueData, animateQueue)
	}



	/**
	 * 选择器选用mini.js
	 * @version 1.0
	 * @date 2013年7月1日17:24:53
	 * @core 0.01(beta)
	 * @link https://github.com/padolsey/mini/blob/master/mini.js
	 */

	function _querySelector(selector, context)
	{

		var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
			exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
			exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
			exprNodeName = /^([\w\*\-_]+)/,
			na = [null, null];

		function _find(selector, context)
		{

			/**
			 * This is what you call via x()
			 * Starts everything off...
			 */

			context = context || doc;

			var simple = /^[\w\-_#]+$/.test(selector);

			if (!simple && context.querySelectorAll)
			{
				return realArray(context.querySelectorAll(selector));
			}

			if (selector.indexOf(',') > -1)
			{
				var split = selector.split(/,/g),
					ret = [],
					sIndex = 0,
					len = split.length;
				for (; sIndex < len; ++sIndex)
				{
					ret = ret.concat(_find(split[sIndex], context));
				}
				return unique(ret);
			}

			var parts = selector.match(snack),
				part = parts.pop(),
				id = (part.match(exprId) || na)[1],
				className = !id && (part.match(exprClassName) || na)[1],
				nodeName = !id && (part.match(exprNodeName) || na)[1],
				collection;

			if (className && !nodeName && context.getElementsByClassName)
			{

				collection = realArray(context.getElementsByClassName(className));

			}
			else
			{

				collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));

				if (className)
				{
					collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
				}

				if (id)
				{
					var byId = context.getElementById(id);
					return byId ? [byId] : [];
				}
			}

			return parts[0] && collection[0] ? filterParents(parts, collection) : collection;

		}

		function realArray(c)
		{

			/**
			 * Transforms a node collection into
			 * a real array
			 */

			try
			{
				return Array.prototype.slice.call(c);
			}
			catch (e)
			{
				var ret = [],
					i = 0,
					len = c.length;
				for (; i < len; ++i)
				{
					ret[i] = c[i];
				}
				return ret;
			}

		}

		function filterParents(selectorParts, collection, direct)
		{

			/**
			 * This is where the magic happens.
			 * Parents are stepped through (upwards) to
			 * see if they comply with the selector.
			 */

			var parentSelector = selectorParts.pop();

			if (parentSelector === '>')
			{
				return filterParents(selectorParts, collection, true);
			}

			var ret = [],
				r = -1,
				id = (parentSelector.match(exprId) || na)[1],
				className = !id && (parentSelector.match(exprClassName) || na)[1],
				nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
				cIndex = -1,
				node, parent,
				matches;

			nodeName = nodeName && nodeName.toLowerCase();

			while ((node = collection[++cIndex]))
			{

				parent = node.parentNode;

				do {

					matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
					matches = matches && (!id || parent.id === id);
					matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));

					if (direct || matches)
					{
						break;
					}

				} while ((parent = parent.parentNode));

				if (matches)
				{
					ret[++r] = node;
				}
			}

			return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;

		}


		var unique = (function ()
		{

			var uid = +new Date();

			var data = (function ()
			{

				var n = 1;

				return function (elem)
				{

					var cacheIndex = elem[uid],
						nextCacheIndex = n++;

					if (!cacheIndex)
					{
						elem[uid] = nextCacheIndex;
						return true;
					}

					return false;

				};

			})();

			return function (arr)
			{

				/**
				 * Returns a unique array
				 */

				var length = arr.length,
					ret = [],
					r = -1,
					i = 0,
					item;

				for (; i < length; ++i)
				{
					item = arr[i];
					if (data(item))
					{
						ret[++r] = item;
					}
				}

				uid += 1;

				return ret;

			};

		})();

		function filterByAttr(collection, attr, regex)
		{

			/**
			 * Filters a collection by an attribute.
			 */

			var i = -1,
				node, r = -1,
				ret = [];

			while ((node = collection[++i]))
			{
				if (regex.test(node[attr]))
				{
					ret[++r] = node;
				}
			}

			return ret;
		}

		return _find(selector, context);

	}


	// end
})(this);