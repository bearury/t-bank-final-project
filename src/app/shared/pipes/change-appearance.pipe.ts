import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeAppearance',
  standalone: true,
})
export class ChangeAppearancePipe implements PipeTransform {
  public transform(status: string): string {
    switch (status) {
      case 'approved':
        return 'positive';
      case 'rejected':
        return 'negative';
      case 'pending':
        return 'warning';

      default:
        return 'neutral';
    }
  }
}
