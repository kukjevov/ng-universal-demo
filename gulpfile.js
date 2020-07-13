const {src, dest, series} = require('gulp'),
      sass = require('gulp-sass'),
      through2 = require('through2'),
      gitVersion = require('@kukjevov/gulp-git-version');

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

function prepareVersion(cb)
{
    gitVersion(
    {
        path: "config",
        filename: "version.json",
        currentVersionRegex: '"version": "(.*?)"',
        template:
`{
    "version": "{{version}}"
}`,
        extractorOptions:
        {
            buildNumber: -1,
            tagPrefix: "v",
            ignoreBranchPrefix: "[a-z]+/|(?:[a-z]+-)+\\d+/",
            pre: true,
            suffix: "beta"
        }
    }, cb);
};

const build = series(prepareVersion,
                     function buildComplete(cb)
                     {
                         console.log("Gulp build has finished");
                         cb();
                     });

exports.build = build;
exports.compileScss = compileScss;