/*!
 * 云淡然的yQuery
 * @author 云淡然 http://qianduanblog.com
 * @version 1.3
 * 2013年9月19日17:50:53
 */

(function (win, undefined) {
	var
	yquery = {
		version: "1.3",
		time: "2013年9月10日22:57:10",
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
		// 行内标签
		inlineTag = /^span|a|small|strong|b|i$/i,
		// 是否邮箱正则
		regEmail = /^[\w!\#\$%&'*+\/=?^`{|}~.\-]+@([\da-z](-[\da-z])?)+(\.{1,2}[a-z]+)+$/i,
		// 是否URL正则
		regUrl = /^(https?:\/\/)?(\w(\:\w)?@)?([0-9a-z_-]+\.)*?([a-z0-9-]+\.[a-z]{2,6}(\.[a-z]{2})?(\:[0-9]{2,6})?)((\/[^?#<>\/\\*":]*)+(\?[^#]*)?(#.*)?)?$/i,
		// 需要额外计算的样式
		styleExtraType = {
			"inner": ["padding"],
			"outer": ["padding", "border"]
		},
		styleExtraName = {
			"Width": ["Left", "Right"],
			"Height": ["Top", "Bottom"]
		},
		// 事件数组
		normalEventArr = "blur focus focusin focusout load unload click dblclick mousedown mouseup mousemove mouseover mouseout change select submit keydown keypress keyup error contextmenu hashchange dragenter dragover dragleave drop dragstart drag dragend beforeunload popstate input".split(" "),
		delayEventArr = ["scroll", "resize"],
		// 布尔值的属性 property
		regBooleanAttr = /^checked|selected|autofocus|autoplay|async|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped$/i,
		// 修复部分attr
		fixAttr = {
			"class": "className",
			"for": "htmlFor"
		},
		// 空函数
		emptyFn = function () {},
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
			transition: {
				easing: "in-out",
				duration: 500,
				delay: 0
			},
			// ajax默认参数
			ajax: {
				url: location.href,
				charset: "utf-8",
				username: "",
				password: "",
				type: "get",
				data: "",
				dataType: "json",
				onsuccess: emptyFn,
				onerror: emptyFn
			},
			// 获取图片默认参数
			getImage: {
				src: "",
				onready: emptyFn,
				onsuccess: emptyFn,
				onerror: emptyFn
			},
			// cookie默认参数
			cookie: {
				// 因为设置空domain才能在本地正常写入
				domain: "",
				// 默认cookie有效期1个小时
				expires: 3600000,
				// 默认cookie存储路径
				path: "/"
			},
			// 桌面通知默认参数
			notification: {
				tag: "",
				icon: "http://w.qhimg.com/images/v2/360se/2012/06/14/360ee.png",
				title: "通知标题",
				content: "通知内容",
				ondisplay: emptyFn,
				onshow: emptyFn,
				onclose: emptyFn,
				onclick: emptyFn,
				onerror: emptyFn
			},
			// 定位的默认参数
			geolocation: {
				onsuccess: emptyFn,
				onerror: emptyFn,
				options: {}
			}
		},
		support = {
			xpath: !! (doc.evaluate),
			air: !! (win.runtime),
			query: !! (doc.querySelector)
		},
		browser = {
			pf: navigator.platform.toLowerCase(),
			ua: navigator.userAgent.toLowerCase(),
			pg: navigator.plugins
		},
		ie = (function () {
			var v = 3,
				div = doc.createElement('div'),
				a = div.all || [];
			while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><br><![endif]-->', a[0]);
			return v > 4 ? v : 0;
		}()),
		Notification = win.webkitNotifications,
		Geolocation = win.navigator.geolocation;



	function yQuery(vArg) {
		return new yQuery.fn.init(vArg);
	}



	/*================================[ 原型 ]=================================*/
	yQuery.fn = yQuery.prototype = {
		constructor: yQuery,
		/**
		 * 构造初始化
		 * @version 1.3
		 * @date 2013年7月1日18:45:16
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @date 2013年6月28日9:06:59
		 * @param  {String / Object / Function}
		 * @return {Array / Array / undefined}
		 */
		init: function (vArg) {

			var nodes;
			switch (typeof vArg) {
				// 字符串
			case "string":
				// dom字符串
				if (regTagElem.test(vArg)) {
					nodes = _stringToNode(vArg);
				}
				// 选择器字符串
				else {
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
				if (vArg === win) {
					nodes = win;
				}
				// document 对象
				else if (vArg === doc) {
					nodes = doc;
				}
				// 这里先必须判断是否节点，因为form节点对象是个数组，并且也有length属性
				// 2013年8月25日17:06:20 注
				// 节点
				else if (vArg && !! vArg.nodeType && vArg.nodeType === 1) {
					nodes = [];
					nodes.push(vArg);
				}
				// 是nodeArray
				else if (vArg && !! vArg.length) {
					nodes = vArg;
				} else {
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
		 * @version  1.1
		 * @date 2013年7月24日23:42:29
		 * @date 2013年7月7日16:30:28
		 * @param  {Object} 目标的css样式
		 * @param  {Object} 动画属性参数
		 * @param  {Object} 动画执行参数
		 * @param  {Function} 执行完成回调
		 * @return {Object} this
		 */
		animate: function (oProperty, oTransition, fn) {
			var self = this,
				i = 0,
				j = this.length;

			if (!_isFunction(fn)) fn = emptyFn;

			if (_type(oTransition) == "number") {
				i = oTransition;
				oTransition = {};
				oTransition.duration = i;
			} else if (oTransition === undefined) {
				oTransition = {};
				oTransition.duration = 0;
			}

			i = 0;
			return this.each(function () {
				_animate(this, oProperty, oTransition, function () {
					i++;
					// 只触发一次回调
					if (i === j) fn.call(self);
				});
			});
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
		fadeTo: function (nOpacity, oTransition, fn) {
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
		rotate: function (nDeg, oTransition, fn) {
			var oProperty = _css3Prefix({
				"transform": "rotate(" + nDeg + "deg)"
			}, 1);

			return this.animate(oProperty, oTransition, fn);
		},
		/**
		 * 停止停止当前动画并执行最后的动画动画
		 * @version  1.1
		 * @date 2013年7月24日23:42:29
		 * @date 2013年7月7日16:40:39
		 * @param  {Boolean} 是否清除动画队列
		 * @param  {Boolean} 是否立即完成动画
		 * @return {Object} this
		 */
		stop: function (bClearQueue, bJumpToEnd) {
			var A = arguments,
				AL = A.length,
				_bClearQueue, _bJumpToEnd;
			if (AL == 0) {
				_bClearQueue = false;
				_bJumpToEnd = false;
			} else if (AL == 1) {
				_bClearQueue = !! A[0];
				_bJumpToEnd = false;
			} else {
				_bClearQueue = !! bClearQueue;
				_bJumpToEnd = !! bJumpToEnd;
			}

			return this.each(function () {
				_animateStop(this, _bClearQueue, _bJumpToEnd);
			});
		},
		/**
		 * 将停止的动画继续运行
		 * @version  1.1
		 * @date 2013年7月24日23:42:29
		 * @date 2013年7月7日17:23:06
		 * @return {Object} this
		 */
		goOn: function () {
			return this.each(function () {
				_animateDo(this);
			});
		},
		/**
		 * 延迟一段时间并进行下一个动画
		 * @version  1.1
		 * @date 2013年7月24日23:42:29
		 * @date 2013年7月9日21:31:44
		 * @param  {Number} 延迟时间
		 * @return {Object} this
		 */
		delay: function (nTime) {
			// 在对象的动画队列添加一个延迟静止动画
			return this.each(function () {
				_animateDelay(this, nTime);
			});
		},
		/**
		 * 返回一个由原数组中的每个元素调用一个指定方法后的返回值组成的新数组
		 * @link https://developer.mozilla.org/zh-CN/docs/JavaScript/Reference/Global_Objects/Array/map
		 * @version 1.2
		 * @date 2013年7月24日23:43:03
		 * @date 2013年7月21日16:54:28
		 * @date 2013年6月28日14:54:50
		 * @param  {Function} 回调处理函数
		 * @return {Object} yQuery的数组对象
		 */
		map: function (fn) {
			var arr = [];

			this.each(function () {
				arr.push(this);
			});

			return _map(arr, function (elem, index) {
				return fn.call(elem, elem, index, arr);
			});
		},
		/**
		 * 循环遍历this，并执行回调
		 * @version  1.1
		 * @date 2013年7月1日19:03:00
		 * @date 2013年6月29日17:26:56
		 * @param  {Function} 遍历回调函数
		 * @return {Object} yQuery
		 */
		each: function (fn) {
			var arr = [],
				i = 0,
				j = this.length;
			for (; i < j; i++) {
				arr.push(this[i]);
			}

			_each(arr, function (index, elem) {
				fn.call(elem, index, elem);
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
		eq: function (index) {
			// 元素长度
			var len = this.length;

			// 如果超过长度
			if (index + 1 > len) return this;

			// 重新包装node对象成类数组
			return yQuery(this[index]);
		},
		/**
		 * 获取第1个元素
		 * @version  1.0
		 * @date 2013年7月1日22:58:26
		 * @return {Object}
		 */
		first: function () {
			return this.length?yQuery(this[0]):yQuery([]);
		},
		/**
		 * 获取最后一个元素
		 * @version  1.0
		 * @date 2013年7月1日22:58:26
		 * @return {Object}
		 */
		last: function () {
			return this.length?yQuery(this[this.length - 1]):yQuery([]);
		},
		/**
		 * 返回元素的个数
		 * @version  1.0
		 * @date 2013年6月27日16:09:03
		 * @return {元素个数} 如果存在返回1+，不存在返回0
		 */
		length: function () {
			return this?this.length:0;
		},
		/**
		 * 查找子元素
		 * @version  1.1
		 * @date 2013年7月21日23:27:54
		 * @date 2013年6月27日16:09:03
		 * @param  基本选择器
		 * @return {Object} find this
		 */
		find: function (sSelector) {
			var aFind, aResult;

			this.each(function () {
				aFind = _querySelector(sSelector, this);
				aResult = aResult ? _merge(aResult, aFind) : aFind;

			});
			return yQuery(aResult);;
		},
		/**
		 * 获得元素相邻的下一个元素
		 * @version  1.0
		 * @date 2013年7月1日23:20:23
		 * @return {Object}
		 */
		next: function () {
			return yQuery(_siblingElem(this[0], "nextSibling"));
		},
		/**
		 * 获得元素相邻的上一个元素
		 * @version  1.0
		 * @date 2013年7月1日23:20:23
		 * @return {Object}
		 */
		prev: function () {
			return yQuery(_siblingElem(this[0], "previousSibling"));
		},
		/**
		 * 查找第一个匹配元素的所有兄弟元素
		 * @version  1.1
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @return yQuery
		 */
		siblings: function () {
			// 所有兄弟包含自己的元素集合
			var aBrother = this[0].parentNode.children,
				i = 0,
				j = aBrother.length,
				aResult = [];

			// 循环遍历
			for (; i < j; i++) {
				if (this[0] !== aBrother[i]) {
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
		closest: function (sSelector) {
			var json = _parseSelector(sSelector),
				elem = this[0],
				oParent = elem,
				find = false;
			if (!elem) return null;
			while (!find) {
				if (oParent.nodeType === 9) break;
				if (oParent.nodeType !== 1) continue;
				if (
					// 标签
					(!json.tag || _nodeName(oParent, json.tag))
					// id
					&& (!json.id || _getAttr(oParent, "id") === json.id)
					// class
					&& (!json["class"] || _hasClass(oParent, json["class"]))
				) {
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
		parent: function (sSelector) {
			var json = _parseSelector(sSelector),
				elem = this[0],
				oParent = elem,
				find = false;
			if (!elem) return null;
			while (!find) {
				oParent = oParent.parentNode;
				if (oParent.nodeType === 9) break;
				if (oParent.nodeType !== 1) continue;
				if (
					(!json.tag || _nodeName(oParent, json.tag)) && (!json.id || _getAttr(oParent, "id") === json.id) && (!json["class"] || _hasClass(oParent, "class") === json["class"])) {
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
		parents: function (sSelector) {
			var json = _parseSelector(sSelector),
				elem = this[0],
				oParent = elem,
				aResult = [];
			if (!elem) return null;
			while (oParent.nodeType !== 9) {
				oParent = oParent.parentNode;
				if (oParent.nodeType !== 1) continue;
				if (
					(!json.tag || _nodeName(oParent, json.tag)) && (!json.id || _getAttr(oParent, "id") === json.id) && (!json["class"] || _hasClass(oParent, "class") === json["class"])) {
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
		index: function (sTagName) {
			sTagName = (sTagName || "").toUpperCase();

			// 所有兄弟包含自己的元素集合
			var aBrother = this[0].parentNode.children,
				i = 0,
				j = aBrother.length,
				the = this[0];

			// 循环遍历
			for (; i < j; i++) {
				if (sTagName) {
					if (aBrother[i] == the && aBrother[i].nodeName == sTagName) {
						return i;
					}
				} else {
					if (aBrother[i] == the) {
						return i;
					}
				}
			}
			return -1;
		},
		/**
		 * 事件绑定
		 * @version  1.2
		 * @date 2013年7月25日0:52:18
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @param  {string} 要绑定的事件类型，多个事件以空格分开
		 * @param  {Function} 要绑定的事件
		 * @return undefined
		 */
		bind: function (sType, fn) {
			var aType = _trim(sType).split(/\s+/),
				i = 0,
				j = aType.length;

			return this.each(function () {
				for (i = 0; i < j; i++) {
					_bind(this, aType[i], fn);
				}
			});
		},
		/**
		 * 事件取消绑定，仍需改进
		 * @version 1.2
		 * @date 2013年7月25日0:52:25
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:09:03
		 * @param  {string} 事件类型
		 * @return undefined
		 */
		unbind: function (sType) {
			return this.each(function () {
				_unbind(this, sType);
			});
		},
		/**
		 * 事件触发
		 * @version 1.1
		 * @date 2013年7月25日0:53:38
		 * @date 2013年6月29日1:35:08
		 * @link http://stylechen.com/wp-content/uploads/demo/trigger/event.js
		 * @param {String} 事件类型
		 * @param {Array} 触发传递的参数
		 * @return this
		 */
		trigger: function (sType, aData) {
			aData = _isArray(aData) ? aData : [aData];

			return this.each(function () {
				_eventTrigger(this, sType, aData);
			});
		},
		/**
		 * 动态事件绑定
		 * @version 1.1
		 * @date 2013年7月25日1:01:32
		 * @date 2013年6月29日14:29:14
		 * @link http://easyjs.org/docs/core/event/on.html
		 * @param  {String} 单个事件类型
		 * @param  {String} 1级选择器
		 * @param  {Function} 执行函数
		 * @return {Object} this
		 */
		on: function (sType, sSelector, fn) {
			var yTarget,
				self = this,
				i = 0,
				j = 0,
				originalFn,
				key = dataPrefix + sType + "on" + sSelector,
				data;

			return this.each(function () {
				originalFn = function (e) {
					e = _fixEvent(e || win.event);

					yTarget = yQuery(self).find(sSelector);
					j = yTarget.length;

					for (i = 0; i < j; i++) {
						if (e.target === yTarget[i]) {
							if (fn.call(yTarget[i], e) === false) {
								e.returnValue = false;
								e.cancelBubble = true;
							}
						}
					}
				}
				_bind(this, sType, originalFn);
				// 保存动态事件绑定的函数指针
				data = _getData(this, key) || _setData(this, key, []);
				data.push(originalFn);
				_setData(this, key, data);
			});
		},
		/**
		 * 取消动态事件绑定
		 * @version 1.1
		 * @date 2013年7月25日1:01:32
		 * @date 2013年6月29日14:29:14
		 * @param  {String} 单个事件类型
		 * @param  {String} 1级选择器
		 * @return {Object} this
		 */
		off: function (sType, sSelector) {
			var key = dataPrefix + sType + "on" + sSelector,
				data,
				originalFn;

			return this.each(function () {
				// 获得每个函数指针
				data = _getData(this, key);
				if (data && data.length) {
					// 出栈第0个
					originalFn = data.shift();
					_setData(this, key, data);
					_unbind(this, sType, originalFn);
				}
			});
		},
		/**
		 * 鼠标滚轮事件
		 * @version  1.0
		 * @date 2013年7月4日22:37:31
		 * @link http://help.dottoro.com/ljmracjb.php
		 * @param  {Function} fn [description]
		 * @return {Object} this
		 */
		mousewheel: function (fn) {
			function originalFn(e) {
				e = _fixEvent(e);
				if ("wheelDelta" in e) {
					rolled = e.wheelDelta;
				} else {
					rolled = -40 * event.detail;
				}
				fn(e, rolled);
			}
			this.bind("mousewheel", _delayRunFn(originalFn, 100));
			this.bind("DOMMouseScroll", _delayRunFn(originalFn, 100));
		},
		/**
		 * 读取 和 设置 style css
		 * @version  1.2
		 * @date 2013年7月25日1:01:19
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:16:01
		 * @param  {String} 读取
		 * @param  {String+String} 设置
		 * @param  {Object} 设置
		 * @return style值 或者 yQuery
		 */
		css: function () {
			var A = arguments,
				L = A.length,
				A0 = A[0],
				A1 = A[1],
				json = {};

			if (L == 1 && _type(A0) === "string") {
				return _getStyle(this[0], A0);
			}

			L == 1 ? json = A0 : json[A0] = A1;

			return this.each(function () {
				_setStyle(this, json);
			});
		},
		/**
		 * 读取 和 设置 attribute
		 * @version  1.3
		 * @date 2013年7月25日1:02:05
		 * @date 2013年7月14日17:31:48
		 * @date 2013年6月27日2:03:15
		 * @date 2013年6月27日16:17:01
		 * @param {String or Object} string 或者 json对象
		 * @param {String} string
		 * @return {String or Object} 属性值 或 yQuery
		 */
		attr: function (sAttrName, sAttrValue) {
			var json = {};

			if (_type(sAttrName) === "string" && sAttrValue === undefined) {
				return _getAttr(this[0], sAttrName);
			}

			_type(sAttrName) === "string" ? json[sAttrName] = sAttrValue : json = sAttrName;

			return this.each(function () {
				_setAttr(this, json);
			});
		},
		/**
		 * 移除属性
		 * @version  1.1
		 * @date 2013年7月25日1:05:57
		 * @date 2013年7月6日23:29:36
		 * @param  {String} 属性值
		 * @return {Object} this
		 */
		removeAttr: function (sAttrName) {
			return this.each(function () {
				_removeAttr(this, sAttrName);
			});
		},
		/**
		 * 设置元素的value属性
		 * @version  1.1
		 * @date 2013年7月25日1:05:52
		 * @date 2013年7月6日23:29:36
		 * @param  {String} 属性值
		 * @return {*}
		 */
		val: function (sValue) {
			if (sValue === undefined) {
				return _getAttr(this[0], "value", true);
			} else {
				return this.each(function () {
					_setAttr(this, {
						"value": sValue
					}, true);
				});
			}
		},
		/**
		 * 设置元素的布尔属性值
		 * @version  1.1
		 * @date 2013年7月25日1:05:47
		 * @date 2013年7月6日23:29:36
		 * @param  {String} 布尔属性
		 * @param  {Boolean} 布尔值
		 * @return {Object} this
		 */
		prop: function (sPropName, bPropValue) {
			var elem = this[0],
				json = {};

			// 属于布尔属性
			if (sPropName && regBooleanAttr.test(sPropName)) {
				// get
				if (bPropValue === undefined) {
					return !!_getAttr(elem, sPropName, true);
				}
				// set
				else {
					json[sPropName] = !! bPropValue;
					return this.each(function () {
						_setAttr(this, json, true);
					});
				}
			} else {
				return this.attr(arguments);
			}
		},
		/**
		 * 过滤集合并返回新的集合
		 * @version 1.1
		 * @date 2013年7月25日1:06:14
		 * @date 2013年7月15日20:37:20
		 * @param  {Function} 过滤函数
		 * @return {Object} this
		 */
		filter: function (fn) {
			if (!_isFunction(fn)) fn = emptyFn;
			var aResult = [];

			// 遍历当前元素集合
			this.each(function () {
				if (fn.call(this)) aResult.push(this);
			});

			return yQuery(aResult);
		},
		/**
		 * 在现有的yquery对象里增加新的成员
		 * 并返回合并后的成员yquery对象
		 * 但不保证是否有重复的成员
		 * 并且也不会改变原有的yquery对象
		 * @param {Object} 节点对象或yquery对象
		 * @return {Object} this
		 */
		add: function (obj) {
			return _merge(this, yQuery(obj));
		},
		/**
		 * 读取 存储 data
		 * @version 1.1
		 * @date 2013年7月25日1:06:14
		 * @date 2013年7月15日20:37:20
		 * @param {String} 读取
		 * @param {Object} 存储
		 * @param {String+*} 存储
		 * @return {*}
		 */
		data: function () {
			var A = arguments,
				L = A.length,
				A0 = A[0],
				A1 = A[1],
				k,
				json = {};

			if (L == 1 && _type(A0) == "string") {
				return _getData(this[0], A0);
			} else {
				L == 1 ? json = A0 : json[A0] = A1;
				return this.each(function () {
					for (k in json) {
						_setData(this, k, json[k]);
					}
				});
			}
		},
		/**
		 * 是否包含该 className
		 * @version  1.0
		 * @date 2013年6月27日16:17:01
		 * @param  {string} 单个class值
		 * @return {boolean} 如果包含则返回true，否则返回false
		 */
		hasClass: function (sClass) {
			return _hasClass(this[0], sClass);
		},
		/**
		 * 添加 className
		 * @version  1.1
		 * @date 2013年7月25日1:08:52
		 * @date 2013年6月27日16:17:01
		 * @param  {string} 单个 class 值
		 * @return yQuery
		 */
		addClass: function (sClass) {
			return this.each(function () {
				_addClass(this, sClass);
			});
		},
		/**
		 * 移除 className
		 * @version  1.1
		 * @date 2013年7月25日1:11:03
		 * @date 2013年6月27日2:03:15
		 * @param  {string} 单个 class 值
		 * @return yQuery
		 */
		removeClass: function (sClass) {
			var aClass = sClass ? _trim(sClass).split(/\s+/) : []
			i = 0,
				j = aClass.length;

			return this.each(function () {
				if (j) {
					for (i = 0; i < j; i++) {
						_removeClass(this, aClass[i]);
					}
				} else {
					_clearClass(this);
				}
			});
		},
		/**
		 * 在父对象内部追加子对象
		 * @version 1.3
		 * @date 2013年7月21日21:56:05
		 * @date 2013年7月6日16:20:20
		 * @date 2013年6月27日16:22:10
		 * @date 2013年6月26日14:54:23
		 * @param  {String or Object} DOM对象、yQuery对象、选择器、DOM字符串
		 * @return {Object} 父对象
		 */
		append: function (vArg) {
			var yChild = _isYQuery(vArg) ? vArg : yQuery(vArg);

			return this.each(function (index, elem) {
				yChild.each(function (i, c) {
					elem.appendChild(!index ? c : c.cloneNode(true));
				});
			});
		},
		/**
		 * 在父对象内部前置子对象
		 * @version 1.3
		 * @date 2013年7月21日21:56:05
		 * @date 2013年7月6日16:43:02
		 * @date 2013年6月27日16:22:10
		 * @date 2013年6月26日14:54:23
		 * @param  {String or Object} DOM对象、yQuery对象、选择器、DOM字符串
		 * @return {Object} 父对象
		 */
		prepend: function (vArg) {
			var yChild = _isYQuery(vArg) ? vArg : yQuery(vArg);
			yChild = _reverse(yChild);

			return this.each(function (index, elem) {
				yChild.each(function (i, c) {
					elem.insertBefore(!index ? c : c.cloneNode(true), elem.firstChild);
				});
			});
		},
		/**
		 * 在目标对象前邻近添加对象
		 * @version 1.3
		 * @date 2013年7月21日21:56:05
		 * @date 2013年7月6日16:56:47
		 * @date 2013年6月27日0:55:10
		 * @date 2013年6月26日15:01:02
		 * @param  {String or Object} DOM对象、yQuery对象、选择器、DOM字符串
		 * @return {Object} 目标对象
		 */
		before: function (vArg) {
			var yChild = _isYQuery(vArg) ? vArg : yQuery(vArg);

			return this.each(function (index, elem) {
				yChild.each(function (i, c) {
					elem.parentNode.insertBefore(!index ? c : c.cloneNode(true), elem);
				});
			});
		},
		/**
		 * 在目标对象后邻近添加对象
		 * @version 1.3
		 * @date 2013年7月21日21:56:05
		 * @date 2013年7月6日16:59:10
		 * @date 2013年6月27日16:29:43
		 * @date 2013年6月26日15:01:12
		 * @param  {String or Object} DOM对象、yQuery对象、选择器、DOM字符串
		 * @return {Object} 目标对象
		 */
		after: function (vArg) {
			var yChild = _isYQuery(vArg) ? vArg : yQuery(vArg);
			yChild = _reverse(yChild);

			return this.each(function (index, elem) {
				yChild.each(function (i, c) {
					elem.parentNode.insertBefore(!index ? c : c.cloneNode(true), elem.nextSibling);
				});
			});
		},
		/**
		 * 清空节点内容
		 * @version 1.1
		 * @date 2013年7月25日1:12:24
		 * @date 2013年6月28日14:29:26
		 * @return {Object} this
		 */
		empty: function () {
			return this.each(function () {
				while (this.firstChild) {
					this.removeChild(this.firstChild);
				}
			});
		},
		/**
		 * 克隆对象
		 * @version 1.1
		 * @date 2013年7月25日1:14:13
		 * @date 2013年7月21日16:09:10
		 * @param {Boolean} 是否克隆子节点
		 * @return {Object} 克隆对象的yQuery对象
		 */
		clone: function (bCloneChildren) {
			if (bCloneChildren === undefined) bCloneChildren = true;
			bCloneChildren = !! bCloneChildren;
			var aClone = [];
			this.each(function () {
				aClone.push(this.cloneNode(bCloneChildren));
			});
			return yQuery(aClone);
		},
		/**
		 * 移除文档节点
		 * @version  1.1
		 * @date 2013年7月25日1:14:42
		 * @date 2013年6月28日16:53:28
		 * @return {Object} this
		 */
		remove: function () {
			return this.each(function () {
				if (this.parentNode) {
					this.parentNode.removeChild(this);
				}
			});
		},
		/**
		 * 获取 或者 设置节点的innerHTML
		 * @version  1.2
		 * @date 2013年7月25日1:16:25
		 * @date 2013年7月1日18:20:06
		 * @date 2013年6月28日14:16:59
		 * @param  {String} 字符串
		 * @return {String or Object}
		 */
		html: function (sHtml) {
			if (!arguments.length) {
				return this[0].innerHTML;
			}

			return this.each(function () {
				this.innerHTML = sHtml;
			});
		},
		/**
		 * 获取 或者 设置节点的outerHTML
		 * 设置的时候相当于jQuery的replaceWith
		 * @version  1.1
		 * @date 2013年7月25日1:16:50
		 * @date 2013年6月28日16:41:35
		 * @param {String}
		 * @return {String or Object}
		 */
		outerHtml: function (sHtml) {
			if (!arguments.length) {
				return this[0].outerHTML;
			}

			return this.each(function () {
				this.outerHTML = sHtml;
			});
		},
		/**
		 * 读取 或者 设置 节点的纯文本
		 * @version  1.2
		 * @date 2013年7月25日1:18:15
		 * @date 2013年7月1日18:20:17
		 * @date 2013年6月30日0:02:36
		 * @param  {String} 纯文本
		 * @return {String or Object}
		 */
		text: function (sText) {
			var sReslut = "";
			if (!arguments.length) {
				this.each(function () {
					sReslut += _getText(this);
				});

				return sReslut;
			}

			return this.each(function () {
				_setText(this, sText);
			});
		},
		/**
		 * 查找匹配元素内部所有的子节点（包括文本节点）
		 * 如果元素是一个iframe，则查找文档内容
		 * @version  1.2
		 * @date 2013年7月25日1:19:11
		 * @date 2013年7月19日15:55:42
		 * @date 2013年6月28日16:38:54
		 * @return {Object} 文档节点的yQuery对象
		 */
		contents: function () {
			var arr = [];

			this.each(function () {
				arr.push(_nodeName(this, "iframe") ? this.contentDocument || this.contentWindow.document : this.children);
			});

			return yQuery(arr);
		},
		/**
		 * 获得元素相对当前窗口的位移
		 * @version 1.0
		 * @date 2013年6月29日21:58:32
		 * @return {Object} 包含top、left属性
		 */
		offset: function () {
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
			if ( !! elem.getBoundingClientRect) {
				base = elem.getBoundingClientRect();
			}

			return {
				top: base.top + (win.pageYOffset || elemE.scrollTop) - (elemE.clientTop || 0),
				left: base.left + (win.pageXOffset || elemE.scrollLeft) - (elemE.clientLeft || 0)
			};
		},
		/**
		 * 获得元素相对于最近定位元素的位移
		 * @version  1.0
		 * @date 2013年6月29日23:14:22
		 * @return {Object} 包含top、left属性
		 */
		position: function () {
			var offsetParent, offset,
				parentOffset = {
					top: 0,
					left: 0
				},
				elem = this[0],
				find, oParent;

			// 固定元素是相对于document定位的
			if (_getStyle(elem, "position") === "fixed") {
				offset = elem.getBoundingClientRect();
			} else {
				// 获得相对定位元素，最大的是body
				offsetParent = elem.offsetParent;

				// 如果不支持offsetParent属性，则循环逐级寻找
				if (!offsetParent) {
					find = false;
					oParent = elem;
					while (!find) {
						if (oParent.nodeType === 9) break;
						if (oParent.nodeType !== 1) continue;
						if (_getStyle(oParent, "position") !== "static") {
							offsetParent = oParent;
							find = true;
						}
						oParent = oParent.parentNode;
					}
					if (!find) offsetParent = doc;
				}

				// 获得offset属性对象值
				offset = this.offset();

				if (!_nodeName(elem, "html")) {
					parentOffset = yQuery(offsetParent).offset();
				}

				parentOffset.top += _getStyle(offsetParent, "borderTopWidth", true);
				parentOffset.left += _getStyle(offsetParent, "borderLeftWidth", true);
			}

			return {
				top: offset.top - parentOffset.top - _getStyle(elem, "marginTop", true),
				left: offset.left - parentOffset.left - _getStyle(elem, "marginLeft", true)
			};
		},
		/**
		 * 获得及操作输入框文字的位置
		 * @version  1.0
		 * @date 2013年7月13日19:04:17
		 * @return {*}
		 */
		selection: function () {
			var elem = this[0];
			if (!_nodeName(elem, "input") && !_nodeName(elem, "textarea")) return;
			return {
				/**
				 * 获取选中文字的开始位置
				 * @version 1.0
				 * @date 2013年7月13日19:04:17
				 * @return {Number}
				 */
				selectionStart: _getSelectionPosition(elem, 0),
				/**
				 * 获取选中文字的结束位置
				 * @version 1.0
				 * @date 2013年7月13日19:04:17
				 * @return {Number}
				 */
				selectionEnd: _getSelectionPosition(elem, 1),
				/**
				 * 获取选中文字的文本内容
				 * @version 1.0
				 * @date 2013年7月13日19:04:17
				 * @return {Number}
				 */
				selectionValue: _getSelectionValue(elem),
				/**
				 * 选中指定位置或字符串的字符串
				 * @param  {Number / String} 起始位置之后（含） 或 选中的字符串
				 * @param  {Number} 末尾位置之前（不含）
				 * @return {String} 选中的文字
				 */
				select: function (start, end) {
					var val = elem.value,
						len = val.length,
						string = "",
						temp;

					// 1个参数：字符串
					if (_type(start) === "string") {
						string = start;
						start = val.indexOf(string);
						return start != -1 ? _setSelection(elem, start, start + string.length) : false;
					}
					// 1个或2个参数：数字+数字
					else if (_type(start) === "number") {
						// 从头开始选
						if (start >= 0) {
							if (end === undefined) end = len;
						}
						// 从末尾开始选
						else {
							if (end === undefined) end = 0;
							temp = start;
							start = end;
							end = len + temp + 1;
						}
					}
					// 其他
					else {
						start = 0;
						end = len;
					}
					return _setSelection(elem, start, end);
				},
				/**
				 * 光标定位到指定位置
				 * @version 1.0
				 * @date 2013年7月13日19:26:49
				 * @param  {Number} 0 到字符串长度-1
				 * @return {Object} this
				 */
				focusTo: function (start) {
					this.select(start, start);
					return this;
				},
				/**
				 * 光标定位到文字的开始位置
				 * @version 1.0
				 * @date 2013年7月13日19:26:49
				 * @return {Object} this
				 */
				focusStart: function () {
					this.select(0, 0);
					return this;
				},
				/**
				 * 光标定位到文字的末尾位置
				 * @version 1.0
				 * @date 2013年7月13日19:26:49
				 * @return {Object} this
				 */
				focusEnd: function () {
					var len = elem.value.length;
					this.select(len, len);
					return this;
				},
				/**
				 * 在选中位置前插入字符串并选中该字符串
				 * @version 1.0
				 * @date 2013年7月13日19:28:41
				 * @param  {String} 要插入的字符串
				 * @return {Object} this
				 */
				before: function (string) {
					_changeSelection(elem, string, "before");
					return this;
				},
				/**
				 * 在选中位置后插入字符串并选中该字符串
				 * @version 1.0
				 * @date 2013年7月13日19:28:41
				 * @param  {String} 要插入的字符串
				 * @return {Object} this
				 */
				after: function (string) {
					_changeSelection(elem, string, "after");
					return this;
				},
				replace: function (string) {
					_changeSelection(elem, string, "replace");
					return this;
				},
				/**
				 * 删除选中文字
				 * @version 1.0
				 * @date 2013年7月13日19:28:41
				 * @return {Object} this
				 */
				remove: function () {
					_changeSelection(elem, "", "replace");
					return this;
				},
				/**
				 * 在文字的开始处插入字符串并选中它们
				 * @version 1.0
				 * @date 2013年7月13日19:28:41
				 * @param  {String} 要插入的字符串
				 * @return {Object} this
				 */
				prepend: function (string) {
					this.focusStart();
					_changeSelection(elem, string, "before");
					return this;
				},
				/**
				 * 在文字的末尾处插入字符串并选中它们
				 * @version 1.0
				 * @date 2013年7月13日19:28:41
				 * @param  {String} 要插入的字符串
				 * @return {Object} this
				 */
				append: function (string) {
					this.focusEnd();
					_changeSelection(elem, string, "after");
					return this;
				},
				/**
				 * 在选中的文字末尾处开始向前删除指定长度的字符
				 * @version 1.0
				 * @date 2013年7月13日19:28:41
				 * @param  {Number} 要删除的字符串长度
				 * @return {Object} this
				 */
				backspace: function (length) {
					_changeSelection(elem, "", "backspace", length);
					return this;
				},
				/**
				 * 在选中的文字开始处开始向后删除指定长度的字符
				 * @version 1.0
				 * @date 2013年7月13日19:28:41
				 * @param  {Number} 要删除的字符串长度
				 * @return {Object} this
				 */
				"delete": function (length) {
					_changeSelection(elem, "", "delete", length);
					return this;
				}
			}
		}
	};


	// Give the init function the yQuery prototype for later instantiation
	// 参考于 jquery
	yQuery.fn.init.prototype = yQuery.fn;



	_each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after"
	}, function (displayFn, originalFn) {
		yQuery.fn[displayFn] = function (vArg) {
			var yTarget = yQuery(vArg),
				i = 0,
				j = yTarget.length,
				yThis,
				yResult;

			// 遍历父对象
			for (; i < j; i++) {
				yThis = i ? this.clone() : this;
				yResult = yResult ? _merge(yResult, yThis) : yThis;
				yTarget.eq(i)[originalFn](yThis);
			}

			return yResult;
		}
	});



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
	_each(["fadeIn", "show", "slideRight", "slideDown"], function (index, animateType) {
		yQuery.fn[animateType] = function (nDuration, sEasing, fn) {
			var A = arguments,
				AL = A.length,
				oProperty = {},
				oTransition = {},
				fn = emptyFn,
				i = 0,
				j = this.length,
				_this = this,
				// 触发次数
				k = 0,
				the;

			// 无参数
			if (AL == 0) {
				oTransition.duration = 0;
			}
			// 1个参数：数字
			else if (AL == 1 && _type(nDuration) === "number") {
				oTransition.duration = nDuration;
			}
			// 1个参数：回调函数
			else if (AL == 1 && _isFunction(nDuration)) {
				oTransition.duration = 0;
				fn = nDuration;
			}
			// 2个参数：数字+字符串
			else if (AL == 2 && _type(sEasing) === "string") {
				oTransition.duration = nDuration;
				oTransition.easing = sEasing;
			}
			// 2个参数：数字+函数
			else if (AL == 2 && _isFunction(sEasing)) {
				oTransition.duration = nDuration;
				fn = sEasing;
			}
			// 3个参数：数字+字符串+函数
			else {
				oTransition.duration = nDuration;
				oTransition.easing = sEasing;
				fn = fn;
			}


			for (; i < j; i++) {
				the = yQuery(this[i]);
				switch (index) {
					// fadeIn
				case 0:
					oProperty = {
						opacity: "1"
					};
					break;
					// show
				case 1:
					oProperty = {
						width: the.data(dataPrefix + "css.width") || the.css("width"),
						height: the.data(dataPrefix + "css.height") || the.css("height"),
						"padding-top": the.data(dataPrefix + "css.padding-top") || the.css("padding-top"),
						"padding-right": the.data(dataPrefix + "css.padding-right") || the.css("padding-right"),
						"padding-bottom": the.data(dataPrefix + "css.padding-bottom") || the.css("padding-bottom"),
						"padding-left": the.data(dataPrefix + "css.padding-left") || the.css("padding-left"),
						"border-top-width": the.data(dataPrefix + "css.border-top-width") || the.css("border-top-width"),
						"border-right-width": the.data(dataPrefix + "css.border-right-width") || the.css("border-right-width"),
						"border-bottom-width": the.data(dataPrefix + "css.border-bottom-width") || the.css("border-bottom-width"),
						"border-left-width": the.data(dataPrefix + "css.border-left-width") || the.css("border-left-width")
					};
					break;
					// slideRight
				case 2:
					oProperty = {
						width: the.data(dataPrefix + "css.width") || the.css("width"),
						"padding-right": the.data(dataPrefix + "css.padding-right") || the.css("padding-right"),
						"padding-left": the.data(dataPrefix + "css.padding-left") || the.css("padding-left"),
						"border-right-width": the.data(dataPrefix + "css.border-right-width") || the.css("border-right-width"),
						"border-left-width": the.data(dataPrefix + "css.border-left-width") || the.css("border-left-width")
					};
					break;
					// slideDown
				case 3:
					oProperty = {
						height: the.data(dataPrefix + "css.height") || the.css("height"),
						"padding-top": the.data(dataPrefix + "css.padding-top") || the.css("padding-top"),
						"padding-bottom": the.data(dataPrefix + "css.padding-bottom") || the.css("padding-bottom"),
						"border-top-width": the.data(dataPrefix + "css.border-top-width") || the.css("border-top-width"),
						"border-bottom-width": the.data(dataPrefix + "css.border-bottom-width") || the.css("border-bottom-width")
					};
					break;
				}

				// 这里必须预先设置为display为显示，否则不会触发动画
				the.each(function () {
					_setStyle(this, {
						display: _getData(this, dataPrefix + "css.display") || (inlineTag.test(this.nodeName) ? "inline" : "block")
					});
				});

				_animate(the[0], oProperty, oTransition, function () {
					_this.css("overflow", the.data(dataPrefix + "css.overflow") || "");
					k++;
					if (k === j) {
						fn.call(_this);
					}
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
	_each(["fadeOut", "hide", "slideLeft", "slideUp"], function (index, animateType) {
		yQuery.fn[animateType] = function (nDuration, sEasing, fn) {
			var A = arguments,
				AL = A.length,
				oProperty = {},
				oTransition = {},
				fn = emptyFn,
				the,
				i = 0,
				j = this.length,
				_this = this,
				k = 0;

			switch (index) {
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

			// 无参数
			if (AL == 0) {
				oTransition.duration = 0;
			}
			// 1个参数：数字
			else if (AL == 1 && _type(nDuration) === "number") {
				oTransition.duration = nDuration;
			}
			// 2个参数：数字+字符串
			else if (AL == 2 && _type(sEasing) === "string") {
				oTransition.duration = nDuration;
				oTransition.easing = sEasing;
			}
			// 2个参数：数字+函数
			else if (AL == 2 && _isFunction(sEasing)) {
				oTransition.duration = nDuration;
				fn = sEasing;
			}
			// 3个参数：数字+字符串+函数
			else {
				oTransition.duration = nDuration;
				oTransition.easing = sEasing;
				fn = fn;
			}

			// 存储样式
			for (; i < j; i++) {
				the = yQuery(this[i]);
				_each(["display", "width", "height", "overflow", "padding-top", "padding-right", "padding-bottom", "padding-left", "border-top-width", "border-right-width", "border-bottom-width", "border-left-width"], function (j, v) {
					the.data(dataPrefix + "css." + v, the.css(v));
				});
				the.css("overflow", "hidden");

				_animate(the[0], oProperty, oTransition, function () {
					// 如果是hide
					if (index == 1) {
						_this.css("display", "none");
					}

					k++;
					if (k === j) {
						fn.call(_this);
					}
				});
			}

			return this;
		}

	})



	// 各种宽度、高度获取和设置
	_each(["inner", "", "outer"], function (i, type) {
		_each(["Width", "Height"], function (j, name) {
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
			yQuery.fn[fnVal] = function (number) {
				elem = this[0];
				// window
				if (elem === win) {
					return type ?
						win[type + name] :
						win.document.documentElement["client" + name];
				}
				// document
				else if (elem === doc) {
					docE = doc.documentElement;
					return !type ?
						doc[name.toLowerCase()] :
						Math.max(doc.body["scroll" + name], docE["scroll" + name], doc.body["offset" + name], docE["offset" + name], docE["client" + name]);
				}
				// normal node
				else {
					aStyle = [];
					reslut = 0;

					// 是inner或者outer
					if (type) {
						for (i in styleExtraName[name]) {
							for (j in styleExtraType[type]) {
								styleExtraType[type][j] === "border" ?
									aStyle.push(styleExtraType[type][j] + styleExtraName[name][i] + "Width") :
									aStyle.push(styleExtraType[type][j] + styleExtraName[name][i]);
							}
						}
					}


					if (number === undefined) {
						aStyle.push(name2);
					}


					for (i = 0, j = aStyle.length; i < j; i++) {
						reslut += _getStyle(elem, aStyle[i], true);
					}

					if (number !== undefined) {
						for (i = 0, j = this.length; i < j; i++) {
							styleJSON[name2] = Math.abs(parseFloat(number) - reslut) + "px";
							_setStyle(this[i], styleJSON);
						}
						return this;
					} else {
						return reslut;
					}
				}
			}
		});
	});



	/**
	 * 滚动条的距离
	 * @version 1.0
	 * @date 2013年7月14日23:32:56
	 * 参考于jquery
	 */
	_each({
		scrollLeft: "pageXOffset",
		scrollTop: "pageYOffset"
	}, function (method, prop) {
		var isTop = /Y/.test(prop);
		yQuery.fn[method] = function (val) {
			var elem = this[0],
				i = 0,
				j = this.length;
			// get
			if (val === undefined) {
				// window.pageYOffset
				if (elem === win) {
					return prop in win ? win[prop] : win.document.documentElement[method];
				} else {
					return elem[method];
				}
			}
			// set
			else {
				for (; i < j; i++) {
					elem = this[i];
					elem === win ?
						win.scrollTo(!isTop ? val : yQuery(win).scrollLeft(), isTop ? val : yQuery(win).scrollTop()) :
						elem[method] = val;
				}
			}
		}
	});



	// 普通事件绑定
	_each(normalEventArr, function (key, value) {
		yQuery.fn[value] = function (fn) {
			var elem = this[0];
			// input等输入框的focus、blur方法
			if (fn === undefined && (value == "focus" || value == "blur")) {
				elem[value]();
				return this;
			}
			if (value == "dragstart") {
				this.attr("draggable", "true");
			}
			if (!_isFunction(fn)) fn = emptyFn;
			this.bind(value, fn);
			return this;
		};
	});


	// 延迟事件绑定
	_each(delayEventArr, function (key, value) {
		yQuery.fn[value] = function (fn) {
			this.bind(value, _delayRunFn(fn, 100));
			return this;
		};
	});


	// 改良事件绑定
	_each({
		"mouseover": "mouseenter",
		"mouseout": "mouseleave"
	}, function (key, value) {
		yQuery.fn[value] = function (fn) {
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
	yQuery.extend = function (oJSON) {
		var A = arguments,
			j = A.length,
			A0 = A[0],
			i = 1,
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



	/*================================[ 扩展 ]=================================*/
	// 扩展
	yQuery.extend({
		/**
		 * yQuery的一些基础方法
		 * @type {Object}
		 */
		yquery: yquery,
		defaults: defaults,
		trim: _trim,
		type: _type,
		isArray: _isArray,
		isFunction: _isFunction,
		map: _map,
		each: _each,
		merge: _merge,
		parseJSON: _parseJSON,
		stringifyJSON: _stringifyJSON,
		parseQuery: _parseQuery,
		stringifyQuery: _stringifyQuery,
		parseXML: _parseXML,
		inArray: _inArray,
		support: support,
		isEmail: function (string) {
			return regEmail.test(string);
		},
		isUrl: function () {
			return regUrl.test(string);
		},
		/**
		 * 获取操作平台的特征属性
		 * @type {Object} 对象集合
		 */
		platform: {
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
		browser: {
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
			engine: {
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
		ajax: function (options) {
			var options = yQuery.extend({}, defaults.ajax, options),
				headers = {},
				i,
				xhr,
				status,
				temp,
				// 判断是否请求完毕
				isComplete = false;

			if (!support.ajax) {
				options.onerror("浏览器不支持ajax", -1);
				return;
			}

			// 头信息
			headers["Content-type"] = "application/x-www-form-urlencoded; charset=" + options.charset;
			headers["X-Requested-With"] = "XMLHttpRequest";

			// 创建xhr对象
			xhr = _newXHR();


			options.url=options.url.replace(/#.*$/, "");
			options.type = (options.type).toLowerCase();
			if (options.type == "get") {
				options.url += options.url.indexOf("?") == -1 ? "?" + yQuery.stringifyQuery(options.data) : "&" + yQuery.stringifyQuery(options.data);
				options.data = null;
			} else {
				if (_type(options.data === "object")) {
					options.data = yQuery.stringifyQuery(options.data);
				}
			}

			// 打开请求
			if (options.username) {
				xhr.open(options.type, options.url, true, options.username, options.password);
			} else {
				xhr.open(options.type, options.url, true);
			}

			// 重写mime
			if ( !! xhr.overrideMimeType) {
				xhr.overrideMimeType(_getXHRmime(options.dataType));
			}

			// 发送头信息
			try {
				for (i in headers) {
					xhr.setRequestHeader(i, headers[i]);
				}
			} catch (e) {}

			xhr.onreadystatechange = function () {
				if (xhr && xhr.readyState === 4) {
					status = xhr.status;
					if (!isComplete && status >= 200 && status < 300 || status === 304) {
						isComplete = true;
						options.onsuccess(_parseResponseText(options.dataType, options.url, xhr.responseText));
					} else if (!isComplete) {
						isComplete = true;
						options.onerror(xhr.responseText, xhr.status);
					}
					xhr = null;
				}
			};

			// 发送
			xhr.send(options.data);
		},
		/**
		 * 读取图片尺寸
		 * @version 1.0
		 * @date 2013年7月14日16:34:22
		 * @link http://www.planeart.cn/?p=1121
		 * @param {Object} options
		 */
		getImage: function (options) {
			_getImage(options);
		},
		/**
		 * 产生随机数
		 * @version  1.0
		 * @date 2013年7月9日17:06:33
		 * @param  {Number} min 最小整数（含）
		 * @param  {Number} max 最大整数（含）
		 * @return {Number} 随机数
		 */
		random: function (min, max) {
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
		cookie: function (sName, sValue, oOption) {
			oOption = oOption || {};
			var A = arguments,
				AL = A.length,
				ck = doc.cookie,
				oTemp = {},
				i;
			// all
			if (AL === 0) {
				return _getCookies();
			}
			// clear
			else if (AL === 1 && sName === null) {
				oOption.expires = -1;
				oTemp = _getCookies();
				for (i in oTemp) {
					_setCookie(i, "", oOption);
				}
			}
			// get
			else if (AL === 1 && _type(sName) === "string") {
				return _getCookies()[sName];
			}
			// remove
			else if (AL === 2 && sValue === null) {
				oOption.expires = -1;
				_setCookie(sName, "", oOption);
			}
			// set
			else if (AL >= 2 && _type(sValue) === "string") {
				_setCookie(sName, sValue, oOption);
			}
		},
		/**
		 * 设置、获取、清除、清空 localstorage
		 * @version 1.0
		 * @date 2013年7月10日21:11:02
		 * @example
		 * all=>$.storage();
		 * get=>$.storage("name");
		 * set=>$.storage("name","value");
		 * remove=>$.storage("name",null);
		 * clear=>$.storage(null);
		 *
		 * @param  {String} localStorage的key
		 * @param  {String} localStorage的value
		 * @return {*}
		 */
		storage: function (sKey, sValue) {
			if (!support.localStorage) return;
			var A = arguments,
				AL = A.length,
				lc = win.localStorage,
				oResult = {}, i = 0,
				j = lc.length;

			// all
			if (AL === 0) {
				for (; i < j; i++) {
					oResult[lc.key(i)] = lc.getItem(lc.key(i));
				}
				return oResult;
			}
			// clear
			if (AL === 1 && sKey === null) {
				lc.clear();
			}
			// get
			else if (AL === 1 && _type(sKey) === "string") {
				return lc.getItem(sKey);
			}
			// remove
			else if (AL === 2 && sValue === null) {
				lc.removeItem(sKey);
			}
			// set
			else if (AL === 2 && _type(sValue) === "string") {
				lc.setItem(sKey, sValue);
			}
		},
		/**
		 * 桌面通知
		 * @version  1.0
		 * @date 2013年7月11日16:02:12
		 * @example
		 * show=>$.notification(
		 * {
		 * 		icon:"icon.png",
		 * 		title:"标题",
		 * 		content:"内容",
		 * 		ondisplay:function(){},
		 * 		onshow:function(){},
		 * 		onhide:function(){},
		 * 		onerror:function(){},
		 * 		onclick:function(){}
		 * });
		 * hide=>$.notification(false);
		 * hideAll=>$.notification(null);
		 * @param  {Object} 参数对象
		 * @return {undefined}
		 */
		notification: function (options) {
			if (options === false) {
				_closeNotification(0);
			} else if (options === null) {
				_clearNotification();
			} else {
				_displayNotification(options);
			}
		},
		/**
		 * 获取鼠标选中的区域文本
		 * @todo 还没有做设置
		 * @version 1.0
		 * @date 2013年7月10日22:15:06
		 * @return {String} 返回选中的文本
		 */
		selection: function () {
			// 高级浏览器
			if ( !! win.getSelection) {
				return win.getSelection().toString();
			}
			// 低级浏览器
			else if ( !! doc.getSelection) {
				return doc.getSelection();
			}
			// ie废材浏览器
			else {
				return doc.selection.createRange().text;
			}
		},
		/**
		 * key、value形式组装成formData
		 * @version  1.0
		 * @date 2013年7月13日21:48:34
		 * @link https://developer.mozilla.org/en-US/docs/Web/API/FormData
		 * @link https://developer.mozilla.org/en-US/docs/Web/Guide/Using_FormData_Objects?redirectlocale=en-US&redirectslug=Web%2FAPI%2FFormData%2FUsing_FormData_Objects
		 * @param  {Object / String} key、value的formData或form标签选择器
		 * @return {Object} new formData
		 */
		formData: function (data, formData) {
			var elem, formData, A = arguments,
				AL = A.length;
			// 选择器
			if (_type(data) === "string" && AL === 1) {
				elem = yQuery(data)[0];
				if (_nodeName(elem, "form")) {
					formData = new FormData(elem);
				}
			}
			// 键+值+formData
			else if (_type(data) === "string" && AL >= 2) {
				formData = A[2] === undefined ? new FormData() : A[2];
				formData.append(A[0], A[1]);
			}
			// 键值对+formData
			else {
				if (formData === undefined) formData = new FormData();
				_each(data, function (key, val) {
					formData.append(key, val);
				});
			}
			return formData;
		},
		/**
		 * 获得定位信息
		 * @version 1.0
		 * @date 2013年7月13日23:20:27
		 * @example
		 * $.geolocation(
		 * {
		 * 		options:{...},
		 * 		onsuccess:function(position){},
		 * 		onerror:function(err){}
		 * });
		 * @return {undefined}
		 */
		geolocation: function (options) {
			_geolocation(options);
		},
		/**
		 * 解析url
		 * @param  {String} url地址，为空表示当前url
		 * @return {Object} 解析后的对象
		 */
		url: function (url) {
			// TODO
		}
	});


	yQuery.browser = yQuery.extend({}, browser, yQuery.browser);

	yQuery.notification.permission = _getNotificationPermission();



	// 全局$
	win.$ = yQuery;


	/*=============================[ 以下是私有函数 ]============================*/


	/**
	 * 判断对象是否yQuery对象
	 * @version 1.0
	 * @date 2013年7月21日22:04:48
	 * @param  {Object} 对象
	 * @return {Boolean} 如果是返回true，其他返回false
	 */

	function _isYQuery(object) {
		var i = 0,
			j = 0;
		// 有length属性
		if (object.length != undefined) {
			// 数组元素是Dom
			j = object.length;
			for (; i < j; i++) {
				if (object[i].nodeType !== 1) return false;
			}
			return true;
		}
		return false;
	}



	/**
	 * 数组合并，但不去重
	 * @version 1.0
	 * @date 2013年7月21日22:04:48
	 * @param  {Array} 数组1,2,...,n
	 * @return {Array} 新数组
	 */

	function _merge() {
		var
		A = arguments,
			AL = A.length,
			i = 0,
			j = 0,
			k = 0,
			l = 0,
			array = [];

		if (AL < 2) return A[0];

		// 避免修改原数组
		array = yQuery.extend([], A[0]);
		l = array.length;

		// 从第2个数组开始循环
		for (i = 1; i < AL; i++) {
			// 遍历数组元素
			if (!A[i].length) continue;
			for (j = 0, k = A[i].length; j < k; j++) {
				array[l] = A[i][j];
				l++;
			}
		}
		array.length = l;

		return array;
	}



	/**
	 * 类数组对象反向
	 * @version 1.0
	 * @date 2013年7月21日22:25:33
	 * @param  {Object} 类数组对象
	 * @return {Object} 新的类数组对象
	 */

	function _reverse(arrayObject) {
		var i = arrayObject.length - 1,
			j = 0,
			newArrayObject = [];
		for (; i >= 0; i--) {
			newArrayObject[j] = arrayObject[i];
			j++;
		}
		return yQuery(newArrayObject);
	}



	/**
	 * 定位
	 * @version 1.0
	 * @date 2013年7月14日16:22:45
	 * @param  {Object}
	 * @return {undefined}
	 */

	function _geolocation(options) {
		options = yQuery.extend({}, defaults.geolocation, options);
		if (!support.geolocation) {
			options.onerror.call(win, {
				code: -1,
				message: "浏览器不支持定位"
			});
			return;
		}
		Geolocation.getCurrentPosition(options.onsuccess, options.onerror, options.options);
	}



	/**
	 * 获得输入框的光标位置
	 * @version  1.0
	 * @date 2013年7月11日20:52:55
	 * @link http://www.cnblogs.com/rainman/archive/2011/02/27/1966482.html
	 * @link http://mrthink.net/text-field-jquery-extend/
	 * @param  {Object} 输入框对象
	 * @return {Number} 位置
	 */

	function _getSelectionPosition(elem, index) {
		var sel, range, dupRange, pos = [],
			ae;
		if (!elem) return -1;
		elem.focus();
		// html5
		if (doc.activeElement && doc.activeElement === elem) {
			ae = doc.activeElement;
			pos.push(ae.selectionStart, ae.selectionEnd);
			return pos[index];
		}
		// ie
		else if (doc.selection) {
			sel = document.selection;
			range = sel.createRange();
			dupRange = range.duplicate();
			dupRange.moveToElementText(elem);
			dupRange.setEndPoint('EndToEnd', range);
			elem.selectionStart = dupRange.text.length - range.text.length;
			elem.selectionEnd = elem.selectionStart + range.text.length;
			pos.push(elem.selectionStart, elem.selectionEnd);
			return pos[index];
		}
		return -1;
	}


	/**
	 * 获得输入框中选中的文字
	 * @version  1.0
	 * @date 2013年7月11日22:30:33
	 * @link https://developer.mozilla.org/en-US/docs/Web/API/document.activeElement?redirectlocale=en-US&redirectslug=DOM%2Fdocument.activeElement
	 * @todo 还没有完善
	 * @param  {Object} 输入框对象
	 * @return {String} 选中的文字
	 */

	function _getSelectionValue(elem) {
		var start = _getSelectionPosition(elem, 0),
			end = _getSelectionPosition(elem, 1);
		if (start == -1 || end == -1) return null;
		if (doc.activeElement) {
			return doc.activeElement.value.substring(start, end);
		} else {
			// 
		}
		return null;
	}


	/**
	 * 设置新选中
	 * @version 1.0
	 * @date 2013年7月11日22:31:00
	 * @param {Object} 输入框对象
	 * @param {Number} 开始位置
	 * @param {Number} 结束位置
	 * @return {String} 返回选中的文字
	 */

	function _setSelection(elem, start, end) {
		var range;
		if (!elem) return;
		elem.focus();
		if (doc.activeElement && doc.activeElement === elem) {
			elem.setSelectionRange(start, end);
		} else if (doc.selection) {
			range = elem.createTextRange();
			range.moveEnd('character', -elem.value.length);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		} else {
			return false;
		}
		return _getSelectionValue(elem);
	}


	/**
	 * 改变选择的文字
	 * @version  1.1
	 * @date 2013年7月13日18:25:48
	 * @date 2013年7月11日22:33:19
	 * @param  {Object} 输入框对象
	 * @param  {String} 字符串
	 * @param  {String} 操作类型：before/after/replace/backspace/delete
	 * @param  {Number} 操作的长度，只在删除的时候起作用
	 * @return {undefined}
	 */

	function _changeSelection(elem, string, type, length) {
		if (!elem) return;

		if (string === undefined) string = "";
		string = string + "";

		if (!type) type = "before";

		if (_type(length) !== "number") length = 0;

		var val = elem.value,
			newVal = "",
			len = val.length,
			size = string.length,
			start = 0,
			end = 0,
			newStart = 0,
			newEnd = 0;

		elem.focus();

		// html5
		if (doc.activeElement && doc.activeElement === elem) {
			start = doc.activeElement.selectionStart;
			end = doc.activeElement.selectionEnd;

			switch (type) {
				// 前插
			case "before":
			default:
				newVal = val.slice(0, start) + string + val.slice(start, len);
				newStart = start;
				newEnd = start + size;
				break;

				// 后插
			case "after":
				newVal = val.slice(0, end) + string + val.slice(end, len);
				newStart = end;
				newEnd = end + size;
				break;

				// 替换
			case "replace":
				if (start === end) return;
				newVal = val.slice(0, start) + string + val.slice(end, len);
				newStart = start;
				newEnd = start + size;
				break;

				// 前删
			case "backspace":
				newStart = end - length;
				if (newStart < 0) newStart = 0;
				newEnd = newStart;
				newVal = val.slice(0, newStart) + val.slice(end, len);
				break;

				// 后删
			case "delete":
				newStart = start;
				newEnd = start + length;
				if (newEnd > len) newEnd = len;
				newVal = val.slice(0, start) + val.slice(newEnd, len);
				newEnd = start;
				break;
			}

			elem.value = newVal;
			_setSelection(elem, newStart, newEnd);
		}
		// ie
		else if (doc.selection) {
			// doc.selection.createRange().text = string;
		} else return false;
	}



	/**
	 * 获得浏览器桌面通知的许可权限
	 * @version  1.0
	 * @date 2013年7月11日22:34:20
	 * @return {Number} 0、1、2
	 */

	function _getNotificationPermission() {
		if (!support.notification) return -1;
		// 0 已允许
		// 1 尚未允许
		// 2 已禁止
		return Notification.checkPermission();
	}


	/**
	 * 显示浏览器桌面通知
	 * @version  1.0
	 * @date 2013年7月11日22:35:01
	 * @param  {Object} 传递参数
	 * @return {undefined}
	 */

	function _displayNotification(options) {
		if (!support.notification) return;
		options = yQuery.extend({}, defaults.notification, options);
		var permission = _getNotificationPermission(),
			newNotification, dataQueue = dataPrefix + "notificationQueue",
			queue = _getData(win, dataQueue) || _setData(win, dataQueue, []);

		if (permission == 0) {
			newNotification = Notification.createNotification(options.icon, options.title, options.content);
			// 绑定事件回调
			newNotification.ondisplay = function () {
				options.ondisplay.call(newNotification);
			};
			newNotification.onshow = function () {
				options.onshow.call(newNotification);
			};
			newNotification.onclose = function () {
				options.onclose.call(newNotification);
			};
			newNotification.onclick = function () {
				options.onclick.call(newNotification);
			};
			newNotification.onerror = function () {
				options.onerror.call(newNotification);
			};
			// 入栈通知队列
			queue.push(newNotification);
			newNotification.show();
		} else if (permission == 1) {
			// 重新请求允许
			Notification.requestPermission(arguments.callee);
		} else {
			throw ("用户已禁止桌面通知！");
		}
	}


	/**
	 * 关闭浏览器桌面通知的第index个
	 * 对刷新之后再操作桌面通知无效
	 * @version  1.0
	 * @date 2013年7月11日22:36:04
	 * @param  {Number} 通知索引序列
	 * @return {undefined}
	 */

	function _closeNotification(index) {
		if (!support.notification) return;
		var dataQueue = dataPrefix + "notificationQueue",
			queue = _getData(win, dataQueue),
			thisNotification;
		if (queue && queue.length) {
			thisNotification = queue.splice(index, 1)[0];
			thisNotification.close();
			thisNotification.cancel();
			_setData(win, dataQueue, queue);
		}
	}


	/**
	 * 清除浏览器桌面通知
	 * 对刷新之后再操作桌面通知无效
	 * @version 1.0
	 * @date 2013年7月11日22:36:33
	 * @return {undefined}
	 */

	function _clearNotification() {
		if (!support.notification) return;
		var dataQueue = dataPrefix + "notificationQueue",
			queue = _getData(win, dataQueue),
			i = 0,
			j;
		if (queue && queue.length) {
			for (j = queue.length; i < j; i++) {
				_closeNotification(0);
			}
		}
	}



	/**
	 * 设置对象的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @param {Object} 对象
	 * @param {String} 名称
	 * @param {String} 版本号
	 * @return {undefined}
	 */

	function _setNameAndVersion(object, name, version) {
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

	function _setPlatform(name, version) {
		var p = yQuery.platform;
		_setNameAndVersion(p, name, version);
	}



	/**
	 * 根据ua获取操作平台的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @return {undefined}
	 */

	function _getPlatform() {
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

	function _setBrowser(name, version) {
		var b = yQuery.browser;
		_setNameAndVersion(b, name, version);
	}



	/**
	 * 根据ua获取浏览器的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @return {undefined}
	 */

	function _getBrowser() {
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

	function _setBrowserEngine(name, version) {
		var e = yQuery.browser.engine;
		_setNameAndVersion(e, name, version);
	}



	/**
	 * 根据ua获取浏览器核心的名称和版本号
	 * @version  1.0
	 * @date 2013年7月10日23:57:45
	 * @return {undefined}
	 */

	function _getBrowserEngine() {
		var s, ua = browser.ua;
		(s = ua.match(/trident\/([\d.]+)/)) ? _setBrowserEngine("trident", _toFixedVersion(s[1])) :
			(s = ua.match(/gecko\/([\d.]+)/)) ? _setBrowserEngine("gecko", _toFixedVersion(s[1])) :
			(s = ua.match(/applewebkit\/([\d.]+)/)) ? _setBrowserEngine("webkit", _toFixedVersion(s[1])) :
			(s = ua.match(/presto\/([\d.]+)/)) ? _setBrowserEngine("presto", _toFixedVersion(s[1])) : 0;
		if (browser.ie == 6) {
			_setBrowserEngine("trident", _toFixedVersion("4"));
		} else if (browser.ie == 7 || browser.ie == 8) {
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

	function _toFixedVersion(ver, floatLength) {
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

	function _getBrowserFlashVersion() {
		var ver = 0;
		if (browser.pg && browser.pg.length) {
			var flash = browser.pg['Shockwave Flash'];
			if (flash && flash.description) {
				ver = _toFixedVersion(flash.description.match(/\b(\d+)\.\d+\b/)[1], 1) || ver;
			}
		} else {
			var startVer = 13;
			while (startVer--) {
				try {
					new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + startVer);
					ver = _toFixedVersion(startVer);
					break;
				} catch (e) {}
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

	function _getObjectKey(obj) {
		var i, a = [];
		for (i in obj) {
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

	function _getObjectLength(obj) {
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

	function _getXHRmime(sDataType) {
		var mime = "application/json";
		switch (sDataType) {
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

	function _parseResponseText(sDataType, sUrl, sText) {
		var script;
		switch (sDataType) {
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
		case "text":
			break;
		case "json":
			sText = _parseJSON(_trim(sText));
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

	function _trim(string) {
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

	function _parseJSON(string) {
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

	function _stringifyJSON(json) {
		if (!json) return "";

		return win.JSON.stringify(json);
	}


	/**
	 * 解析字符串为 querystring
	 * @version 1.0
	 * @date 2013年7月18日22:23:12
	 * @param {String} 字符串
	 * @return {Object} 对象
	 */

	function _parseQuery(string) {
		var arr = string.replace(/^\?/, "").split(/&/),
			i, temp = [],
			object = {};
		for (i in arr) {
			temp = arr[i].split("=");
			object[temp[0]] = temp[1] ? temp[1] : "";
		}
		return object;
	}


	/**
	 * 转换对象为 querystring 字符串
	 * @version  1.0
	 * @date 2013年7月18日22:18:59
	 * @param  {Object} 对象
	 * @return {String} 字符串
	 */

	function _stringifyQuery(object) {
		var i, arr = [];
		for (i in object) {
			arr.push(i + "=" + object[i]);
		}
		return arr.join("&");
	}



	/**
	 * 解析字符串为XML
	 * @version  1.0
	 * @date 2013年6月28日12:39:56
	 * @param  {String} 字符串
	 * @return {Node Object} XML Node 对象
	 */

	function _parseXML(string) {
		if (typeof string !== "string" || !string) {
			return null;
		}
		var xml, tmp;
		try {
			if (win.DOMParser) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString(string, "text/xml");
			} else { // IE
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = "false";
				xml.loadXML(string);
			}
		} catch (e) {
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

	function _newElement(sTag) {
		return doc.createElement(sTag);
	}



	/**
	 * 创建一个新的XHR对象
	 * @version 1.0
	 * @date 2013年6月28日15:56:20
	 * @return {[type]} [description]
	 */

	function _newXHR() {
		var xhr;
		try {
			xhr = new win.XMLHttpRequest();
		} catch (e) {
			try {
				xhr = new win.ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {}
		}
		return xhr;
	}



	function _getImage(options) {
		options = yQuery.extend({}, defaults.getImage, options);
		if (!options.src) {
			options.onerror.call(win);
			return;
		}
		var
		// new Image
		img = new Image(),
			// 图片的宽
			width,
			// 图片的高
			height,
			// 判断图片是否ready
			imgOnReady,
			// 图片是否加载完毕
			imgDone = false,
			// 定时器
			timer = 0;
		img.src = options.src;

		// 如果图片被缓存，则直接返回缓存数据
		if (img.complete) {
			imgDone = true;
			options.onready.call(img);
			options.onsuccess.call(img);
			return;
		}

		width = img.width;
		height = img.height;

		// 加载错误后的事件
		img.onerror = function () {
			imgDone = true;
			options.onerror.call(img);
		}

		imgOnReady = function () {
			if (imgDone) return;
			// 新宽度
			var newWidth = img.width,
				newHeight = img.height;
			if (newWidth !== width || newHeight !== height) {
				if (timer) {
					clearInterval(timer);
					timer = 0;
				}
				options.onready.call(img);
				imgDone = true;
			}
		}
		imgOnReady();

		// 图片加载完毕
		img.onload = function () {
			if (!imgDone) imgOnReady();
			imgDone = true;
			options.onsuccess.call(img);
			img.onsuccess = null;
			img.onerror = null;
		}

		// 图片没有加载完毕执行定时器
		if (!imgDone) {
			timer = setInterval(function () {
				imgOnReady();
			}, 40);
		}
	}



	/**
	 * 标签字符串换换为Dom节点
	 * @version  1.1
	 * @date 2013年7月1日18:52:12
	 * @date 2013年6月28日12:40:20
	 * @param  {String} dom字符串
	 * @return {Object} dom节点
	 */

	function _stringToNode(string) {
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

	function _makeArray(nodes) {
		if (nodes === win || nodes === doc) {
			this[0] = nodes;
			this.length = 1;
		} else {
			for (var i = 0; i < nodes.length; i++) {
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

	function _inArray(elem, array, fromIndex) {
		fromIndex = fromIndex === undefined ? 0 : fromIndex;

		if (_isArray(array)) {
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

	function _each(obj, callback) {
		var value,
			i = 0,
			length = obj.length;
		if (_isArray(obj)) {
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
	 * 重新包装数组
	 * @version  1.1
	 * @date 2013年7月1日23:12:25
	 * @param  {Array} 数组或者类数组（有length属性）
	 * @param  {Function} 每一个元素的回调处理并返回
	 * @return {Array}
	 */

	function _map(array, callback) {
		var newArr = [];

		// 数组不存在 不是数组 不是回调函数
		if (!array || !_isArray(array) || !_isFunction(callback)) return array;

		// 系统有Array.map方法
		if ( !! Array.prototype.map) {
			return array.map(callback);
		}

		return newArr;
	}



	/**
	 * 判断对象类型，参考于jQuery源代码
	 * @version 1.2
	 * @date 2013年7月24日23:30:01
	 * @date 2013年7月1日18:08:02
	 * @date 2013年6月28日12:42:11
	 * @param  {Object} 对象
	 * @return {String} 对象类型
	 */

	function _type(obj) {
		if (typeof (obj) !== "object") {
			return typeof (obj);
		}
		return obj == null ? String(obj) : class2type[toString.call(obj)] || _isArray(obj) ? "array" : "object";
	}



	/**
	 * 判断对象是否为函数（方法）
	 * @version 1.0
	 * @date 2013年6月28日12:42:11
	 * @param  {Object} 传入对象
	 * @return {Boolean} 如果是返回true，否则返回false
	 */

	function _isFunction(obj) {
		return _type(obj) === "function";
	}



	/**
	 * 判断对象是否为数组
	 * @version 1.0
	 * @date 2013年6月28日12:42:11
	 * @param  {Object} 传入对象
	 * @return {Boolean} 如果是返回true，否则返回false
	 */

	function _isArray(obj) {
		return !!Array.isArray ? Array.isArray(obj) : obj instanceof Array;
	}



	/**
	 * 判断文档节点是否为XML
	 * @param  {Object} 文档节点
	 * @return {Boolean} 如果是返回true，否则返回false
	 */

	function _isXML(elem) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

		return documentElement ? documentElement.nodeName !== "HTML" : false;
	}



	/**
	 * 获得node对象的属性值
	 * @version 1.1
	 * @date 2013年7月14日17:31:39
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {Object} 属性名称
	 * @param  {Boolean} 是否读取property属性
	 * @return {String or Object} 如果存在返回属性值，不存在返回null
	 */

	function _getAttr(obj, sName, isProperty) {
		sName = isProperty && fixAttr[sName] ? fixAttr[sName] : sName;
		return isProperty ?
			obj[sName] :
			obj.getAttribute(sName);
	}



	/**
	 * 获得node对象的属性值
	 * @version 1.1
	 * @date 2013年7月14日17:38:18
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} element对象
	 * @param  {Object} 属性名称和属性值组织的JSON对象
	 * @param  {Boolean} 是否读取property属性
	 * @return {undefined}
	 */

	function _setAttr(obj, oJSON, isProperty) {
		for (var i in oJSON) {
			obj.setAttribute(i, oJSON[i]);
			if (isProperty) obj[fixAttr[i] ? fixAttr[i] : i] = oJSON[i];
		}
	}



	/**
	 * 移除属性
	 * @param  {Object} element对象
	 * @param  {String} 属性名称
	 * @return {undefined}
	 */

	function _removeAttr(obj, sAttr) {
		obj.removeAttribute(sAttr);
	}



	/**
	 * 获得node对象的currentStyle
	 * @version 1.1
	 * @date 2013年7月14日21:18:48
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {String} 单个style属性名称
	 * @param  {Boolean} 是否格式化为数值
	 * @return {String or Object} 如果存在返回style属性值，不存在返回null
	 */

	function _getStyle(obj, sName, bReturnNum) {
		sName = sName.replace(/\-([a-z])/g, function (key, val) {
			return val.toUpperCase();
		});
		var value = !! obj.currentStyle ?
			obj.currentStyle[sName] :
			getComputedStyle(obj, 0)[sName];
		return bReturnNum ? parseFloat(value) : value;
	}



	/**
	 * 设置node对象的style属性值
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} node对象
	 * @param  {Object} 属性名称和属性值组织的json对象
	 * @return {undefined}
	 */

	function _setStyle(obj, oJSON) {
		for (var i in oJSON) {
			obj.style[i] = oJSON[i];
		}
	}



	/**
	 * 获得node对象的className
	 * @version 1.0
	 * @date 2013年6月27日12:42:11
	 * @param  {Object} 上下文
	 * @return {String} class值
	 */

	function _getClass(obj) {
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

	function _setClass(obj, sClass) {
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

	function _hasClass(obj, sClass) {
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

	function _addClass(obj, sClass) {
		var cls = _getClass(obj);
		if (!_hasClass(obj, sClass)) {
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

	function _removeClass(obj, sClass) {
		var cls = _getClass(obj);
		cls = cls.replace(new RegExp("\\b" + sClass + "\\b"), "");
		_setClass(obj, cls);
	}



	/**
	 * 清空node对象的所有class
	 * @version 1.0
	 * @date 2013年7月21日17:25:50
	 * @param  {Object} node对象
	 * @param  {Object} 单个class
	 * @return {undefined}
	 */

	function _clearClass(obj) {
		_setClass(obj, "");
	}



	/**
	 * 判断元素是否为该标签
	 * @version 1.0
	 * @date 2013年6月29日22:50:27
	 * @param  {Object} node元素
	 * @param  {String} 标签名称
	 * @return {Boolean} 如果是返回true，否则返回false
	 */

	function _nodeName(elem, name) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	}


	/**
	 * 解析简单的一级选择器
	 * @version  1.0
	 * @date 2013年7月1日22:42:10
	 * @param  {String} 如 ：div#id1.class1
	 * @return {Object} 如果有就包含tag、id、class属性值
	 */

	function _parseSelector(sSelector) {
		var matches = sSelector.match(regTagIdClass),
			oResult = {};
		if (!matches) return null;
		if (matches[1]) oResult.tag = matches[1];
		if (matches[3]) oResult.id = matches[3];
		if (matches[5]) oResult['class'] = matches[5];
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

	function _siblingElem(cur, dir) {
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

	function _getText(elem, text) {
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

	function _setText(elem, text) {
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

	function _getRandom() {
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

	function _setData(elem, key, value) {
		// 索引
		var index;
		// 如果不存在索引值
		if (!elem[dataAttr]) {
			index = elem[dataAttr] = ++dataIndex;
		}
		// 获得索引值
		else {
			index = elem[dataAttr];
		}
		if (!dataStore[index]) {
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

	function _getData(elem, key) {
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

	function _removeData(elem, key) {
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

	function _addEvent(elem, type, fn) {
		if (elem.addEventListener) {
			elem.addEventListener(type, fn, false);
		} else if (elem.attachEvent) {
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

	function _removeEvent(elem, type, fn) {
		if (elem.addEventListener) {
			elem.removeEventListener(type, fn, false);
		} else if (elem.attachEvent) {
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

	function _fixEvent(e) {
		// 支持DOM 2级标准事件的浏览器无需做修复
		if (e.target) {
			return e;
		}
		var _e = {}, name;
		_e.target = e.srcElement || doc;
		_e.preventDefault = function () {
			e.returnValue = false;
		};

		_e.stopPropagation = function () {
			e.cancelBubble = true;
		};
		// IE6/7/8在原生的win.event中直接写入自定义属性
		// 会导致内存泄漏，所以采用复制的方式
		for (name in e) {
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

	function _addEventHandler(elem, type) {
		return function (e) {
			e = _fixEvent(e || win.event);
			var
			queue = _getData(elem, dataPrefix + type + "Queue"),
				i = 0,
				j = queue.length,
				fn;

			for (; i < j; i++) {
				fn = queue[i];
				if (!fn) continue;
				if (fn.call(elem, e) === false) {
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

	function _removeEventHandler(elem, type, fn) {
		// 获得事件队列数组
		var queue = _getData(elem, dataPrefix + type + "Queue"),
			find = -1,
			eventHandler;

		if (!queue || queue.length == 0) return;

		if (fn) {
			// 找到fn
			find = _inArray(fn, queue);
			if (find != -1) {
				queue.splice(find, 1);
			}
		} else {
			// 删除全部
			queue = [];
		}

		// 如果事件队列为空，则删除handler，清空缓存
		if (queue.length == 0) {
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

	function _bind(elem, type, fn) {
		var key = dataPrefix + type + "Queue",
			queue = _getData(elem, key) || _setData(elem, key, []),
			eventHandler;

		// 将事件函数添加到队列中
		queue.push(fn);
		_setData(elem, key, queue);

		// 同一事件类型只注册一次事件，防止重复注册
		if (queue.length === 1) {
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

	function _unbind(elem, type, fn) {
		// 如果有具体的函数则只删除一个
		if (fn) {
			_removeEventHandler(elem, type, fn);
		}
		// 如果没有传入要删除的函数则删除该事件类型所有
		else {
			_removeEventHandler(elem, type);
		}
	}



	/**
	 * 事件触发器
	 * @version 1.1
	 * @date 2013年7月19日16:06:25
	 * @date 2013年6月29日1:35:21
	 * @link http://stylechen.com/trigger.html
	 * @param { Object } DOM元素
	 * @param { String / Object } 事件类型 / event对象
	 * @param { Array }  传递给事件处理函数的附加参数
	 */

	function _eventTrigger(elem, sType, aData) {
		var
		parent = elem.parentNode || elem.ownerDocument || elem === elem.ownerDocument && win,
			handler = _getData(elem, dataPrefix + sType + 'Handler'),
			e = {
				type: sType,
				preventDefault: emptyFn,
				stopPropagation: function () {
					isStopPropagation = true;
				},
				target: elem
			};
		aData.unshift(e);
		// 有事件记录
		if (handler) {
			handler.apply(elem, aData);
		} else {
			try {
				elem[sType].apply(elem, aData);
			} catch (e) {}
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

	function _eventConvert(fn) {
		return function (e) {
			e = _fixEvent(e || win.event);

			// 上一响应mouseover/mouseout事件的元素
			var parent = e.relatedTarget;

			// 假如存在这个元素并且这个元素不等于目标元素（被赋予mouseenter事件的元素）
			while (parent != this && parent) {
				try {
					// 上一响应的元素开始往上寻找目标元素
					parent = parent.parentNode;
				} catch (e) {
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

	function _checkSupport() {
		var scripts;
		if (!yquery.src) {
			// 此部分参考于 腾讯前端 jx
			// @link https://github.com/AlloyTeam/JX
			scripts = _querySelector("script");
			yquery.src = scripts[scripts.length - 1].src;
			yquery.file = yquery.src.replace(/(.*\/){0,}([^\\]+).*/ig, "$2");
			yquery.path = yquery.src.split(yquery.file)[0];
		}

		support.localStorage = ('localStorage' in window) && window['localStorage'] !== null;
		support.ajax = !! _newXHR();
		support.notification = !! Notification;
		support.geolocation = !! Geolocation;
	}
	_checkSupport();



	/**
	 * 设置cookie
	 * @version 1.0
	 * @date 2013年7月10日21:49:38
	 * @param {String} cookie 名称
	 * @param {String} cookie 值
	 * @param {Object} cookie 其他参数
	 */

	function _setCookie(sName, sValue, oOption) {
		oOption = yQuery.extend({}, defaults.cookie, oOption);
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

	function _getCookies() {
		var sCookies = doc.cookie,
			aCookies = [],
			i, nPos, aTemp, oResult = {};
		aCookies = sCookies.split(";");
		for (i in aCookies) {
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

	function _delayRunFn(fn, timeout) {
		var timer;

		return function () {
			var self = this,
				args = arguments;

			clearTimeout(timer);

			timer = setTimeout(function () {
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

	function _css3Prefix(oJSON, nLength) {
		var oResult = {}, aTemp = new Array(nLength),
			i = 0;
		_each(oJSON, function (cssName, cssValue) {
			_each(aCss3Prefix, function (key, prefix) {
				for (i = 0; i < nLength; i++) {
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

	function _animate(oElem, oProperty, oTransition, fn) {
		// 存储动画队列data
		oTransition = yQuery.extend({}, defaults.transition, oTransition);

		// 进入动画队列
		_animatePush(oElem, oProperty, oTransition, fn);

		// 执行动画
		_animateDo(oElem);
	}



	/**
	 * 执行动画队列第一个动画
	 * 并在动画完成并清除队列之后触发callback
	 *
	 * @version  1.2
	 * @date 2013年7月24日22:38:31
	 * @date 2013年7月9日15:13:29
	 * @date 2013年7月7日12:43:35
	 * @param  {Object} 动画元素
	 * @return {undefined}
	 */

	function _animateDo(oElem) {
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData),
			animateNow, length, property, duration, easing, delay,
			animateStyle = {}, A = arguments;

		// 有动画队列
		if (animateQueue && animateQueue.length) {
			// 取第一个动画
			animateNow = animateQueue[0];

			// 如果第一个动画正在运行
			if (animateNow.animating) return;

			// 如果是一个延迟静止动画
			if (animateNow.delay !== 0 && animateNow.length === undefined) {
				setTimeout(function () {
					// 完成清除
					_animateShift(oElem);

					// 并执行下一个动画
					A.callee(oElem);
				}, animateNow.delay);
			} else {
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
				animateStyle = yQuery.extend({},
					_css3Prefix({
						"transition-property": _getObjectKey(property).join(",")
					}, 1),
					_css3Prefix({
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
				animateNow.timer = setTimeout(function () {
					// 标记完成
					animateNow.animating = false;
					animateNow.timer = 0;

					// 设置结果样式
					styleJSON = _css3Prefix({
						"transition-property": "",
						"transition-duration": "",
						"transition-delay": "",
						"transition-timing-function": ""
					}, 1);
					_setStyle(oElem, styleJSON);

					// 完成清除
					_animateShift(oElem);

					// 执行回调
					animateNow.callback();

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

	function _animatePush(oElem, oProperty, oTransition, fn) {
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData) || _setData(oElem, animateQueueData, []),
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

	function _animateShift(oElem) {
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData);
		if (animateQueue && animateQueue.length) {
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

	function _animateStop(oElem, bClearQueue, bJumpToEnd) {
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData),
			i, j, animateNow, property, easing, length, callback, timer,
			styleJSON = {};


		if (animateQueue && animateQueue.length) {
			animateNow = animateQueue[0];
			property = animateNow.property;
			easing = animateNow.easing;
			length = animateNow.length;
			callback = animateNow.callback;
			timer = animateNow.timer;
		}

		// 清除动画队列 && 当前有动画
		if (bClearQueue && animateNow) {
			// 如果存在动画队列
			if (animateNow) {
				// 遍历动画队列
				for (i = 0, j = animateQueue.length; i < j; i++) {
					_animateClearTimeout(oElem, i);
				}
			}
			_setData(oElem, animateQueueData, []);
		}


		// 设置最终样式
		if (bJumpToEnd) {
			// 如果没有设置清除队列 => 清除当前动画和定时器 并 执行回调
			if (!bClearQueue) {
				_animateClearTimeout(oElem, 0);
				_animateShift(oElem);
				callback();
			}
		}
		// 设置当前样式
		else {
			for (i in property) {
				styleJSON[i] = _getStyle(oElem, i);
			}
			_setStyle(oElem, styleJSON);
			// 如果没有设置清除队列
			if (!bClearQueue && animateNow) {
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
		_setStyle(oElem, _css3Prefix({
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

	function _animateClearTimeout(oElem, index) {
		var animateQueueData = dataPrefix + "animateQueue",
			animateQueue = _getData(oElem, animateQueueData);
		// 如果有定时器 => 清除定时器
		if (animateQueue[index].timer) {
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

	function _animateDelay(oElem, nTime) {
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

	function _querySelector(selector, context) {

		var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,
			exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,
			exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,
			exprNodeName = /^([\w\*\-_]+)/,
			na = [null, null];

		function _find(selector, context) {

			/**
			 * This is what you call via x()
			 * Starts everything off...
			 */

			context = context || doc;

			var simple = /^[\w\-_#]+$/.test(selector);

			if (!simple && context.querySelectorAll) {
				return realArray(context.querySelectorAll(selector));
			}

			if (selector.indexOf(',') > -1) {
				var split = selector.split(/,/g),
					ret = [],
					sIndex = 0,
					len = split.length;
				for (; sIndex < len; ++sIndex) {
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

			if (className && !nodeName && context.getElementsByClassName) {

				collection = realArray(context.getElementsByClassName(className));

			} else {

				collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));

				if (className) {
					collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));
				}

				if (id) {
					var byId = context.getElementById(id);
					return byId ? [byId] : [];
				}
			}

			return parts[0] && collection[0] ? filterParents(parts, collection) : collection;

		}

		function realArray(c) {

			/**
			 * Transforms a node collection into
			 * a real array
			 */

			try {
				return Array.prototype.slice.call(c);
			} catch (e) {
				var ret = [],
					i = 0,
					len = c.length;
				for (; i < len; ++i) {
					ret[i] = c[i];
				}
				return ret;
			}

		}

		function filterParents(selectorParts, collection, direct) {

			/**
			 * This is where the magic happens.
			 * Parents are stepped through (upwards) to
			 * see if they comply with the selector.
			 */

			var parentSelector = selectorParts.pop();

			if (parentSelector === '>') {
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

			while ((node = collection[++cIndex])) {

				parent = node.parentNode;

				do {

					matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
					matches = matches && (!id || parent.id === id);
					matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));

					if (direct || matches) {
						break;
					}

				} while ((parent = parent.parentNode));

				if (matches) {
					ret[++r] = node;
				}
			}

			return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;

		}


		var unique = (function () {

			var uid = +new Date();

			var data = (function () {

				var n = 1;

				return function (elem) {

					var cacheIndex = elem[uid],
						nextCacheIndex = n++;

					if (!cacheIndex) {
						elem[uid] = nextCacheIndex;
						return true;
					}

					return false;

				};

			})();

			return function (arr) {

				/**
				 * Returns a unique array
				 */

				var length = arr.length,
					ret = [],
					r = -1,
					i = 0,
					item;

				for (; i < length; ++i) {
					item = arr[i];
					if (data(item)) {
						ret[++r] = item;
					}
				}

				uid += 1;

				return ret;

			};

		})();

		function filterByAttr(collection, attr, regex) {

			/**
			 * Filters a collection by an attribute.
			 */

			var i = -1,
				node, r = -1,
				ret = [];

			while ((node = collection[++i])) {
				if (regex.test(node[attr])) {
					ret[++r] = node;
				}
			}

			return ret;
		}

		return _find(selector, context);

	}


	// end
})(this);