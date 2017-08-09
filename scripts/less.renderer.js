'use strict';

const cfg = hexo.config.less || {};
const less = require('less');
const path = require('path');

hexo.extend.renderer.register('less', 'css', function(data, _, callback){
    var cwd = process.cwd();
    var paths = (cfg.paths || []).map(function(filepath){
        return path.join(cwd, filepath);    // assuming paths are relative from the root of the project
    });

    less.render(data.text, {
        paths: paths.concat(path.dirname(data.path)),
        filename: path.basename(data.path)
    })
    .then(function(output) {
        callback(null, output.css);
    },
    function(error){
        callback(error);
    });
});
