import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { TuiAlertService } from '@taiga-ui/core';
import { map, of, switchMap } from 'rxjs';

export const courseContentRouteGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const currentUserService = inject(CurrentUserService);
  const coursesFirestoreService = inject(CoursesFirestoreService);
  const router = inject(Router);
  const alerts = inject(TuiAlertService);

  return coursesFirestoreService.getCourse(route.params['id']).pipe(
    switchMap((course) => {
      if (course) {
        return currentUserService.getCurrentUser()
          .pipe(
            map((user) => {
              if (user && (user.role === 'admin' || user['courses'].includes(route.params['id']) || course['teachers'].includes(user.uid))) {
                return true;
              }

              alerts.open('чтобы увидеть содержимое курса',{
                label: 'Запишитесь на курс ',
                'appearance': 'warning'
              }).subscribe();

              return false;
            })
          )
      }
      router.navigate(['/not-found']);
      return of(false);   
    })
  )
};