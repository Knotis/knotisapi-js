const KnotisApi = require('../../utils').connect();


describe('fn-refreshToken', () => {
  let token;
  
  test('it receives an access_token from a password Grant call', () => {
    expect.assertions(1);
    
    const username = 'jim',
          password = 'HimalimmaDingDong';

    return KnotisApi.passwordGrant(username, password).then(response => {
      token = response;
      expect(response).toEqual(expect.anything());
    }).catch(err => {
      console.error({
        status: err.status,
        statusText: err.statusText
      })
    });
  });

  test('it accepts a refresh_token which has been granted by call to password Grant()', () => {
    expect.assertions(1);

    return KnotisApi.refreshToken(token).then(response => {
      expect(response).toEqual(expect.anything());
    }).catch(err => {
      console.error({
        status: err.status,
        statusText: err.statusText
      });
    });
  });
})
