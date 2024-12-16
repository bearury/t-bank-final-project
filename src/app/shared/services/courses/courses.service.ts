import { inject, Injectable } from '@angular/core';
import { CourseEntity } from '@interfaces/course.entity';
import { ICourses } from '@interfaces/courses.interface';
import { UserEntity } from '@interfaces/user.entity';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private readonly isLoading = new BehaviorSubject(false);
  public readonly isLoading$ = this.isLoading.asObservable();
  private readonly coursesService = inject(CoursesFirestoreService);
  private readonly currentUserService = inject(CurrentUserService);

  public getAllCoursesAndCurrentUser(): Observable<ICourses> {
    const currentUser = this.currentUserService.getCurrentUser();
    const courses = this.coursesService.getAll();
    this.isLoading.next(true);

    return combineLatest([currentUser, courses]).pipe(
      map((data) => {
        const coursesData = data[1] as CourseEntity[];
        const user = data[0] as UserEntity | undefined;

        const courses = coursesData.filter(course => {
          if ((!user && course.status === 'assigned') || (user?.role === 'user' && course.status === 'assigned')) {
            return course;
          } else if (user?.role === 'admin' || user?.role === 'teacher') {
            return course;
          } else {
            return false;
          }
        });
        this.isLoading.next(false);
        return { courses, currentUser: user };
      })
    );
  }
}
