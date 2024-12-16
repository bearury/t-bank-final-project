import { inject, Injectable } from '@angular/core';
import { Auth, user, User } from '@angular/fire/auth';
import { ICurrentUser } from '@interfaces/current-user-service/current-user.interface';
import { UserEntity } from '@interfaces/user.entity';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService implements ICurrentUser {
  private readonly auth = inject(Auth);
  private readonly currentUser = user(this.auth);
  private readonly firestoreUserService = inject(UsersFirestoreService);
  public getCurrentUser(): Observable<UserEntity | null> {
    return this.currentUser.pipe(
      switchMap((user: User | null) => {
        if (user) {
          return this.firestoreUserService
            .getUser(user.uid)
            .pipe(map((user) => user as UserEntity));
        } else {
          return throwError(() => 'User not found');
        }
      }),
      catchError(() => {
        return of(null);
      })
    );
  }
}
