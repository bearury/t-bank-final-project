import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';
import { TransformCourseToNamePipe } from '@pipes/transform-course-to-name.pipe';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { TeacherService } from '@services/teacher-service/teacher-service.service';
import { TuiLoader } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge } from '@taiga-ui/kit';
import { map, Subject, switchMap, takeUntil } from 'rxjs';

import { ShowImagePipe } from '../../shared/pipes/show-image.pipe';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    CommonModule,
    TuiAvatar,
    ShowImagePipe,
    TuiBadge,
    TransformCourseToNamePipe,
    TuiLoader,
    RouterLink,
  ],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeacherComponent implements OnDestroy {
  private readonly teacherService = inject(TeacherService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();
  private readonly coursesService = inject(CoursesFirestoreService);
  public courses = signal<CourseEntity[]>([]);
  public loader = signal<boolean>(false);

  public teacher$ = new Subject<UserEntity>();

  constructor() {
    this.loader.set(true);
    this.activatedRoute.params
      .pipe(
        map((params) => params['id']),
        switchMap((id) => this.teacherService.getTeacherById(id)),
        takeUntil(this.destroy$)
      )
      .subscribe((teacher) => {
        this.teacher$.next(teacher);
        this.loader.set(false);
      });

    this.coursesService
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe((courses) => this.courses.set(courses));
  }

  public setColorBadge(course: string): string {
    const index = this.courses().findIndex(
      (c: CourseEntity) => c.uid === course
    );
    const color = [
      'accent',
      'primary',
      'info',
      'warning',
      'positive',
      'custom',
    ];
    return color[index % color.length];
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
