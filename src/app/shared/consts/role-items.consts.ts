import { RoleItems } from '../models/role-items.model';

export const roleItems: RoleItems[] = [
  new RoleItems('red', 'Администратор', 'admin'),
  new RoleItems('orange', 'Преподаватель', 'teacher'),
  new RoleItems('green', 'Студент', 'user')
];
