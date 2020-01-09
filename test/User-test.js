import chai from 'chai';
const expect = chai.expect;

const User = require('../src/User')


describe('User', () => {
  let user;

  beforeEach(() => {
    user = new User('Marlowe', 28)
  });

  it('should be an instance of a player', () => {
    expect(user).to.be.an.instanceOf(User)
  });

  it('should have a name', () => {
    expect(user.name).to.equal('Marlowe')
  });

  it('should have an id number', () => {
    expect(user.id).to.equal(28)
  });

  it('should start off with $0 spent', () => {
    expect(user.amountSpent).to.equal(0)
  });

  it('should start off with no reservations', () => {
    expect(user.reservations.length).to.equal(0)
  });






});
