import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { map, of, switchMap } from 'rxjs';

export const adminTeacherRouteGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const currentUserService = inject(CurrentUserService);
  const coursesFirestoreService = inject(CoursesFirestoreService);
  const router = inject(Router);

  return coursesFirestoreService.getCourse(route.params['id'])
    .pipe(
      switchMap((course) => {
        if (course) {
          return currentUserService.getCurrentUser()
          .pipe(
            map((user) => {
              if (user && (user.role === 'admin' || (user.role === 'teacher' && course['teachers'].includes(user.uid)))) {
                return true;
              }
              router.navigate([`/courses/${course['uid']}`]);
              return false;
            })
          )
        }
        return of(false);
      })
    )
};