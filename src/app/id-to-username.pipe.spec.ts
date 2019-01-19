import { IdToUsernamePipe } from './id-to-username.pipe';

describe('IdToUsernamePipe', () => {
  it('create an instance', () => {
    const pipe = new IdToUsernamePipe();
    expect(pipe).toBeTruthy();
  });
});
