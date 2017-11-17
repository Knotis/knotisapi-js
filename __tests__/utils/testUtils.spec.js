const { connectWithNewUser } = require('./index.js');


describe('fn-connectWithNewUser', () => {
  test('it generates a new user and connects that user to the api', () => {
    expect.assertions(1);

    return connectWithNewUser().then(({ KnotisApi, sessionInfo }) => {
      expect(sessionInfo).toEqual(expect.objectContaining({
        access_token: expect.any(String)
      }));
    }).catch(res => {
      expect(true).toBe(false);
    });
  })
})
