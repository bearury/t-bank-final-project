import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showImage',
  standalone: true,
})
export class ShowImagePipe implements PipeTransform {
  public transform(value: string): string {
    return value ? value : '@tui.user';
  }
}
