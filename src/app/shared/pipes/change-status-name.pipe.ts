import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeStatusName',
  standalone: true,
})
export class ChangeStatusNamePipe implements PipeTransform {
  public transform(status: string): string {
    switch (status) {
      case 'approved':
        return 'принято';
      case 'rejected':
        return 'доработать';
      case 'pending':
        return 'на проверке';

      default:
        return 'neutral';
    }
  }
}
