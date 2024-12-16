import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NormalizedHomeworkEntity,
  StatusHomework,
} from '@interfaces/homework.entity';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { HomeworksService } from '@services/homeworks/homeworks.service';
import { TuiSegmented } from '@taiga-ui/kit';
import { Subject } from 'rxjs';

import { HomeworkTeacherComponent } from '../../shared/components/homework-teacher/homework-teacher.component';
import { HomeworkUserComponent } from '../../shared/components/homework-user/homework-user.component';

@Component({
  selector: 'app-homework-page',
  standalone: true,
  imports: [
    CommonModule,
    HomeworkTeacherComponent,
    AsyncPipe,
    HomeworkUserComponent,
    TuiSegmented,
  ],

  templateUrl: './homework-page.component.html',
  styleUrl: './homework-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeworkPageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly homeworkService = inject(HomeworksService);
  private readonly currentUser$ = inject(CurrentUserService).getCurrentUser();

  public readonly homeworks$ = new Subject<NormalizedHomeworkEntity[]>();

  public isTeacher = signal(false);
  constructor() {
    this.homeworkService
      .getNormalizedHomeworks()
      .pipe(takeUntilDestroyed())
      .subscribe((homework) => this.homeworks$.next(homework));
    this.currentUser$.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (!user) return;
      if (user.role === 'teacher') {
        this.isTeacher.set(true);
      } else {
        this.isTeacher.set(false);
      }
    });
  }

  public setFilteredHomeworks(status: StatusHomework): void {
    this.homeworkService
      .filterByStatus(status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((homeworks) => this.homeworks$.next(homeworks));
  }

  public getHomeworks(): void {
    this.homeworkService
      .getNormalizedHomeworks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((homeworks) => this.homeworks$.next(homeworks));
  }
}
