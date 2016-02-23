/**
 * 获取当前元素的兄弟元素集合
 * @param {String} selector 选择器，可以为空
 * @return new this
 * @version 1.0
 * 2013年12月29日2:14:20
 */
$.fn.siblings = function(selector) {
    return this._access(function() {
        var element = this[0],
            children = element.parentElement.children,
            ret = [],
            i;

        this.each.call(children, function() {
            if (!this.isEqualNode(element)) {
                if (selector) {
                    _matchesSelector(this, selector) && ret.push(this);
                } else ret.push(this);
            }
        });

        return $(ret);
    });
};



