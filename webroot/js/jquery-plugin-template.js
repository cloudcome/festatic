/*!
 * 插件名称
 * @author ydr.me
 * @version 1.0
 * @require 依赖信息
 * 时间
 */



/**
 * v1.0
 *
 */


(function(win, udf) {
    'use strict';

    // 保存实例化对象的data键
    var datakey = 'jquery-pluginName',
        // jquery对象 或 Yquery对象
        $ = win.$,
        // 默认参数
        defaults = {
            // 参数名，驼峰写法
            innerWidth: 100,

            // 布尔值参数，is开头，或can开头
            isShow: !0,
            canShow: !1,

            // 监听回调，小写
            // this: element
            // arg0: 参数1是什么
            // arg1: 参数2是什么
            onbeforeshow: $.noop
        };


    // 原型方法，驼峰形式
    $.fn.pluginName = function(settings) {
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

    // 暴露插件的默认配置
    $.fn.pluginName.defaults = defaults;



    // 构造函数

    function Constructor(element, options) {
        var the = this;
        the.$element = $(element);
        the.options = options;
    }


    // 原型方法，驼峰写法
    Constructor.prototype = {
        /**
         * 初始化
         * @return this
         * @version 1.0
         * 2014年7月3日19:49:20
         */
        _init: function() {
            // 初始化
            return this;
        },


        // 其他私有原型方法
        _otherPrivatePrototypeFunction: function() {
            // do sth
        },


        /**
         * 设置或获取选项
         * @param  {String/Object} key 键或键值对
         * @param  {*}             val 值
         * @return 获取时返回键值，否则返回this
         * @version 1.0
         * 2014年7月3日20:08:16
         */
        options: function(key, val) {
            // get
            if ($.type(key) === 'string' && val === udf) return this.options[key];

            var map = {};
            if ($.type(key) === 'object') map = key;
            else map[key] = val;

            this.options = $.extend(this.options, map);
        },


        // 其他公有原型方法
        otherPublicPrototypeFunction: function() {
            // do sth
        }
    };
})(this);
