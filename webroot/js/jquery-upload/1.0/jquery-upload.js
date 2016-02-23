/*!
 * jquery.fn.upload.js
 * @author ydr.me
 * @version 1.0
 */

/**
 * v1.0 2013年12月26日16:25:14
 * 		2014年2月19日21:18:50
 */


/**
 * v1.0 使用html5 formData对象和html4的form提交，主要用于多文件同时上传
 * 		文件上传使用inputName_index来命名name，用于区分文件的索引匹配
 * 		html5中，分别计算各个input的完成回调
 * 		html4中，统一计算所有input的完成回调
 * 		限制数据接收类型为JSON
 * 		修正了一处传递数据的错误
 */


/**
 * $("#file").upload({...});
 */


;
(function ($, win, undefined) {
	var _,
		doc = win.document,
		body = doc.body,

		// 是否支持HTML5的 input 的 files 属性
		isSupportFiles = doc.createElement("input").files === null || "files" in doc.createElement("input"),

		// 是否支持HTML5的 FormData 对象
		isSupportFormData = !! window.FormData,

		isHTML5 = isSupportFiles && isSupportFormData,
		// isHTML5 = false,

		// 空函数
		emptyFn = function () {},

		// 文件类型对应关系
		fileTypeRelationship = {
			"image/png": "png",
			"image/jpeg": "jpg",
			"image/gif": "gif",
			"text/plain": "txt"
		},

		// 默认参数
		defaults = {
			// 提交地址
			action: "",
			// 传递额外数据（键值对字符串）
			data: null,
			// 表单文件的name值
			inputName: "file",
			// 文件最小容量（单位B，默认0）
			minSize: 0,
			// 文件最大容量（单位B，默认1M=1024KB=1024*1024B）
			maxSize: 1048576,
			// 文件类型（文件后缀）
			fileType: ["png", "jpg", "jpeg", "gif"],
			// 错误消息提示
			errorMsg: {
				// 单文件上传错误或失败
				singleError: "第{n}个文件上传错误或失败",
				// 多文件上传错误或失败
				multiError:"上传错误或失败",
				// 单文件未选择
				singleNone: "尚未选择第{n}个上传文件",
				// 多文件未选择
				multiNone:"尚未选择任何上传文件",
				// 多文件列表为空
				empty: "待上传文件为空",
				// 单、多文件错误，{n}表示该文件的序号，开始序号为1
				type: "第{n}个文件类型不符合要求",
				size: "第{n}个文件容量不符合要求"
			},
			// 完成回调，无论成功还是失败
			oncomplete: emptyFn,
			// 成功回调
			onsuccess: emptyFn,
			// 失败回调
			onerror: emptyFn,
			// 进度回调
			onprogress: emptyFn
		};

	$.support.inputFiles = isSupportFiles;
	$.support.formData = isSupportFormData;

	$.fn.upload = function (settings) {
		var options = $.extend({}, defaults, settings),
			errorArr = [],
			successArr = [],
			numSuccess = 0,
			numError = 0,
			maxCount = this.length,
			maxSuccess = 0,
			maxError = 0;

		return this.each(function (index) {
			var files,
				hasComplete = 0,
				bType,
				bSize,
				i = 0,
				j = 0,
				k = 0,
				file,
				_this = this,
				formData;

			if (isHTML5) {
				errorArr = [];
				formData = new FormData();
				files = _this.files;
				j = files.length;
				for (; i < j; i++) {
					file = files[i];
					bType = _checkFileType(file);
					bSize = _checkFileSize(file);
					if (bType && bSize) {
						k++;
						formData.append(options.inputName + "_" + i, file);
					} else if (!bType) {
						errorArr.push(_error("type", i));
					} else if (!bSize) {
						errorArr.push(_error("size", i));
					}
				};
				// end for
				if (!j) {
					errorArr.push(_error("multiNone", 0));
					hasComplete = 1;
				} else {
					if (k) _h5Upload(formData);
					else {
						errorArr.push(_error("empty", 0));
						hasComplete = 1;
					}
				}
				if (errorArr.length) options.onerror(errorArr);
				if (hasComplete) options.oncomplete();
			} else {
				bType = _checkFileType(_this);
				bSize = _checkFileSize(_this);
				if (bType && bSize) {
					_h4Upload(_this);
				} else if (_this.value === "" || _this.value === undefined || _this.value === null) {
					errorArr.push(_error("singleNone", index));
					// 错误+1
					numError++;
					// 错误上限+1
					maxError++;
				} else if (!bType) {
					errorArr.push(_error("type", index));
					// 错误+1
					numError++;
					// 错误上限+1
					maxError++;
				}
				// 全错
				if (maxError + maxSuccess == maxCount) {
					options.onerror(errorArr);
					options.oncomplete();
				}
			}



			// 检测文件类型是否合法

			function _checkFileType(file) {
				var type = "",
					val = "";
				if (isHTML5) {
					type = fileTypeRelationship[file.type] || "";
				} else {
					val = file.value;
					if (val !== "") {
						type = (val.match(/\.([^\.]*)$/) || ["", ""])[1];
					}
				}
				return $.inArray(type.toLowerCase(), options.fileType) >= 0;
			}


			// 检测文件容量是否合法

			function _checkFileSize(file) {
				var size = 1;
				if (isHTML5) {
					size = file.size;
				}
				return size >= options.minSize && size <= options.maxSize;
			}



			// 添加表单数据

			function _appendData(data, formData) {
				var inputString = "";
				data && $.each(data, function (k, v) {
					var sk = String(k),
						sv = String(v);
					if (isHTML5) {
						formData.append(sk, sv);
					} else {
						inputString += '<input type="hidden" name="' + sk + '" value="' + sv + '" />';
					}
				});
				return isHTML5 ? formData : inputString;
			}



			// html5上传

			function _h5Upload(data) {
				var xhr = new XMLHttpRequest(),
					hasCallback = 0;
				data = _appendData(options.data, data);
				xhr.onloadend = options.oncomplete;
				xhr.onload = function () {
					var response, json = {};
					if (xhr.readyState == 4 && !hasCallback && xhr.status == 200) {
						hasCallback = 1;
						response = xhr.responseText;
						if (response !== "") {
							try {
								json = $.parseJSON(response);
							} catch (e) {}
						}
						$.isEmptyObject(json) ? options.onerror([_error("multiError", 0)]) : options.onsuccess(json);
					}
				}
				xhr.onerror = function () {
					options.onerror([_error("multiError", 0)]);
				}
				xhr.upload.onprogress = function (e) {
					options.onprogress(e);
				}
				xhr.open("post", options.action);
				xhr.send(data);
			}

			// html4上传

			function _h4Upload(fileObj) {
				var _,
					$file = $(fileObj),
					oldName = $file.attr("name"),
					$fileClone,
					newName = options.inputName + "_" + index,
					hasCallback = 0,
					id = (new Date().getTime()) + "-" + ((Math.random() + "").replace(".", "")),
					$iframe = $('<iframe src="javascript:false" name="iframe-name-' + id + '" style="display:none;"></iframe>').appendTo(body),
					$form = $('<form action="' + options.action + '" method="post" enctype="multipart/form-data" target="iframe-name-' + id + '" style="display:none;"></form>').appendTo(body),
					$button = $('<input type="submit">').appendTo($form);

				$form.append(_appendData(options.data));

				// 复制input:file到原地
				$fileClone = $file.clone(true, true).insertAfter(fileObj);

				// 原始input:file添加到表单
				$file.removeAttr("id").appendTo($form);
				$file.attr("name", newName);

				if (!hasCallback) {
					$iframe.load(function () {
						var content = $(this).contents().find("body").html(),
							json = {};
						_done();

						if (content !== "") {
							try {
								json = $.parseJSON(content);
							} catch (e) {}
						}

						// 空返回，错误
						if ($.isEmptyObject(json)) {
							// 错误上限+1
							maxError++;
							// 错误+1
							numError++;
							errorArr.push(_error("singleError", 0));
						} else {
							// 正确上限+1
							maxSuccess++;
							// 正确+1
							numSuccess++;
							successArr.push(json);
						}

						if (numSuccess + numError == maxCount) {
							if (numError == maxError) options.onerror(errorArr);
							if (numSuccess == maxSuccess) options.onsuccess(successArr);
							options.oncomplete();
						}
					}).error(function () {
						_done();
						// 错误上限+1
						maxError++;
						// 错误+1
						numError++;
						// 完成+1

						errorArr.push(_error("singleError", 0));
						if (numSuccess + numError == maxCount) {
							if (numError == maxError) options.onerror(errorArr);
							options.oncomplete();
						}
					});
				}

				function _done() {
					// 原始input:file添加到原地
					$file.attr("name", oldName);
					$file.insertBefore($fileClone);

					// 删除克隆的input:file
					$fileClone.remove();

					// 移除iframe
					$iframe.remove();

					// 移除表单
					$form.remove();

					// 标记回调结束
					hasCallback = 1;
				}

				$button.trigger("click");
			}
		});


		// 创建错误消息

		function _error(type, i) {
			return options.errorMsg[type].replace("{n}", i + 1);
		}
	}

	// 默认参数
	$.fn.upload.defaults = defaults;



	// 注册文件类型对应关系
	$.fn.upload.addTypeRelationship = function (key, value) {
		var type = $.type(key);
		if (type == "object") {
			fileTypeRelationship = $.extend({}, fileTypeRelationship, key);
		} else if (type == "string") {
			fileTypeRelationship[key] = value;
		}
		return fileTypeRelationship;
	}

})($, this);
