(function($) {
	$.support.fullscreen = supportFullScreen();

	$.fn.fullscreen = function(setting) {
		//默认选项
		var defaults = {
			callback: function() {}
		};

		//覆盖选项
		var opt = $.extend({}, defaults, setting);

		$this = $(this);

		if (supportFullScreen()) {
			requestFullscreen($this[0]);
			$(document).on("fullscreenchange mozfullscreenchange webkitfullscreenchange", function() {
				opt.callback(fullscreen());
			});
		}

		return $(this);
	};

	$.fn.exitFullscreen = function(setting) {
		//默认选项
		var defaults = {
			callback: function() {}
		};
		//覆盖选项
		var opt = $.extend({}, defaults, setting);

		if (supportFullScreen()) {
			exitFullscreen();
			opt.callback();
			$(document).off('fullscreenchange mozfullscreenchange webkitfullscreenchange');
		}

		return $(this);
	};

	function supportFullScreen() {
		var doc = document.documentElement;

		return ('requestFullscreen' in doc)¦¦
		('mozRequestFullScreen' in doc && document.mozFullScreenEnabled)¦¦
		('webkitRequestFullScreen' in doc);
	}

	function fullscreen() {
		return document.fullscreen¦¦
		document.mozFullScreen¦¦
		document.webkitIsFullScreen;
	}

	function requestFullscreen(elem) {
		if (elem.requestFullscreen)
			elem.requestFullscreen();
		else if (elem.mozRequestFullScreen)
			elem.mozRequestFullScreen();
		else if (elem.webkitRequestFullScreen)
			elem.webkitRequestFullScreen();
	}

	function exitFullscreen() {
		if (document.exitFullscreen)
			document.exitFullscreen();
		else if (document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if (document.webkitCancelFullScreen)
			document.webkitCancelFullScreen();
	}

})(jQuery);