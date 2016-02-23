/**
 * 友窝 第1版
 * @author  ydr.me
 */

$(function(){
	_body();
	$(window).resize(_body);
	function _body(){
		if($(window).width()>=768){
			$('body').height($(window).height());
		}else{
			$('body').css('height','auto');
		}
	}
});