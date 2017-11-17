const KnotisApi = require('../../utils').connect();


describe('fn-OneUseToken', () => {

    test('it returns a success indicator when invoked with a valid email address', () => {
	expect.assertions(1);

	return KnotisApi.OneUseToken.create({
	    email: 'someone@example.com'
	}).then(response => {
	    expect(response.data.status).toBe('sent');
	});
    });

    test('it returns a failure indicator when invoked with an invalid email address', () => {
	expect.assertions(1);

	return KnotisApi.OneUseToken.create({
	    email: 'notavalidemail'
	}).then(response => {
	    expect(response.data.status).not.toBe('sent');

	})
    });

});
