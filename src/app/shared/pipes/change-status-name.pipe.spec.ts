import { ChangeStatusNamePipe } from './change-status-name.pipe';

describe('ChangeStatusNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ChangeStatusNamePipe();
    expect(pipe).toBeTruthy();
  });
  it('смена названия статуса с approved на принято', () => {
    const pipe = new ChangeStatusNamePipe();
    expect(pipe.transform('approved')).toEqual('принято');
  });
});
