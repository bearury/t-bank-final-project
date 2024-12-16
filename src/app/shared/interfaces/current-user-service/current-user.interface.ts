import { UserEntity } from '@interfaces/user.entity';
import { Observable } from 'rxjs';

export interface ICurrentUser {
  getCurrentUser(): Observable<UserEntity | null>;
}
