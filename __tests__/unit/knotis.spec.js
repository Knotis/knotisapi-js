import Knotis from '../../src/index';

describe('test api library', () => {
    let client = new Knotis();

    test('is Knotis defined', () => {
	expect(Knotis).toBeDefined();

    });

    test('is password grant defined', () => {
	expect(client.passwordGrant).toBeDefined();

    });

    test('is refresh token defined', () => {
	expect(client.refreshToken).toBeDefined();

    });

    test('is promise returned from password grant', () => {
	let promise = client.passwordGrant();
	expect(promise.then).toBeDefined();

    });

    test('is promise returned from refresh token', () => {
	let promise = client.refreshToken();
	expect(promise.then).toBeDefined();

    });
    
});
