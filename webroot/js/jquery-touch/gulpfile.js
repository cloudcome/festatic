
var compare = function(v1, v2, operator) {
  var compare, i, numVersion, prepVersion, vm, x, _i;
  i = x = compare = 0;
  vm = {
    'dev': -6,
    'alpha': -5,
    'a': -5,
    'beta': -4,
    'b': -4,
    'RC': -3,
    'rc': -3,
    '#': -2,
    'p': -1,
    'pl': -1
  };
  prepVersion = function(v) {
    v = ('' + v).replace(/[_\-+]/g, '.');
    v = v.replace(/([^.\d]+)/g, '.$1.').replace(/\.{2,}/g, '.');
    if (!v.length) {
      return [-8];
    } else {
      return v.split('.');
    }
  };
  numVersion = function(v) {
    if (!v) {
      return 0;
    } else {
      if (isNaN(v)) {
        return vm[v] || -7;
      } else {
        return parseInt(v, 10);
      }
    }
  };
  v1 = prepVersion(v1);
  v2 = prepVersion(v2);
  x = Math.max(v1.length, v2.length);
  for (i = _i = 0; 0 <= x ? _i <= x : _i >= x; i = 0 <= x ? ++_i : --_i) {
    if (v1[i] === v2[i]) {
      continue;
    }
    v1[i] = numVersion(v1[i]);
    v2[i] = numVersion(v2[i]);
    if (v1[i] < v2[i]) {
      compare = -1;
      break;
    } else if (v1[i] > v2[i]) {
      compare = 1;
      break;
    }
  }
  if (!operator) {
    return compare;
  }
  switch (operator) {
    case '>':
    case 'gt':
      return compare > 0;
    case '>=':
    case 'ge':
      return compare >= 0;
    case '<=':
    case 'le':
      return compare <= 0;
    case '==':
    case '=':
    case 'eq':
    case 'is':
      return compare === 0;
    case '<>':
    case '!=':
    case 'ne':
    case 'isnt':
      return compare !== 0;
    case '':
    case '<':
    case 'lt':
      return compare < 0;
    default:
      return null;
  }
};


var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var cssmin = require('gulp-minify-css');
var imgmin = require('gulp-imagemin');
var jsmin = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var filter = require('gulp-filter');



// 1. 复制最大版本
gulp.task('version', function() {
    // 找到版本号最大的文件夹
    var dirs = fs.readdirSync('./');
    var maxVersion = 1.0;
    dirs.forEach(function(dir) {
        var version;
        stats = fs.lstatSync(dir);
        if (stats.isDirectory()) {
            if (compare(dir, '1.0','>=')) {
                maxVersion = dir;
            }
        }
    });

    return gulp.src('./' + maxVersion + '/*.js').pipe(gulp.dest('./latest'));
});


// 2. 压缩 => 重命名
gulp.task('min', ['version'], function() {
    return gulp.src('./*/*.js').pipe(jsmin({
        preserveComments: 'some'
    })).pipe(filter(function(file) {
        var basename = path.basename(file.path, '.js');
        return !/\.min$/.test(basename);
    })).pipe(rename({
        extname: '.min.js'
    })).pipe(gulp.dest('./'));
});


gulp.task('default', ['version', 'min']);
