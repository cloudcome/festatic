// 1、判断浏览器支持特征
// 是否支持HTML5的input的files对象，用于同时选择上传多张图片
$.support.inputFiles;
// 是否支持HTML5的FormData，用于AJAX提交
$.support.formData;


// 2、默认参数
$.fn.upload.defaults = {
    // 留空表示提交到当前页面
    action: "",
    // 传递额外数据（键值对字符串）
    data: null,
    // 留空表示默认读取表单文件的name值
    name: "",
    // 完成回调，无论成功还是失败
    oncomplete: emptyFn,
    // 成功回调
    onsuccess: emptyFn,
    // 失败回调
    onerror: emptyFn,
    // 进度回调
    onprogress: emptyFn
};;


// 3、上传文件
$("#file").upload();
