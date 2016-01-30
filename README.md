# gulp-byo-jslint

A bring-your-own JSLint plugin for Gulp.

## Isn't there already a JSLint plugin for Gulp?

Yes there is, but it is not awesome. It breaks on the first violation instead
of enumerating all warnings, hasn't been updated in a very long time and
doesn't support the latest version of JSLint.

## What do you mean "BYO"?

Bring-your-own copy of `jslint.js`, quite literaly. This plugin wont work
without it.

The use of [git submodules](https://git-scm.com/docs/git-submodule) is highly
recommended for this. No need to to wait for updates to `gulp-byo-jslint` for
new versions of JSLint. Just `git pull` in the submodule directory. What better
way to stay on the bleeding edge?

```
md submodules
cd submodules
git submodule add https://github.com/douglascrockford/JSLint.git
```

## Does it support "old" JSLint?

No editions prior to 2015-05-01 will work with this plugin. The JSLint
interface changed significantly at that time (all for the better), so there is
no going back.

Any current edition of JSLint should work fine.

## Installation

```
npm install gulp-byo-jslint --save-dev
```

## Usage

```JavaScript
'use strict';

var gulp = require('gulp');
var jslint = require('gulp-byo-jslint');

gulp.task('lint', function () {
    return gulp
        .src([
            './**/*.js', // All JavaScript files
            './**/*.json', // All JSON files
            '!./node_modules/**', // Ignore NPM
            '!./bower_components/**', // Ignore Bower
            '!./submodules/**' // Ignore Git submodules
        ])
        .pipe(jslint({
            jslint: './submodules/JSLint/jslint.js',
            options: {
                browser: true
            },
            globals: ['define', 'require']
        }));
});
```

For more information about the switches available on the `options` property,
please see [JSLint help](http://www.jslint.com/help.html).
