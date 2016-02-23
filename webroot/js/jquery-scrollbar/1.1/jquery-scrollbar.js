/*!
 * jquery.fn.scrollbar
 * @author ydr.me
 * @for ie6+,chrome,firefox
 * @version 1.1
 */


/**
 * v1.0
 * 2013年11月8日9:49:18
 * 构造
 *
 * v1.1
 * 2014年3月11日0:18:30
 * 手动重新渲染
 * 兼容到ie6
 * 滚动条样式：普通、hover、drag、scroll
 * 2014年3月12日10:02:56
 * 修复在内容高度小于预设高度时的BUG
 * 2014年3月19日22:57:27
 * 修复无法触摸滚动的BUG，不过还有些不顺畅
 * 2014年3月20日22:48:25
 * 修正了触摸滚动
 * 增加了判断是否为占位滚动条，
 * 如果是不占位滚动条则由浏览器原生驱动滚动条
 * 2014年4月7日14:44:51
 * 再次修正了触摸滚动条，增加了 -webkit-overflow-scrolling:touch 属性
 * 2014年5月30日23:24:40
 * 增加了对超过滚动条到达容器边缘的检测
 */


/**
 * 1、初始化
 * $('#demo').scrollbar({...});
 *
 *
 * 2、获取位置
 * $('#demo').scrollbar('x');
 * $('#demo').scrollbar('y');
 *
 *
 * 3、定点滚动
 * $('#demo').scrollbar('x',x,duration);
 * $('#demo').scrollbar('y',y,duration);
 * $('#demo').scrollbar('top',duration);
 * $('#demo').scrollbar('right',duration);
 * $('#demo').scrollbar('bottom',duration);
 * $('#demo').scrollbar('left',duration);
 *
 *
 * 4、再次渲染
 * $('#demo').scrollbar('render',{
 *   width:100,
 *   height:100,
 * });
 *
 */


(function($, undefined) {

    var _,
        // 前缀
        prefix = 'jquery-scrollbar____',
        // 是否为占位滚动条
        isPlaceholderScroll = _isPlaceholderScroll(),
        // 是否加载了css
        hasLoadCss = 0,
        hoverClass = 'hover',
        dragClass = 'drag',
        scrollClass = 'scroll',
        defaults = {
            // 样式
            css: 'http://festatic.aliapp.com/css/jquery-scrollbar/default.min.css',
            // 区域的宽度
            width: 'auto',
            // 区域的高度
            height: 'auto',
            // 是否允许鼠标转轮来触发滚动（必须先引用jquery-mousewheel.js）
            canMousewheel: true,
            // 鼠标滚轮绑定方向，默认垂直
            mousewheelDirection: 'y',
            // 是否允许触摸滑动来触发滚动（必须先引用jquery-swipe.js）
            // canSwipe: true,
            // 定向滚动的动画时间
            duration: 100,
            // 每次滚动的速度，单位px/次
            speed: 10,
            // 是否可以越过边界
            // true: 在容器内滚动条到达边界后，将把鼠标滚轮事件交给外部容器
            // false: 在容器内滚动鼠标事件一直紧抓不放
            canCrossBoundary: true
        };

    $.fn.scrollbar = function(settings) {
        var args = arguments,
            argL = args.length,
            $this0 = $(this).eq(0),
            _hasInit = $this0.data(prefix + 'hasInit'),
            $temp;

        if (args[0] == 'x' && argL == 1 && _hasInit) {
            $temp = $this0.data(prefix + '$barX');
            return $temp.css('left');
        } else if (args[0] == 'y' && argL == 1 && _hasInit) {
            $temp = $this0.data(prefix + '$barY');
            return $temp.css('top');
        }

        return this.each(function() {
            var _,
                hasInit,
                $div = $(this),
                $body,
                $container,
                x0 = 0,
                maxL = 0,
                y0 = 0,
                maxT = 0,
                $barX, $barY;

            if ($div.data(prefix + 'hasInit') === undefined) $div.data(prefix + 'hasInit', 0);
            hasInit = $div.data(prefix + 'hasInit');

            if ($.type(args[0]) == 'string' && hasInit) {
                x0 = parseInt($div.scrollbar('x'));
                y0 = parseInt($div.scrollbar('y'));
                maxL = $div.data(prefix + 'max-barLeft');
                maxT = $div.data(prefix + 'max-barTop');
                if (args[0] === 'x') {
                    _x($div, args[1] - x0, true, args[2]);
                } else if (args[0] === 'y') {
                    _y($div, args[1] - y0, true, args[2]);
                } else if (args[0] === 'top') {
                    _y($div, -y0, true, args[1]);
                } else if (args[0] === 'bottom') {
                    _y($div, maxT - y0, true, args[1]);
                } else if (args[0] === 'left') {
                    _x($div, -x0, true, args[1]);
                } else if (args[0] === 'right') {
                    _x($div, maxL - x0, true, args[1]);
                } else if (args[0] === 'render') {
                    _render($div, args[1]);
                }
            } else if ($.type(args[0]) == 'object') {
                if (!hasInit) {
                    var options = $.extend({}, defaults, args[0]);

                    if (hasLoadCss) {
                        _init();
                    } else {
                        $('<link rel="stylesheet" href="' + options.css + '" />').appendTo("head").load(function() {
                            hasLoadCss = 1;
                            _init();
                        }).error(function() {
                            alert('jquery-scrollbar样式加载失败！');
                        });
                    }

                    function _init() {
                        // 套一层 body
                        $div.wrap('<div class="' + prefix + 'body"></div>');
                        $body = $div.parent('.' + prefix + 'body');

                        // 再套一层 container
                        $body.wrap('<div class="' + prefix + 'container"></div>');
                        $container = $body.parent('.' + prefix + 'container');

                        $barX = $('<div class="' + prefix + 'x"></div>').appendTo($container);
                        $barY = $('<div class="' + prefix + 'y"></div>').appendTo($container);


                        $div.data(prefix + 'hasInit', 1);
                        $div.data(prefix + 'options', options);
                        $div.data(prefix + '$container', $container);
                        $div.data(prefix + '$body', $body);
                        $div.data(prefix + '$barX', $barX);
                        $div.data(prefix + '$barY', $barY);

                        _render($div);

                        if (!isPlaceholderScroll) {
                            $barX.hide();
                            $barY.hide();
                            $container.css({
                                'overflow': 'scroll',
                                'position': 'relative'
                            });
                            $container[0].style['-webkit-overflow-scrolling'] = 'touch';
                            return;
                        }

                        $container.css({
                            'overflow': 'hidden',
                            'position': 'relative'
                        });



                        if (options.canMousewheel && $.fn.mousewheel) {
                            $container.mousewheel({
                                onmousewheel: function(y) {
                                    if (options.mousewheelDirection === 'y' && y) {
                                        $barY.addClass(scrollClass);
                                        _y($div, -y * options.speed);
                                    } else if (options.mousewheelDirection === 'x' && y) {
                                        $barX.addClass(scrollClass);
                                        _x($div, -y * options.speed);
                                    }
                                },
                                onmousewheelstop: function() {
                                    if (options.mousewheelDirection === 'y') $barY.removeClass(scrollClass);
                                    if (options.mousewheelDirection === 'x') $barX.removeClass(scrollClass);
                                }
                            });
                        }



                        // 单击记录下位置
                        $barX.mousedown(function(e) {
                            var x0 = e.pageX;
                            $(this).addClass(dragClass).data(prefix + 'isScroll', 1).data(prefix + 'x0', x0);
                            return false;
                        }).hover(function() {
                            $(this).addClass('hover');
                        }, function() {
                            $(this).removeClass('hover');
                        });


                        // 单击记录下位置
                        $barY.mousedown(function(e) {
                            var y0 = e.pageY;
                            $(this).addClass(dragClass).data(prefix + 'isScroll', 1).data(prefix + 'y0', y0);
                            return false;
                        }).hover(function() {
                            $(this).addClass('hover');
                        }, function() {
                            $(this).removeClass('hover');
                        });

                        $(document).mousemove(function(e) {
                            var x0 = 0,
                                y0 = 0,
                                x1 = e.pageX,
                                y1 = e.pageY;

                            if ($barX && $barX.data(prefix + 'isScroll')) {
                                x0 = $barX.data(prefix + 'x0');
                                $barX.data(prefix + 'x0', x1);
                                _x($div, x1 - x0);
                                return false;
                            }

                            if ($barY && $barY.data(prefix + 'isScroll')) {
                                y0 = $barY.data(prefix + 'y0');
                                $barY.data(prefix + 'y0', y1);
                                _y($div, y1 - y0);
                                return false;
                            }
                        }).mouseup(function() {
                            $barX.removeClass(dragClass).data(prefix + 'isScroll', 0);
                            $barY.removeClass(dragClass).data(prefix + 'isScroll', 0);
                        });
                    }
                }
            }


            /**
             * 渲染滚动条
             * @param  {Object} 生成滚动条的对象
             * @param  {Object} 渲染滚动条的参数
             * @version 1.0
             * 2014年3月6日22:27:06
             */

            function _render($div, settings) {
                var _,
                    // 参数
                    options = $div.data(prefix + 'options'),
                    opsW = options.width,
                    opsH = options.height,
                    $container = $div.data(prefix + '$container'),
                    $barX = $div.data(prefix + '$barX'),
                    $barY = $div.data(prefix + '$barY'),
                    // 内容的宽度
                    divW = $div.outerWidth(),
                    // 内容的高度
                    divH = $div.outerHeight();

                if (settings && settings.width) opsW = settings.width;
                if (settings && settings.height) opsH = settings.height;
                options.width = opsW;
                options.height = opsH;
                $div.data(prefix + 'options', options);

                $container.width(opsW).height(opsH);

                if (!/auto/.test(opsW)) {
                    divW > opsW ? $barX.show() : $barX.hide();
                }

                if (!/auto/.test(opsH)) {
                    divH > opsH ? $barY.show() : $barY.hide();
                }

                _x($div, 0);
                _y($div, 0);
            }


            /**
             * 水平滚动，以滚动条为基准
             * @param  {Object} 生成滚动条的对象
             * @param  {Number} 滚动条滚动的距离
             * @param  {Boolean} 是否运动效果
             * @param  {Number} 消耗时间
             * @return {Undefined}
             * @version 1.0
             * 2013年10月27日18:01:30
             */

            function _x($div, x1, isAnimate, duration) {
                var _,
                    // 参数
                    options = $div.data(prefix + 'options'),
                    // 外部容器
                    $container = $div.data(prefix + '$container'),
                    // 内容容器
                    $body = $div.data(prefix + '$body'),
                    // 滚动条
                    $barX = $div.data(prefix + '$barX'),
                    // 上一次位置
                    x0 = parseInt($barX.css('left')),
                    // 新位置
                    x2 = x0 + x1,
                    // 内容的宽度
                    divW = $div.outerWidth(),
                    // 可视宽度与内容宽度比
                    ratio = options.width / divW,
                    // 滚动条的宽度
                    barW = ratio * options.width,
                    // 滚动条最大左位移
                    barL = options.width - barW,
                    // 内容左边距
                    bodyML = 0;


                // 可视宽度 >= 内容宽度
                if (ratio >= 1) {
                    $barX.hide();
                    barL = 0;
                    bodyML = 0;
                    barW = 0;
                    x2 = 0;
                } else {
                    $barX.show();
                    if ((x2 <= 0 || x2 >= barL) && options.mousewheelDirection === 'x' && options.canCrossBoundary) {
                        $container.mousewheel('disabled');
                    } else {
                        $container.mousewheel('enabled');
                    }
                    if (x2 <= 0) x2 = 0;
                    if (x2 >= barL) x2 = barL;
                    bodyML = -x2 / ratio;
                }


                $div.data(prefix + 'max-barLeft', barL);
                $barX.width(barW);
                if (isAnimate) {
                    $barX.stop(1, 1).animate({
                        'left': x2
                    }, duration || options.duration);
                    $body.stop(1, 1).animate({
                        'margin-left': bodyML
                    }, duration || options.duration);
                } else {
                    $barX.css('left', x2);
                    $body.css('margin-left', bodyML);
                }
            }

            /**
             * 垂直滚动，以滚动条为基准
             * @param  {Object} 生成滚动条的对象
             * @param  {Number} 滚动条滚动的距离
             * @param  {Boolean} 是否运动效果
             * @param  {Number} 消耗时间
             * @return {Undefined}
             * @version 1.0
             * 2013年10月27日18:01:30
             */

            function _y($div, y1, isAnimate, duration) {
                var _,
                    // 参数
                    options = $div.data(prefix + 'options'),
                    // 外部容器
                    $container = $div.data(prefix + '$container'),
                    // 内容容器
                    $body = $div.data(prefix + '$body'),
                    // 滚动条
                    $barY = $div.data(prefix + '$barY'),
                    // 上一次位置
                    y0 = parseInt($barY.css('top')),
                    // 新位置
                    y2 = y0 + y1,
                    // 内容的高度
                    divH = $div.outerHeight(),
                    // 可视高度与内容高度比
                    ratio = options.height / divH,
                    // 滚动条的高度
                    barH = ratio * options.height,
                    // 滚动条最大上位移
                    barT = options.height - barH,
                    // 内容上边距
                    bodyMT = 0;

                // 可视高度 >= 内容高度
                if (ratio >= 1) {
                    $barY.hide();
                    barT = 0;
                    bodyMT = 0;
                    barH = 0;
                    y2 = 0;
                } else {
                    $barY.show();
                    if ((y2 <= 0 || y2 >= barT) && options.mousewheelDirection === 'y' && options.canCrossBoundary) {
                        $container.mousewheel('disabled');
                    } else {
                        $container.mousewheel('enabled');
                    }
                    if (y2 <= 0) y2 = 0;
                    if (y2 >= barT) y2 = barT;
                    bodyMT = -y2 / ratio;
                }

                $div.data(prefix + 'max-barTop', barT);
                $barY.height(barH);
                if (isAnimate) {
                    $barY.stop(1, 1).animate({
                        'top': y2
                    }, duration || options.duration);
                    $body.stop(1, 1).animate({
                        'margin-top': bodyMT
                    }, duration || options.duration);
                } else {
                    $barY.css('top', y2);
                    $body.css('margin-top', bodyMT);
                }
            }

        });
    };
    $.fn.scrollbar.defaults = defaults;


    /**
     * 判断是否为占位（占用内容区域）的滚动条
     * 这通常是非手机浏览器
     * @return {Boolean}
     * @version 1.0
     * 2014年3月20日22:48:43
     */

    function _isPlaceholderScroll() {
        var $div = $('<div>').css({
            width: 100,
            height: 100,
            position: 'absolute',
            top: -999999,
            left: -999999,
            padding: 0,
            margin: 0,
            overflow: 'scroll'
        }).appendTo('body'),
            divClientWidth = $div[0].clientWidth;
        $div.remove();
        return divClientWidth < 100;
    }




})(jQuery);
