$.fn.preview.defaults = {
	// 允许文件后缀
	suffix: ['png', 'jpg', 'gif'],

	// 是否允许多图，如果支持的话
	multiple: true,

	// 预览图片的宽
	width: 100,

	// 预览图片的高
	height: 100,

	// 预览图片容器对象
	$preview: null,

	// 成功回调
	// @this: this
	// @imgs: ['imageName.png'...] 图片名称数组，可能是空数组
	onsuccess: emptyFn,

	// 失败回调
	// @this: this
	// @error: [1,2...] 错误序号，从1开始
	onerror: emptyFn
};
