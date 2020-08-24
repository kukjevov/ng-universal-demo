const {src, dest} = require('gulp'),
      sass = require('gulp-sass'),
      through2 = require('through2');

function logCopied()
{
    return through2.obj(function(vinyl, _enc, callback)
    {
        console.log("Copying follow file: '" + vinyl.path + "'");
        this.push(vinyl);

        callback();
    });
}

sass.compiler = require('sass');

function compileScss()
{
    return src('content/*.scss')
        .pipe(sass())
        .pipe(dest('wwwroot/content'));
};

exports.compileScss = compileScss;