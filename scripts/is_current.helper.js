'use strict';

function helper (path, strict) {
    var rPath = new RegExp(`^${path || ''}${strict ? '$' : ''}`);
    return rPath.test(this.path);
}

hexo.extend.helper.register('is_current', helper);
