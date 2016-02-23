/**
 * 友窝 第2版
 * @author  ydr.me
 */

$(function () {
	_body();
	$(window).resize(_body);

	function _body() {
		if ($(window).width() >= 768) {
			$('body').height($(window).height());
		} else {
			$('body').css('height', 'auto');
		}
	}
	var $toggle = $('#main .toggle'),
		$box = $('#main .box');

	$toggle.click(function () {
		var target = $(this).data('target'),
			$target = $(target);
		$box.not($target).addClass('hide');
		$target.toggleClass('hide');
		return false;
	});
});
