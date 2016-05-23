'use strict';

var controllers,
    method = {
        get: 'GET',
        post: 'POST'
    },
    requireDirectory = require('require-directory');

controllers = requireDirectory(module, './controllers');

module.exports = function (configuration) {
    var client = controllers.client,
        combo = controllers.combo;

    return [
        {   // Server root route
            config: client.index,
            method: method.get,
            path: '/'
        },

        {   // Combo loader route
            config: combo.loader,
            method: method.get,
            path: '/combo'
        },

        {   // Static content route
            config: client.base,
            method: method.get,
            path: '/public/{param*}'
        }
    ];
};
