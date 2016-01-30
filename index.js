/*!
   gulp-byo-jslint
   Copyright 2016 Ben Quarmby

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
!*/

'use strict';

var eventStream = require('event-stream');
var gulpUtil = require('gulp-util');
var colors = require('colors/safe');
var vm = require('vm');
var fs = require('fs');

var pluginName = 'gulp-byo-jslint';
var context = {};

function logWarning(warning) {
    var message = [
        '    ',
        warning.line + 1,
        ':',
        warning.column + 1,
        ': ',
        warning.message
    ];

    gulpUtil.log(colors.red(message.join('')));
}

function lintStream(spec) {
    if (!spec || !spec.jslint) {
        throw new gulpUtil.PluginError(pluginName, 'The file path to jslint is required.');
    }

    var errors = 0;

    function lint(source, callback) {
        var contents = source.contents.toString('utf8');
        var result = context.jslint(contents, spec.options, spec.globals);

        if (result.ok) {
            gulpUtil.log(colors.green(source.path));
        } else {
            gulpUtil.log(colors.red(source.path));

            errors += result.warnings.length;

            result.warnings.forEach(logWarning);
        }

        callback(null, source);
    }

    function map(source, callback) {
        if (context.jslint) {
            lint(source, callback);

            return;
        }

        fs.readFile(spec.jslint, 'utf8', function (err, jslint) {
            if (err) {
                throw new gulpUtil.PluginError(pluginName, err);
            }

            vm.runInNewContext(jslint, context);

            lint(source, callback);
        });
    }

    function onEnd() {
        if (errors) {
            var message = errors === 1
                ? 'JSLint found one error.'
                : 'JSLint found ' + errors + ' errors.';

            throw new gulpUtil.PluginError(pluginName, message);
        }
    }

    return eventStream
        .map(map)
        .on('end', onEnd);
}

module.exports = lintStream;
