// 1、插件默认参数
$.cookie.defaults = {
    // 是否以严格模式读取和设置cookie，默认true
    // 严格模式将编码键值对再设置，非严格模式将不进行编码
    // 严格模式将解码键值对再读取，非严格模式将不进行解码
    isStrict: true,
    // 在无域名的时候，必须设置为空才能在本地写入
    domain: location.host || '',
    // 默认cookie有效期1个小时（单位秒）
    expires: 3600,
    // 默认cookie存储路径
    path: '/',
    // 是否加密cookie
    secure: false
};


// 2、获取cookie
// 获取所有可读cookie键值对
$.cookie().get();

// 获取单个可读cookie值
$.cookie().get('a');

// 获取多个可读cookie键值对
$.cookie().get(['a', 'b']);


// 3、设置cookie
// 设置1个可写cookie值
$.cookie().set('a', '1');

// 设置多个可写cookie值
$.cookie().set({
    a: '1',
    b: '2'
});


// 3、删除cookie
// 删除所有可读可写cookie
$.cookie().remove();

// 删除单个可读可写cookie
$.cookie().remove('a');

// 删除多个可读可写cookie
$.cookie().remove(['a', 'b']);
