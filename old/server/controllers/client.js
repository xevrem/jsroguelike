'use strict';

module.exports = {
    base: {
        handler: {
            directory: {
                path: 'public'
            }
        }
    },

    index: {
        handler: function (request, response) {
            response.file('public/game.html');
        }
    }
};
