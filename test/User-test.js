import chai from 'chai';
const expect = chai.expect;

const User = require('../src/User')


describe('User', () => {
  let user;

  beforeEach(() => {
    user = new User()
  });

  it('should be an instance of a player', () => {
    expect(user).to.be.an.instanceOf(User)
  });


});
