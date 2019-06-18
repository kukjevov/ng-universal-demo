const gulp = require('gulp'),
      sass = require('gulp-sass'),
      watch = require('gulp-watch'),
      through2 = require('through2'),
      rename = require('gulp-rename'),
      file = require('gulp-file'),
      read = require('read-file'),
      handlebars = require('gulp-compile-handlebars'),
      marked = require('marked'),
      highlightjs = require('highlight.js'),
      gitVersion = require('gulp-git-version'),
      mdHelp = require('@ng/md-help');

const buildDir = './build';

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

gulp.task("copy-help", function()
{
    return gulp.src("content/help/**/*.*")
        .pipe(logCopied())
        .pipe(gulp.dest("wwwroot/dist/md"));
});

gulp.task("watch-help", ["copy-help"], function()
{
    return watch('content/help/**/*.*', { events: ['change', 'add'] })
        .pipe(through2.obj(function(vinyl, enc, cb)
                           {
                               if(vinyl.event == 'change' || vinyl.event == 'add')
                               {
                                   console.log("File '" + vinyl.basename + "' is being copied.");
                               }

                               this.push(vinyl);
                               cb();
                           }))
        .pipe(gulp.dest('wwwroot/dist/md'));
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
            branchName: process.env.BRANCH_NAME,
            buildNumber: process.env.BUILD_NUMBER,
            tagPrefix: "v",
            ignoreBranchPrefix: "[a-z]+/|(?:[a-z]+-)+\\d+/",
            pre: process.env.BUILD_TYPE == "release" ? false : true,
            suffix: process.env.SNAPSHOT_SUFFIX ? process.env.SNAPSHOT_SUFFIX : "build"
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

gulp.task('build:pdf:scss', function()
{
    return gulp.src('content/*.scss')
        .pipe(sass())
        .pipe(gulp.dest(buildDir));
});

gulp.task('build:pdf:help', function()
{
    return gulp.src('content/help/**/*.*')
        .pipe(gulp.dest(buildDir));
});

gulp.task('build:pdf:external', function()
{
    return gulp.src('content/external/**/*.*')
        .pipe(gulp.dest(`${buildDir}/external`));
});

gulp.task('build:pdf:bootstrap', function()
{
    return gulp.src('node_modules/bootstrap/dist/**/*.*')
        .pipe(gulp.dest(`${buildDir}/dist`));
});

gulp.task('build:pdf:highlightjs', function()
{
    return gulp.src('node_modules/highlight.js/styles/*.*')
        .pipe(gulp.dest(`${buildDir}/dist`));
});

gulp.task('build:pdf:index', function()
{
    return gulp.src('content/help/dokumentacia.md')
        .pipe(mdHelp.mergeMdLinksInto())
        .pipe(mdHelp.compileMdToHtml())
        .pipe(mdHelp.prepareHtml(buildDir, '.include/index.html.hbs'))
        .pipe(rename(function (path)
        {
            path.extname = "-full.html"
        }))
        .pipe(gulp.dest(buildDir));
});

gulp.task('build:pdf:index:full', function()
{
    return gulp.src(['content/help/mosia.md',
                     'content/help/prihlasovanie.md',
                     'content/help/jubula.md'])
        .pipe(mdHelp.mergeMdLinksInto())
        .pipe(mdHelp.compileMdToHtml())
        .pipe(mdHelp.prepareHtml(buildDir, '.include/index.html.hbs'))
        .pipe(rename(function (path)
        {
            path.extname = "-full.html"
        }))
        .pipe(gulp.dest(buildDir));
});

gulp.task('build:pdf',
          ['build:pdf:scss',
           'build:pdf:help',
           'build:pdf:external',
           'build:pdf:bootstrap',
           'build:pdf:highlightjs',
           'build:pdf:index',
           'build:pdf:index:full'], function(cb)
{
    gulp.src(["content/help/**/*.md"])
        .pipe(mdHelp.compileMdToHtml())
        .pipe(mdHelp.prepareHtml(buildDir, '.include/index.html.hbs'))
        .pipe(rename(function (path)
        {
            path.extname = ".html"
        }))
        .pipe(gulp.dest(buildDir))
        .on('finish', function()
        {
            cb();
        });
});