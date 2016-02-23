// 1.默认配置
$.geolocation.defaults = {
	// onsuccess回调
	// 参考：http://www.w3.org/TR/geolocation-API/#position
	// 参数1： latitude （纬度，单位°）
	// 参数2： longitude （经度，单位°）
	// 参数3： altitude （高度，单位m）
	// 参数4： accuracy （精度，单位m）
	// 参数5： altitudeAccuracy （高精度，单位m）
	// 参数6： heading （角度，[0,360)）
	// 参数7： speed （速度，单位m/s）
	onsuccess: function () {},
	// onerror回调
	// 参考：http://www.w3.org/TR/geolocation-API/#position-error
	// 参数1：code
	// 参数1值1：用户已禁止共享地理位置信息
	// 参数1值2：地理位置信息不可用
	// 参数1值3：地理位置信息获取超时
	onerror: function () {},
	// 参考：http://www.w3.org/TR/geolocation-API/#position-options
	options: {
		// 是否启用高精度请求，将开启GPS设备
		enableHighAccuracy: true,
		// 超时，1000ms
		timeout: 1000,
		// 有效期，60*60*1000ms
		maximumAge: 3600000
	}
};


// 2. 请求当前地理位置
$.geolocation("get", {
	onsuccess: function (position) {
		var v = '' + '纬度：' + position.latitude + '°\n' + '经度' + position.longitude + '°\n' + '高度' + position.altitude + 'm\n' + '精度' + position.accuracy + 'm\n' + '高精度' + position.altitudeAccuracy + 'm\n' + '角度' + position.heading + '°\n' + '速度' + position.speed + 'm/s\n';
		alert(v);
	},
	onerror: function (code) {
		if (code == 1) {
			alert("您已经禁止了共享地理位置信息，请在设置里打开允许！");
		} else if (code == 2) {
			alert("您的浏览器地理位置信息不可用！");
		} else if (code == 3) {
			alert("获取您的地理位置信息超时，请稍后再试！");
		} else {
			alert("未知的错误！");
		}
	}
});
// =>undefined

// 3. 查看当前地理位置
var watchId = $.geolocation("watch", {
	onsuccess: function (position) {
		var v = '' + '纬度：' + position.latitude + '°\n' + '经度' + position.longitude + '°\n' + '高度' + position.altitude + 'm\n' + '精度' + position.accuracy + 'm\n' + '高精度' + position.altitudeAccuracy + 'm\n' + '角度' + position.heading + '°\n' + '速度' + position.speed + 'm/s\n';
		alert(v);
	},
	onerror: function (code) {
		if (code == 1) {
			alert("您已经禁止了共享地理位置信息，请在设置里打开允许！");
		} else if (code == 2) {
			alert("您的浏览器地理位置信息不可用！");
		} else if (code == 3) {
			alert("获取您的地理位置信息超时，请稍后再试！");
		} else {
			alert("未知的错误！");
		}
	}
});
// =>watchId

// 3. 清除查看记录
$.geolocation("clear", watchId);
