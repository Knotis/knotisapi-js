define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');

    var Knotis = require(
        'intern/dojo/node!../../dist/index.js'
    );

    registerSuite({
        name: 'knotis',
        test_isknotisdefined: function () {
            assert.isDefined(Knotis);

        },
    });

});
