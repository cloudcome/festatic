/*!
 * 友窝 第3版
 * @author  ydr.me
 * @version 1.0
 */


/**
 * v1.0
 * 2014年3月15日12:09:02
 */


$(function () {
	var $bg = $('#bg'),
		$toggle = $('#main .toggle'),
		$box = $('#main .box'),
		imgWidth = 0,
		imgHeight = 0,
		$img;

	// 动态计算背景
	if ($bg.length) {
		_bg();
		$(window).resize(function () {
			if (imgWidth) {
				$img.css(_getSize());
			}
		});
	}


	$toggle.click(function () {
		var $this = $(this),
			$target = $this.next('.box');
		$box.not($target).addClass('hide');
		$target.toggleClass('hide');
		$this.toggleClass('active');
		$toggle.not($this).removeClass('active');
		return false;
	});

	$(document).click(function (e) {
		if (!$(e.target).closest('.box').length) {
			$box.addClass('hide');
			$toggle.removeClass('active');
		}
	});


	function _bg() {
		if ($(window).width() < 768) return;
		var img = new Image();
		img.onload = function () {
			// 图片宽高比
			imgWidth = img.width;
			imgHeight = img.height;
			_getSize();
			$img = $('<img src="' + webconfig.bg + '">').appendTo($bg).css(_getSize());
			$bg.fadeIn(789);
		}
		img.src = webconfig.bg;
	}

	function _getSize() {
		var
		imgRatio = imgWidth / imgHeight,
			winWidth = $(window).width(),
			winHeight = $(window).height(),
			winRatio = winWidth / winHeight,
			imgWidth2 = imgRatio > winRatio ? winHeight * imgRatio : winWidth,
			imgHeight2 = imgRatio > winRatio ? winHeight : winWidth / imgRatio;

		return {
			width: imgWidth2,
			height: imgHeight2
		};
	}

});
