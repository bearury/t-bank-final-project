import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskUnitComponent } from '@components/task-unit/task-unit.component';
import { ICourse } from '@interfaces/course.interface';
import { LessonEntity } from '@interfaces/lesson.entity';
import { TaskEntity } from '@interfaces/task.entity';
import { CoursesService } from '@services/courses-service/courses-service';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { TuiAppearance, TuiButton, TuiLink, TuiLoader, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiStatus, TuiTileHandle } from '@taiga-ui/kit';

@Component({
  selector: 'app-course-page',
  standalone: true,
  imports: [CommonModule, TuiLoader, TuiBadge, TuiStatus, TuiTitle, NgOptimizedImage, TaskUnitComponent, TuiTileHandle, TuiButton, RouterLink, TuiAppearance, TuiLink],
  templateUrl: './course-page.component.html',
  styleUrl: './course-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoursePageComponent {
  public readonly notFoundImg = 'not-found-img.webp';
  public readonly course = signal<ICourse | null>(null);
  public readonly isCourseToTeacher = signal<boolean>(false);

  public readonly courseStatusValue = computed<string>(() => {
    return this.course()?.status === 'assigned' ? 'Активный' : 'Не назначен';
  });
  public readonly isAssignedStatus = computed<boolean>(() => {
    return this.course()?.status === 'assigned';
  });
  public readonly tasks = signal<TaskEntity[]>([]);
  public readonly lessons = signal<LessonEntity[]>([]);
  public readonly isLoadingData = signal<boolean>(true);
  public readonly isJoined = signal<boolean>(false);
  public readonly isAdmin = signal<boolean>(false);
  public readonly isTeacher = signal<boolean>(false);
  public readonly isCourseToTeacherAndIsAdminOrTeacher = computed(() => {
    return (this.isCourseToTeacher() && this.isTeacher()) || this.isAdmin();
  });
  public readonly isUser = signal<boolean>(false);

  private readonly coursesService = inject(CoursesService);
  private readonly usersFirestoreService = inject(UsersFirestoreService);
  private readonly currentUserService = inject(CurrentUserService);
  public readonly currentUser = toSignal(this.currentUserService.getCurrentUser());

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
    const id: string | null = this.activateRoute.snapshot.paramMap.get('id');

    if (id) {
      this.currentUserService.getCurrentUser().subscribe((user) => {
        const role = user?.role ?? '';
        this.isJoined.set(user?.courses.includes(id) ?? false);
        this.isAdmin.set(role === 'admin');
        this.isTeacher.set(role === 'teacher');
        this.isUser.set(role === 'user');
      });

      this.coursesService.getCourseTasksLessons(id).subscribe(data => {
        if (data) {
          this.tasks.set(data.tasks);
          this.course.set(data.course);
          this.lessons.set(data.lessons);
          this.isLoadingData.set(false);
          this.isCourseToTeacher.set(data.isCourseToTeacher);
        } else {
          this.router.navigate(['/not-found']);
        }
      });
    }
  }

  public handleJoin(courseUid: string): void {
    const currentUser = this.currentUser();
    if (!currentUser) return;

    if (this.isJoined()) {
      this.usersFirestoreService.removeCourse({ userUid: currentUser.uid, courseUid });
    } else {
      this.usersFirestoreService.addCourse({ userUid: currentUser.uid, courseUid });
    }
  }

  public handleClickTask(uid: string): void {
    this.router.navigate(['/courses/' + this.course()?.uid + '/task/' + uid]);
  }

  public handleClickLesson(uid: string): void {
    this.router.navigate(['/courses/' + this.course()?.uid + '/lesson/' + uid]);
  }
}
