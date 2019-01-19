import { TimeToStringPipe } from './time-to-string.pipe';

describe('TimeToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new TimeToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
