import { MoneifyPipe } from './moneify.pipe';

describe('MoneifyPipe', () => {
  it('create an instance', () => {
    const pipe = new MoneifyPipe();
    expect(pipe).toBeTruthy();
  });
});
