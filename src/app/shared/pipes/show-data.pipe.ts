import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showData',
  standalone: true,
})
export class ShowDataPipe implements PipeTransform {
  public transform(value: string): string {
    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };
    return date.toLocaleString('ru-RU', options);
  }
}
