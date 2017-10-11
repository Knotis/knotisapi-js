define(function (require) {
    var registerSuite = require('intern!object');
    var assert = require('intern/chai!assert');

    var Knotis = require(
        'intern/dojo/node!../../dist/index.js'
    );

    registerSuite({
        name: 'knotis',
        test_isKnotisDefined: function () {
            assert.isDefined(Knotis);

        },
	test_isPasswordGrantDefined: function () {
	    var client = new Knotis();
	    assert.isDefined(client.passwordGrant)

	},
	test_isRefreshTokenDefined: function () {
	    var client = new Knotis();
	    assert.isDefined(client.passwordGrant)

	},
	test_isPromiseReturnedFromPasswordGrant: function () {
	    var client = new Knotis();
	    var promise = client.passwordGrant();

	    assert.isDefined(promise.then);
	    
	},
	test_isPromiseReturnedFromRefreshToken: function () {
	    var client = new Knotis();
	    var promise = client.refreshToken();

	    assert.isDefined(promise.then);
	    
	}
	
    });

});
