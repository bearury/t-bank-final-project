export interface UserEntity {
  readonly uid: string;
  readonly email: string;
  readonly avatar: string;
  readonly name: string;
  readonly surname: string;
  readonly phone: string;
  readonly role: UserRole;
  readonly courses: string[];
  readonly description?: string;
}

export type UserRole = 'user' | 'teacher' | 'admin';
