const gulp = require('gulp'),
      sass = require('gulp-sass'),
      watch = require('gulp-watch'),
      through2 = require('through2'),
      gitVersion = require('@kukjevov/gulp-git-version');

function logCopied()
{
    return through2.obj(function(vinyl, enc, callback)
    {
        console.log("Copying follow file: '" + vinyl.path + "'");
        this.push(vinyl);

        callback();
    });
}

gulp.task("copy-config", function()
{
    return gulp.src("config/i18n/**/*.json")
        .pipe(logCopied())
        .pipe(gulp.dest("wwwroot/config/i18n"));
});

gulp.task("watch-config", ["copy-config"], function()
{
    return watch('config/i18n/**/*.json', { events: ['change', 'add'] })
        .pipe(through2.obj(function(vinyl, enc, cb)
                           {
                               if(vinyl.event == 'change' || vinyl.event == 'add')
                               {
                                   console.log("File '" + vinyl.basename + "' is being copied.");
                               }

                               this.push(vinyl);
                               cb();
                           }))
        .pipe(gulp.dest('wwwroot/config/i18n'));
});

gulp.task("compile-scss", function()
{
    return gulp.src('content/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('wwwroot/content'));
});

gulp.task("prepare-version", function(cb)
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
});

gulp.task("build",
          ["copy-config",
           "prepare-version"],
          function(cb)
{
    console.log("Gulp build has finished");

    cb();
});
