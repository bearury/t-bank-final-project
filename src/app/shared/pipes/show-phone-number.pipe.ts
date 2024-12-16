import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showPhone',
  standalone: true,
})
export class ShowNumberPipe implements PipeTransform {
  public transform(value: string): string {
    if (!value) return 'вы не добавили телефон';

    const digits = value.replace(/\D/g, '');

    if (digits.length === 11) {
      return `+ ${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(
        4,
        7
      )}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
    } else {
      return 'вы не добавили телефон';
    }
  }
}
