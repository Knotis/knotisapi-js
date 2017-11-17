const KnotisApi = require('../../utils').connect();


test('it creates a new user', () => {
  expect.assertions(1);

  return KnotisApi.NewUser.create({
    username: 'Jim',
    password: 'HimalimmaDingDong'
  }).then(response => {
    expect(response.data.username).toBe('jim');
  });
})
