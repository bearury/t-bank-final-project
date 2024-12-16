import { inject, Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { IUpdateUser } from '@interfaces/update-user-service/update-user.interface';
import { UploadPhotoService } from '@services/upload-photo/upload-photo.service';
import { TuiAlertService } from '@taiga-ui/core';
import { catchError, from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserService implements IUpdateUser {
  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly user = user(this.auth);
  private readonly alert = inject(TuiAlertService);
  private readonly uploadPhotoService = inject(UploadPhotoService);

  public updateUser(
    name: string,
    surname: string,
    phone: string,
    photo: File | null,
    description: string
  ): Observable<void | null> {
    return this.user.pipe(
      switchMap((currentUser) => {
        if (!currentUser) throw new Error('пользователь не авторизован');
        const userId = currentUser.uid;
        const userDocRef = doc(this.firestore, `users/${userId}`);

        if (photo === null) {
          const updateData = {
            name,
            surname,
            phone,
            description,
          };
          return from(updateDoc(userDocRef, updateData));
        } else {
          return this.uploadPhotoService.setPhoto(photo).pipe(
            switchMap((avatar) => {
              const updateData = {
                name,
                surname,
                phone,
                avatar,
                description,
              };
              return from(updateDoc(userDocRef, updateData));
            })
          );
        }
      }),
      catchError(() => {
        this.alert
          .open('<strong class="alert">ошибка при обновлении данных</strong>', {
            appearance: 'negative',
          })
          .subscribe();
        return of(null);
      })
    );
  }
}
