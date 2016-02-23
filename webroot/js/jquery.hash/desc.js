// 1、参数

// 可以直接设置默认参数
$.hash.defaults = {
    // 传入hash值，为空时默认为当前window.location.hash
    hash: ''
};

// 也可以实例化之后传参
$.hash({
    hash: '#123456'
});

// 也可以直接传hash字符串
$.hash('http://qianduanblog.com/#123456');


// 2、设置指定hash值

// 设置单个，皆为字符串
$.hash().set('a', '1');

// 设置单个，并改变hash类型
$.hash().set('a', '2', '?');

// 设置多个，为字符串键值对
$.hash().set({
    a: '3',
    b: '4'
});

// 设置多个，并改变hash类型
$.hash().set({
    a: '4',
    b: '5'
}, '!');


// 3、获取指定hash值

// 获取单个值，返回值皆为字符串
$.hash().get('a');

// 获取多个值，返回值皆为字符串键值对
$.hash().get(['a', 'b']);

// 获取所有值，返回值皆为字符串键值对
$.hash().get();


// 4、清除指定hash

// 清除单个，传值为字符串
$.hash().remove('a');

// 清除多个，传值为字符串数组
$.hash().remove(['a', 'b']);

// 清除所有符合hash类型的hash段
$.hash().remove();


// 5、字符串化并改变window.location.hash
$.hash('#!a/1/b/2#123').stringify();


// 6、设置或获取suffix部分

// 设置，如果存在该锚点，则会自动滚动到指定锚点
$.hash().suffix('456');

// 获取
$.hash().suffix();


// 7、监听

// 单监听单个
$.hash().listen('a', fn);

// 或监听多个，即当a或者b发生变化时，都会被触发
$.hash().listen('a', 'b', fn);

// 并监听多个，即当a并且b都发生变化时，才会被触发
$.hash().listen(['a', 'b'], fn);

// 监听所有，即当hash键值发生变化时，都会被触发
$.hash().listen(fn);

