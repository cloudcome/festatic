/*!
 * jquery.fn.dialog
 * @author ydr.me
 * @require http://festatic.aliapp.com/js/jquery-dialog/css/default.min.css
 * @require http://festatic.aliapp.com/js/jquery-drag/latest/jquery-drag.min.js
 * @version 1.5
 * 2014年7月6日18:41:18
 */


/**
 * v1.5
 * 2014年2月18日20:51:19
 * 修复了重载dialog的部分BUG，完善了部分API
 * 2014年5月31日19:54:21
 * 修改了样式加载错误信息为控制台输出
 *
 * v1.6
 * 2014年7月6日18:41:20
 * 重写，OPP
 * 
 */



/**
 *
 * 1、创建对话框
 * $.fn.dialog({
 *      css:...,
 *      width:...,
 *      height:...,
 *      ...
 * });
 *
 * 2、弹出对话框
 * $.fn.dialog("open",[options],[callback]);
 *
 * 3、关闭对话框
 * $.fn.dialog("close",[callback]);
 *
 * 4、根据对话框大小重新定位
 * $.fn.dialog("position",[callback]);
 *
 */


/*!
 * jquery.fn.scrollbar
 * @author ydr.me
 * @version 1.2
 * @require http://festatic.aliapp.com/css/jquery-scrollbar/default.min.css
 * @require http://festatic.aliapp.com/js/jquery-drag/latest/jquery-drag.min.js
 * @require http://festatic.aliapp.com/js/jquery-mousewheel/latest/jquery-mousewheel.min.js
 * 2014年7月3日18:18:53
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
 *
 * v1.2
 * 2014年7月3日18:18:48
 * 重写，OOP
 * TODO: 移动设备的定点滚动
 *
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
 * $('#demo').scrollbar('x', x);
 * $('#demo').scrollbar('y', y);
 * $('#demo').scrollbar('top');
 * $('#demo').scrollbar('right');
 * $('#demo').scrollbar('bottom');
 * $('#demo').scrollbar('left');
 *
 *
 * 4、再次渲染
 * $('#demo').scrollbar('render',{
 *   width:100,
 *   height:100,
 * });
 *
 */





(function(win, udf) {
    'use strict';

    var datakey = 'jquery-scrollbar',
        $ = win.$,
        isPlaceholderScroll = _isPlaceholderScroll(),
        defaults = {
            // 区域的宽度
            width: 'auto',
            // 区域的高度
            height: 'auto',
            // 鼠标滚轮绑定轴向，默认y轴
            mousewheelAsix: 'y',
            // 定向滚动的动画时间
            duration: 345,
            // 每次滚动的速度，单位px/次
            speed: 30,
            // x轴滚动条最小宽度
            minWidth: 100,
            // y轴滚动条最小宽度
            minHeight: 100,
            // 是否可以越过边界
            // true: 在容器内滚动条到达边界后，将把鼠标滚轮事件交给外部容器
            // false: 在容器内滚动鼠标事件一直紧抓不放
            canCrossBoundary: !0,
            // x轴滚动回调
            // this：element
            // 参数1：x轴方向滚动区域占比
            onscrollx: $.noop,
            // y轴滚动回调
            // this：element
            // 参数1：y轴方向滚动区域占比
            onscrolly: $.noop
        };


    $.fn.scrollbar = function(settings) {
        // 当前第1个参数为字符串
        var run = $.type(settings) === 'string',
            // 获取运行方法时的其他参数
            args = [].slice.call(arguments, 1),
            // 复制默认配置
            options = $.extend({}, defaults),
            // 运行实例化方法的元素
            $element,
            // 实例化对象
            instance;

        // 运行实例化方法，第1个字符不能是“_”
        // 下划线开始的方法皆为私有方法
        if (run && run[0] !== '_') {
            if (!this.length) return;

            // 只取集合中的第1个元素
            $element = $(this[0]);

            // 获取保存的实例化对象
            instance = $element.data(datakey);

            // 若未保存实例化对象，则先保存实例化对象
            if (!instance) $element.data(datakey, instance = new Constructor($element[0], options)._init());

            // 防止与静态方法重合，只运行原型上的方法
            // 返回原型方法结果，否则返回undefined
            return Constructor.prototype[settings] ? Constructor.prototype[settings].apply(instance, args) : udf;
        }
        // instantiation options
        else if (!run) {
            // 合并参数
            options = $.extend(options, settings);
        }

        return this.each(function() {
            var element = this,
                instance = $(element).data(datakey);

            // 如果没有保存实例
            if (!instance) {
                // 保存实例
                $(element).data(datakey, instance = new Constructor(element, options)._init());
            }
        });
    };


    function Constructor(element, options) {
        var that = this;
        that.$element = $(element);
        that.options = options;
    }

    Constructor.prototype = {
    	_init: function(){},
    };


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

})(this);
