import { ChangeAppearancePipe } from './change-appearance.pipe';

describe('ChangeAppearancePipe', () => {
  it('create an instance', () => {
    const pipe = new ChangeAppearancePipe();
    expect(pipe).toBeTruthy();
  });
  it('change color', () => {
    const pipe = new ChangeAppearancePipe();
    expect(pipe.transform('pending')).toBe('warning');
  });
});
