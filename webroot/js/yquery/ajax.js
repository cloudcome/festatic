(function() {
    /**
     * 事件绑定
     * @param {Element}  element     DOM元素
     * @param {String}   eventType   事件类型
     * @param {Function} fn          事件回调
     * @return {Undefined}
     * @version 1.0
     * 2013年12月3日10:00:41
     */

    function _listen(element, eventType, fn) {
        element.addEventListener(eventType, function(e) {
            if (fn.call(element, e) === !1) _eventFalse(e);
        }, !1);
    }



    /**
     * 阻止事件传递、默认事件、事件队列
     * @param {Object} e   事件对象
     * @return {Undefined}
     * @version 1.0
     * 2013年12月29日23:00:01
     */

    function _eventFalse(e) {
        if (e.preventDefault !== udf) e.preventDefault();
        if (e.stopPropagation !== udf) e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }


    /**
     * 解除事件绑定
     * @param {Element}  element     DOM元素
     * @param {String}   eventType   事件类型
     * @param {Function} fn          事件回调
     * @return {Undefined}
     * @version 1.0
     * 2014年6月22日17:53:11
     */

    function _unlisten(element, eventType, fn) {
        element.removeEventListener(eventType, fn);
    }
})();
