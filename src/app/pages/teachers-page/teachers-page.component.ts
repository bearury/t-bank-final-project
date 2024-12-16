import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  OnDestroy,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { TeacherService } from '@services/teacher-service/teacher-service.service';
import { TuiIcon, TuiLoader } from '@taiga-ui/core';
import { TuiDataListWrapper, TuiFilterByInputPipe } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { combineLatest, map, Observable, Subject, takeUntil } from 'rxjs';

import { UserCardComponent } from '../../shared/components/user-card/user-card.component';

@Component({
  selector: 'app-teachers-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TuiLoader,
    UserCardComponent,
    TuiInputModule,
    TuiDataListWrapper,
    AsyncPipe,
    TuiFilterByInputPipe,
    ReactiveFormsModule,
    TuiIcon,
  ],
  templateUrl: './teachers-page.component.html',
  styleUrl: './teachers-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeachersPageComponent implements OnDestroy {
  private readonly teacherServise = inject(TeacherService);
  private readonly courseService = inject(CoursesFirestoreService);
  private readonly destroy$ = new Subject<void>();
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public courses$ = this.courseService.getAll();
  public teachers$ = new Observable<UserEntity[]>();
  public loader = this.teacherServise.loading;
  public courses = signal<CourseEntity[]>([]);
  public searchShow = signal(false);
  public query = new FormControl('');
  public names = this.teacherServise.names;

  constructor() {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        map(() => this.activatedRoute.firstChild)
      )
      .subscribe((childRoute) => {
        if (childRoute) {
          this.searchShow.set(false);
          this.query.setValue('');
        } else {
          this.searchShow.set(true);
        }
      });

    this.teachers$ = this.teacherServise
      .searchTeachers(this.query.valueChanges)
      .pipe(takeUntil(this.destroy$));

    combineLatest([this.courses$, this.teachers$])
      .pipe(
        takeUntil(this.destroy$),
        map(([courses, teachers]) => {
          return teachers.map((teacher) =>
            courses.filter(() => teacher.courses)
          );
        })
      )
      .subscribe((filteredCourses) => {
        this.courses.set(filteredCourses.flat());
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
