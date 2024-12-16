import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '@interfaces/user.entity';

@Pipe({
  name: 'roleUserToName',
  standalone: true,
})
export class RoleUserToNamePipe implements PipeTransform {
  private readonly typesRole = {
    user: 'Студент',
    teacher: 'Преподаватель',
    admin: 'Администратор',
  };

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(role: UserRole): string {
    return this.typesRole[role];
  }
}
