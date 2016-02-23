// 1、传入字符串
$.ua("...").platform;
$.ua("...").browser;
$.ua("...").engine;


// 2、获取ua字符串
$.ua().ua;
// =>"..."


// 3、解析platform
$.ua().platform;
// =>{...}


// 4、解析browser
$.ua().browser;
// =>{...}


// 5、解析engine
$.ua().engine;
// =>{...}


// 6、判断浏览器内核
$.ua().isWebkit;
$.ua().isGecko;
$.ua().isTrident;


// 7、判断浏览器类型
$.ua().isMobile;
$.ua().isTablet;
$.ua().isDesktop;


// 8、判断浏览器外壳，此属性与浏览器UA无关，因此都是静态属性
// 判断是否为原版chrome浏览器
$.ua.isChrome;

// 判断是否为360极速浏览器chrome内核
$.ua.is360ee;

// 判断是否为360安全浏览器chrome内核
$.ua.is360se;

// 判断是否为猎豹浏览器chrome内核
$.ua.isLiebao;

// 判断是否为搜狗浏览器chrome内核
$.ua.isSougou;

// 判断是否为遨游浏览器
$.ua.isMaxthon;

// 判断是否为QQ浏览器
$.ua.isQQ;

// 判断是否为ie内核浏览器
$.ua.isIe;

// 判断ie内核浏览器版本
$.ua.ie;
// =>6/7/8/9/10/11,0

// 判断是否为何种版本ie内核浏览器
$.ua.isIe6;
$.ua.isIe7;
$.ua.isIe8;
$.ua.isIe9;
$.ua.isIe10;
$.ua.isIe11;
// =>boolean

// 判断是否为原版firefox浏览器
$.ua.isFirefox;
