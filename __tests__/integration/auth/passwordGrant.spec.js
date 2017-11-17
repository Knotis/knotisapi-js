const KnotisApi = require('../../utils').connect();
const getUUID = require('uuid/v4');

const username = getUUID(),
      password = getUUID();


describe('fn-passwordGrant', () => {
  
  test('it returns access credentials when passed existing U/P', () => {
    expect.assertions(1);

    return KnotisApi.NewUser.create({
      username,
      password
    }).then((res) => {
      // check is necessary as endpoint returns status_code: OR status:
      if (res.status_code && res.status_code === 200) {
        return KnotisApi.passwordGrant(username, password).then(response => {
          expect(response).toEqual(expect.anything())
        })
      } else {
        // fail the test if response is anything but 200
        expect(true).toBe(false);
      }
    });
  });


  test('it returns 401 UNAUTHORIZED when passed non-existing U/P', () => {
    expect.assertions(1);

    const username = 'assimilate',
          password = 'orbeannihilated';

    return KnotisApi.passwordGrant(username, password).then(response => {
      expect(response.status).toBe(401);
    })
  });
});
