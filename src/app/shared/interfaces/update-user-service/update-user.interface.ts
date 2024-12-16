import { Observable } from 'rxjs';

export interface IUpdateUser {
  updateUser(
    name: string,
    surname: string,
    phone: string,
    photo: File,
    description: string
  ): Observable<void | null>;
}
