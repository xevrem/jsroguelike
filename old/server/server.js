'use strict';

var hapi = require('hapi'),
    routingTable = require('./routingTable');

module.exports = function (configuration) {
    var server = new hapi.Server();

    server.connection({
        port: configuration.port
    });

    server.route(routingTable(configuration));
    server.start(function () {
       console.log(configuration.appName + ' server is listening on ' + server.info.uri);
    });
};
