import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/enviroment/enviroment';

@Injectable({
  providedIn: 'root',
})
export class UploadPhotoService {
  private readonly alert = inject(TuiAlertService);
  private readonly http = inject(HttpClient);
  private readonly url = `https://api.cloudinary.com/v1_1/${environment.cloudionaryConfig.cloudName}/image/upload`;

  public setPhoto(file: File): Observable<string | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      environment.cloudionaryConfig.uploadPreset
    );
    return this.http.post<{ secure_url: string }>(this.url, formData).pipe(
      map((response) => response.secure_url as string),
      catchError(() => {
        this.alert
          .open(
            'Basic <strong class="alert">ошибка при загрузке фото</strong>',
            { appearance: 'negative' }
          )
          .subscribe();
        return of(null);
      })
    );
  }
}
