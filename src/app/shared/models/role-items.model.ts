import { UserRole } from '@interfaces/user.entity';

export class RoleItems {
  constructor(
    public readonly color: 'green' | 'orange' | 'red',
    public readonly title: 'Администратор' | 'Преподаватель' | 'Студент',
    public readonly name: UserRole
  ) {}
}
