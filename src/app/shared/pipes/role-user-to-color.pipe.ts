import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '@interfaces/user.entity';

@Pipe({
  name: 'roleUserToColor',
  standalone: true,
})
export class RoleUserToColorPipe implements PipeTransform {
  private readonly typesRole = {
    user: 'green',
    teacher: 'orange',
    admin: 'red',
  };

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(role: UserRole): string {
    return this.typesRole[role];
  }
}
