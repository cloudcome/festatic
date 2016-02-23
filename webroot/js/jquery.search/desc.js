// 1、配置
$.search.defaults = {
    // 是否严格模式，默认true
    // 严格模式下，将在读取后、写入前分别进行encodeURIComponent、decodeURIComponent操作
    isStrict: !0,
    // 传入search部分，为空默认为window.location.search
    search: ''
};
$.search(settings);


// 2、设置
// 设置1个
$.search().set('a', '1');

// 设置多个
$.search().set({
    b: [1, 2, 3],
    c: 3
});

// push
$.search().push('a', 1);

// pop
$.search().pop('a');

// unshift
$.search().unshift('a', 2);

// shift
$.search().shift('a');

// concat
$.search().concat('a', [3, 4, 5]);

// splice
$.search().splice('a', 0, 1);

// splice
$.search().splice('a', 0, 0, 6, 7, 8);


// 3、获取
// 获取1个
$.search().get('a');

// 获取多个
$.search().get(['a', 'b']);

// 获取全部
$.search().get();


// 4、删除
// 删除1个
$.search().remove('a');

// 删除多个
$.search().remove(['a', 'b']);

// 删除全部
$.search().remove();

