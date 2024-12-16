import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { map } from 'rxjs';

export const userTeacherGuard: CanActivateFn = () => {
  const currentUserService = inject(CurrentUserService);
  const router = inject(Router);

  return currentUserService.getCurrentUser().pipe(
    map((user) => {
      if (user && (user.role === 'teacher' || user.role === 'user')) {
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
};
