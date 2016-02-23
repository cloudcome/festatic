/*!
 * mobile3.js
 * 2013年12月5日16:03:34
 */



$(function () {
	alert("浏览器宽=" + $(window).width());
	// 关闭广告
	var $ad1 = $("#a-d-1");
	$("#a-d-1").on("click", ".close", function () {
		$ad1.addClass("active");
	});

	_bannerInit("banner-2");
	_bannerInit("banner-3");
	_bannerInit("banner-4");
	_bannerInit("banner-5");
	_bannerInit("banner-6");
	_bannerInit("banner-7", {}, "circle", ['第11111111111个', '第<b>22222222222</b>个', '第33333333333333333个', '第4个第4个第4个第4个第4个第4个']);
	_bannerInit("banner-8", {}, "square");
	_bannerInit("banner-9", {}, "square");
	_bannerInit("banner-10", {}, "circle");
	_bannerInit("banner-11");

	// 展开
	$("#expand-1").on("click", ".icon-down-open", function () {
		$(this).closest("li").addClass("active").siblings().removeClass("active");
		return false;
	}).on("click", ".icon-up-open", function () {
		$(this).closest("li").removeClass("active");
		return false;
	});


	// 返回顶部
	$("#footer-1").on("click", ".back-top", function () {
		$("body").animate({
			scrollTop: 0
		}, 567);
		return false;
	});

	function _bannerInit(bannerId, settings, navClass, textArr) {
		var $banner = $("#" + bannerId),
			$content = $(".content", $banner),
			$items = $content.children("li"),
			$nav = $(".navigator", $banner),
			$tab = $(".tab-nav", $banner),
			$prev = $(".prev", $banner),
			$next = $(".next", $banner),
			$text = $(".text", $banner),
			nav = '';
		navClass = navClass || "circle";
		$items.each(function () {
			nav += '<i class="' + navClass + '"></i>';
		});
		options = $.extend({}, {
			onafterchange: function (index) {
				if ($nav.length) {
					$nav.find("i").eq(index).addClass("active").siblings().removeClass("active");
				}

				if ($tab.length) {
					$tab.find("li").eq(index).addClass("active").siblings().removeClass("active");
				}

				if ($text.length && textArr && textArr.length) {
					$text.html(textArr[index]);
				}
			}
		}, settings);

		$banner.banner(options);

		if ($nav.length) {
			$nav.html(nav).find("i").first().addClass("active");
			$nav.on("click", "i", function () {
				$banner.banner($(this).index());
			});
		}

		if ($tab.length) {
			$tab.on("click", "li", function () {
				$banner.banner($(this).index());
			});
		}

		if ($prev.length) {
			$prev.click(function () {
				$banner.banner("prev");
			});
		}

		if ($next.length) {
			$next.click(function () {
				$banner.banner("next");
			});
		}

		if ($text.length && textArr && textArr.length) {
			$text.html(textArr[0]);
		}
	}
});
