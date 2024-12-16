import { inject, Injectable } from '@angular/core';
import { ICourse } from '@interfaces/course.interface';
import { CourseData } from '@interfaces/course-data.interface';
import { UserEntity } from '@interfaces/user.entity';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { LessonsFirestoreService } from '@services/fire-storage/lessons-firestore.service';
import { TasksFiestoreService } from '@services/fire-storage/tasks-firestore.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private readonly coursesFirestoreService = inject(CoursesFirestoreService);
  private readonly usersFirestoreService = inject(UsersFirestoreService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly tasksFirestoreService = inject(TasksFiestoreService);
  private readonly lessonsFirestoreService = inject(LessonsFirestoreService);


  public foundForCourseId(courseUid: string): Observable<ICourse | null> {
    return this.coursesFirestoreService.getOne(courseUid).pipe(
      switchMap((course) => {
        if (course && course.teachers.length) {
          const teacherObservables = course.teachers.map((teacherId) => this.usersFirestoreService.getUser(teacherId) as Observable<UserEntity>
          );
          return combineLatest(teacherObservables).pipe(
            map((teachers) => {
              return { ...course, teacherUsers: teachers };
            })
          );
        } else if (course) {
          return of({ ...course, teacherUsers: [] });
        } else {
          return of(null);
        }
      })
    );
  };

  public getCourseTasksLessons(id: string): Observable<CourseData | null> {
    const course = this.foundForCourseId(id);
    const tasks = this.tasksFirestoreService.foundForCourseId(id);
    const lessons = this.lessonsFirestoreService.foundForCourseId(id);
    const currentUser = this.currentUserService.getCurrentUser();
    return combineLatest([course, lessons, tasks, currentUser]).pipe(
      map((data) => {
        if (data[0]) {
          const course = data[0] as ICourse;
          const currentUser = data[3] as UserEntity | null;
          const isCourseToTeacher = course.teachers.includes(currentUser?.uid || '');
          return { course: data[0], lessons: data[1], tasks: data[2], isCourseToTeacher };
        } else {
          return null;
        }
      })
    );
  }
}
