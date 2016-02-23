/*!
 * jquery.ua.js
 * @author 云淡然 http://qianduanblog.com
 * @version 1.0
 * 2013年10月9日22:22:40
 */


/**
 * 1. 获取ua字符串
 * $.ua().ua;
 *
 * 2. 设置ua字符串
 * $.ua("string");
 *
 * 3. 获取参数
 * $.ua().platform;
 * $.ua().browser;
 * $.ua().engine;
 *
 * 4. 特征判断
 * 特征判断只与浏览器有关，与代理字符串无关
 * $.ua().isWebkit;
 * $.ua().isChrome;
 * $.ua().is360se;
 * $.ua().is360ee;
 * $.ua().isLiebao;
 * $.ua().isIe;
 * $.ua().ie;
 * $.ua().isIe6;
 * $.ua().isIe7;
 * $.ua().isIe8;
 * $.ua().isIe9;
 * $.ua().isIe10;
 * $.ua().isIe11;
 * $.ua().isFirefox;
 */

;
(function ($, win, undefined) {
	var UA = win.navigator.appVersion || win.navigator.userAgent,
		doc = win.document,
		parseRule = {
			platforms: [
				// windows phone
				{
					name: 'windows phone',
					versionSearch: 'windows phone os ',
					versionNames: [ // windows phone must be tested before win
						{
							number: '7.5',
							name: 'mango'
						}
					]
				},
				// windows
				{
					name: 'win',
					slugName: 'windows',
					versionSearch: 'windows(?: nt)? ',
					versionNames: [{
						number: '6.2',
						name: 'windows 8'
					}, {
						number: '6.1',
						name: 'window 7'
					}, {
						number: '6.0',
						name: 'windows vista'
					}, {
						number: '5.2',
						name: 'windows xp'
					}, {
						number: '5.1',
						name: 'windows xp'
					}, {
						number: '5.0',
						name: 'windows 2000'
					}]
				},
				// ipad
				{
					name: 'ipad',
					versionSearch: 'cpu os ',
					flags: ['ios']
				},
				// ipad and ipod must be tested before iphone
				{
					name: 'ipod',
					versionSearch: 'iphone os ',
					flags: ['ios']
				},
				// iphone
				{
					name: 'iphone',
					versionSearch: 'iphone os ',
					flags: ['ios']
				},
				// iphone must be tested before mac
				{
					name: 'mac',
					versionSearch: 'os x ',
					versionNames: [{
						number: '10.8',
						name: 'mountainlion'
					}, {
						number: '10.7',
						name: 'lion'
					}, {
						number: '10.6',
						name: 'snowleopard'
					}, {
						number: '10.5',
						name: 'leopard'
					}, {
						number: '10.4',
						name: 'tiger'
					}, {
						number: '10.3',
						name: 'panther'
					}, {
						number: '10.2',
						name: 'jaguar'
					}, {
						number: '10.1',
						name: 'puma'
					}, {
						number: '10.0',
						name: 'cheetah'
					}]
				},
				// android
				{
					name: 'android',
					versionSearch: 'android ',
					versionNames: [
						// android must be tested before linux
						{
							number: '4.1',
							name: 'jellybean'
						}, {
							number: '4.0',
							name: 'icecream sandwich'
						}, {
							number: '3.',
							name: 'honey comb'
						}, {
							number: '2.3',
							name: 'ginger bread'
						}, {
							number: '2.2',
							name: 'froyo'
						}, {
							number: '2.',
							name: 'eclair'
						}, {
							number: '1.6',
							name: 'donut'
						}, {
							number: '1.5',
							name: 'cupcake'
						}
					]
				},
				// blackberry
				{
					name: 'blackberry',
					versionSearch: '(?:blackberry\\d{4}[a-z]?|version)/'
				},
				// blackberry
				{
					name: 'bb',
					slugName: 'blackberry',
					versionSearch: '(?:version)/'
				},
				// blackberry
				{
					name: 'playbook',
					slugName: 'blackberry',
					versionSearch: '(?:version)/'
				},
				// linux
				{
					name: 'linux'
				},
				// nokia
				{
					name: 'nokia'
				}
			],
			browsers: [{
					name: 'iemobile',
					versionSearch: 'iemobile/'
				}, // iemobile must be tested before msie
				{
					name: 'msie',
					slugName: 'ie',
					versionSearch: 'msie '
				}, {
					name: 'firefox',
					versionSearch: 'firefox/'
				}, {
					name: 'chrome',
					versionSearch: 'chrome/'
				}, // chrome must be tested before safari
				{
					name: 'safari',
					versionSearch: '(?:browser|version)/'
				}, {
					name: 'opera',
					versionSearch: 'version/'
				}
			],
			engines: [{
					name: 'trident',
					versionSearch: 'trident/'
				}, {
					name: 'webkit',
					versionSearch: 'webkit/'
				}, // webkit must be tested before gecko
				{
					name: 'gecko',
					versionSearch: 'rv:'
				}, {
					name: 'presto',
					versionSearch: 'presto/'
				}
			]
		},
		// [10,)版本就无法判断
		ieVer = (function () {
			var v = 3,
				p = doc.createElement('p'),
				all = p.getElementsByTagName('i');
			while (
				p.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]);
			return v > 4 ? v : 0;
		}()),
		regWebkit = /webkit/i,
		isWebkit = regWebkit.test(UA),
		isIe = !! window.ActiveXObject,
		isIe6 = ieVer === 6,
		isIe7 = ieVer === 7,
		isIe8 = ieVer === 8,
		isIe9 = ieVer === 9,
		isIe10 = isIe && doc.documentMode === 10,
		isIe11 = isIe && doc.documentMode === 11,
		isChrome = !! win.chrome && !! win.chrome.Event,
		isLiebao = !! win.clientInformation && !! win.clientInformation.webkitGamepads,
		is360ee = !! win.chrome && !! win.chrome.searchBox && !! win.chrome.searchBox.show,
		is360se = _is360se(),
		isFirefox = win.scrollMaxX !== undefined;

	if (isIe10) {
		ieVer = 10;
	} else if (isIe11) {
		ieVer = 11;
	}

	$.extend({
		ua: function () {
			var args = arguments,
				argL = args.length,
				ua = (argL == 1 && $.type(args[0]) == "string" ? args[0] : UA).toLowerCase(),
				objPlatform = _parse(parseRule.platforms, ua),
				objBrowser = _parse(parseRule.browsers, ua, true),
				objEngine = _parse(parseRule.engines, ua);

			return {
				// 返回ua字符串
				ua: ua,
				// 操作平台
				platform: $.extend({}, objPlatform, {
					platform: win.navigator.platform.toLowerCase(),
					plugins: win.navigator.plugins
				}),
				// 浏览器外壳
				browser: objBrowser,
				// 浏览器内核
				engine: objEngine,
				// 特征判断
				isIe: isIe,
				isIe6: isIe6,
				isIe7: isIe7,
				isIe8: isIe8,
				isIe9: isIe9,
				isIe10: isIe10,
				isIe11: isIe11,
				ie: ieVer,
				isWebkit: isWebkit,
				isChrome: isChrome,
				is360ee: is360ee,
				is360se: is360se,
				isLiebao: isLiebao,
				isFirefox: isFirefox
			};
		}
	});



	/**
	 * 解析
	 * 参考：https://github.com/terkel/jquery-ua
	 * @param  {Array} 需要解析的数据
	 * @param  {String} 需要解析的ua字符串
	 * @param  {Boolean} 是否为解析浏览器数据
	 * @return {Object} 解析后的对象
	 * @version 1.0
	 * 2013年9月27日13:36:47
	 */

	function _parse(rule, ua, isBrowser) {
		var item = {},
			name,
			versionSearch,
			flags,
			versionNames,
			i,
			is,
			ic,
			j,
			js,
			jc;

		if (isBrowser && ieVer) {
			return {
				name: "ie",
				ie: true,
				version: ieVer,
				isIe: true
			}
		}

		for (i = 0, is = rule.length; i < is; i++) {
			ic = rule[i];
			name = ic.name;
			versionSearch = ic.versionSearch;
			flags = ic.flags;
			versionNames = ic.versionNames;
			if (ua.indexOf(name) !== -1) {
				item.name = name.replace(/\s/g, '');
				if (ic.slugName) {
					item.name = ic.slugName;
				}
				item[item.name] = true;
				item.version = ('' + (new RegExp(versionSearch + '(\\d+((\\.|_)\\d+)*)').exec(ua) || [, 0])[1]).replace(/_/g, '.');
				if (flags) {
					for (j = 0, js = flags.length; j < js; j++) {
						item[flags[j]] = true;
					}
				}
				if (versionNames) {
					for (j = 0, js = versionNames.length; j < js; j++) {
						jc = versionNames[j];
						if (item.version.indexOf(jc.number) === 0) {
							item.fullname = jc.name;
							item[item.fullname] = true;
							break;
						}
					}
				}
				if (rule === parseRule.platforms) {
					item.mobile = /mobile|phone/.test(ua) || item.blackberry;
					item.mobile = item.mobile === undefined ? false : true;

					item.tablet = /tablet/.test(ua) || item.ipad || (item.android && !/mobile/.test(ua));
					item.tablet = item.tablet === undefined ? false : true;

					if (item.tablet) item.mobile = false;

					item.desktop = !item.mobile && !item.tablet ? true : false;

					if (item.ios) {
						item.fullname = 'ios' + parseInt(item.version, 10);
						item[item.fullname] = true;
					}
				}
				break;
			}
		}
		if (!item.name) {
			item['unknown'] = true;
			item.name = '';
			item.version = '';
		}
		return item;
	}



	/**
	 * 判断是否为360安全浏览器
	 * @return {[type]} [description]
	 */

	function _is360se() {
		var is1 = !! win.chrome && !! win.chrome.searchBox,
			is2 = false,
			mm, i;
		if (is1) {
			mm = window.clientInformation.mimeTypes;
			for (i in mm) {
				if (mm[i].suffixes == "swf") {
					is2 = /adobe/i.test(mm[i].description);
					break;
				}
			}
		}
		return is1 && is2 && !isLiebao;
	}

})(jQuery, this);