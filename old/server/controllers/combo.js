'use strict';

/*
 * This combo loader enables concatenation of similar server resources into a
 * single HTTP request: CSS, JavaScript, JSON, etc.
 *
 */

var mimeTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.txt': 'text/plain',
        '.xml': 'application/xml'
    },

    async = require('async'),
    fs = require('fs'),
    path = require('path'),
    url = require('url');

module.exports = {
    loader: {
        handler: function (request, response) {
            var error,
                clientPath = path.join(__dirname, '../../public'),
                content = [],
                fileType,
                lastModifiedTime = new Date(0);

            // Iterate the requested resources in order...
            async.eachSeries(Object.keys(request.query).map(function (item) {
                return item + '.' + Object.keys(request.query[item]).pop();
            }), function (filePath, callback) {
                var extension = path.extname(filePath),
                    fullPath;

                if (!fileType) {
                    fileType = extension;
                } else if (fileType !== extension) {
                    // If two or more resources don't match in MIME type, report an error.
                    // We cannot concatenate JS to CSS, for example...
                    error = new Error('MIME-Type mismatch: Only one MIME-Type allowed per request');
                    callback(error);
                    return;
                }

                fullPath = path.join(clientPath, filePath);

                // Verify that the requested resource exists
                fs.exists(fullPath, function (exists) {
                    if (!exists) {
                        // If it doesn't exist, report an error
                        error = new Error('File not found: ' + fullPath);
                        callback(error);
                        return;
                    }

                    // Get the resource's metadata
                    fs.stat(fullPath, function (error, stats) {
                        var lastWriteTime;

                        if (error) {
                            callback(error);
                            return;
                        }

                        // Since we're concatenating several resources,
                        // we want to set the "last modified" time of the
                        // HTTP response to be the most recent mtime of
                        // the requested resources.
                        lastWriteTime = new Date(stats.mtime);

                        if (lastWriteTime > lastModifiedTime) {
                            lastModifiedTime = lastWriteTime;
                        }

                        // Read the resource file
                        fs.readFile(fullPath, 'utf8', function (error, text) {
                            var cssBasePath = '/public',
                                cssRegEx = /(?:\@import)?\s*url\(\s*(['"]?)(\S+?)\1\s*\)/g;

                            if (error) {
                                callback(error);
                                return;
                            }

                            // If the resource is CSS, rewrite any URL paths to work with our static content routes
                            if (extension === '.css') {
                                text = text.replace(cssRegEx, function (match, p1, p2) {
                                    var resourcePath = p2,
                                        uri = match,
                                        isRelativePath = function (path) {
                                            var absolute = path.resolve(path),
                                                normal = path.normalize(path);

                                            return normal !== absolute;
                                        },
                                        isOutsideUrl = function (theUrl) {
                                            return url.parse(theUrl).protocol;
                                        };

                                    if (!isRelativePath(uri) || isOutsideUrl(uri)) {
                                        return uri;
                                    }

                                    return uri.replace(resourcePath, path.join(cssBasePath, resourcePath));
                                });
                            }

                            // Add the contents of the resource to the content array
                            content.push(text);
                            callback();
                        });
                    });
                });
            }, function (error) {
                if (error) {
                    // Log any error encountered and return an HTTP 500 response
                    console.error(error);
                    response().code(500);
                    return;
                }

                // Concatenate the contents of the content array and repsond with the appropriate MIME type header
                response(content.join('\n')).type(mimeTypes[fileType] || 'text/plain');
            });
        }
    }
};
