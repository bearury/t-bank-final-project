import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { HomeworkEntity } from '@interfaces/homework.entity';
import { HomeworkStatusBadge } from '@interfaces/homework-status-badge/homework-status-badge.interface';
import { UserEntity } from '@interfaces/user.entity';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { HomeworksFirestoreServiceTsService } from '@services/fire-storage/homeworks-firestore.service';
import { TasksFiestoreService } from '@services/fire-storage/tasks-firestore.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { HomeworkStatusService } from '@services/homework-status/homework-status.service';
import { TuiContext, TuiLet, TuiStringHandler, tuiPure } from '@taiga-ui/cdk';
import { TuiAlertService, TuiButton, TuiDataList, TuiError, TuiInitialsPipe, TuiLabel, TuiLink, TuiLoader } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge, TuiButtonLoading, TuiDataListWrapper, TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiInputModule, TuiSelectModule, TuiTextareaModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { Observable, Subject, map, of, switchMap, takeUntil } from 'rxjs';


@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [
    CommonModule,
    TuiInputModule,
    TuiLabel,
    FormsModule,
    ReactiveFormsModule,
    TuiTextareaModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    TuiDataList,
    TuiDataListWrapper,
    TuiLoader,
    TuiLet,
    TuiAvatar,
    TuiInitialsPipe,
    TuiBadge,
    TuiButton,
    TuiButtonLoading,
    TuiError,
    TuiFieldErrorPipe,
    RouterLink,
    TuiLink
  ],
  templateUrl: './task-page.component.html',
  styleUrl: './task-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
      required: 'Заполните поле',
    }),
],
})
export class TaskPageComponent implements OnDestroy {
  private readonly tasksFirestoreService = inject(TasksFiestoreService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly usersFirestoreService = inject(UsersFirestoreService);
  private readonly homeworksFirestoreService = inject(HomeworksFirestoreServiceTsService);
  private readonly homeworkStatusService = inject(HomeworkStatusService);
  private readonly tuiAlertService = inject(TuiAlertService);
  private readonly destroy$ = new Subject<void>();
  private readonly coursesFirestoreService = inject(CoursesFirestoreService);

  private userId: string | null = null;

  private readonly params: Params = this.activatedRoute.snapshot.params as {id: string, taskId: string}
  protected readonly id = this.params['taskId'];
  protected readonly courseId = this.params['id'];

  protected homeworkId: string | null = null;
  protected teacherReview: string | null = null;
  protected value = '';

  protected teachers$: Observable<UserEntity[]> = this.usersFirestoreService.getUsersByRole('teacher')
  .pipe(
    switchMap((teachers) => {
      return this.coursesFirestoreService.getCourse(this.courseId)
      .pipe(
        map((course) => {
          if (course) {
            return teachers.filter(teacher => course['teachers'].includes(teacher['uid']))
          }
          return [];
        })
      );
    })
  )

  protected isTeacher$: Observable<boolean> = of(false);

  protected task$ = this.tasksFirestoreService.getTask(this.id);

  protected readonly homeworkForm = new FormGroup({
    teacherId: new FormControl<string | null>(null, Validators.required),
    answerLink: new FormControl<string| null>(null, Validators.required),
    comment: new FormControl<string>(''),
    review: new FormControl<string>({
      value: '',
      disabled: true
    })
  });

  protected readonly loading = signal(false);

  protected currentStatus: HomeworkStatusBadge = this.homeworkStatusService.getStatus('initial');

  protected isAdmin = false;

  constructor() {
    this.currentUserService.getCurrentUser().pipe(
      switchMap((user) => {
        if (user) {
          this.userId = user.uid;
          this.isAdmin = user.role === 'admin';
          this.isTeacher$ = this.teachers$.pipe(
            map(teachers => !!teachers.find(teacher => teacher.uid === user.uid))
          );

          return this.homeworksFirestoreService.getHomeworkByUserAndTask(user.uid, this.id);
        }
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe((homework) => {
      if (homework) {
        this.homeworkId = homework.uid;

        this.homeworkForm.patchValue({
          teacherId: homework.teacherId,
          answerLink: homework.answerLink,
          comment: homework.comment,
          review: homework.review
        });
        this.teacherReview = homework.review;
        this.value = homework.teacherId;

        this.currentStatus = this.homeworkStatusService.getStatus(homework.status);
        if (homework.status !== 'rejected') {
          this.homeworkForm.disable();
        }
      }
    })
  }

  private createHomework(formValue: Omit<HomeworkEntity, 'uid'>): void {
    this.homeworksFirestoreService.createHomework(formValue)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(() => {
      this.finishHomeworkUpdate();
    });
  }

  private updateHomework(formValue: HomeworkEntity): void {
    this.homeworksFirestoreService.updateHomework(formValue)
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe(() => {
      this.finishHomeworkUpdate();
    });
  }

  private finishHomeworkUpdate(): void {
    this.loading.set(false);

    this.tuiAlertService.open('Домашнее задание успешно отправлено на проверку', {
      label: 'ДЗ отправлено',
      appearance: 'info'
    })
    .subscribe()

    this.currentStatus = this.homeworkStatusService.getStatus('pending');
  }

  protected getTeacherName(user: UserEntity): string {
    return `${user.name} ${user.surname}`;
  }

  @tuiPure
  protected stringify(items: readonly UserEntity[]): TuiStringHandler<TuiContext<string>> {
    const map = new Map(items.map(({uid, name, surname}) => [uid, `${name} ${surname}`] as [string, string]));

    return ({$implicit}: TuiContext<string>) => map.get($implicit) || '';
  }

  protected submit(): void {
    if (this.homeworkForm.valid) {
      this.homeworkForm.disable();
      this.loading.set(true);

      const formValue = {...this.homeworkForm.value, 
        taskId: this.id,
        userId: this.userId,
        dateSubmitted: new Date().toISOString(),
        review: '',
        status: 'pending'
      } as Omit<HomeworkEntity, 'uid'>;

      if (!this.homeworkId) {
        this.createHomework(formValue);
      } else {
        this.updateHomework({...formValue, uid: this.homeworkId});
      }
      
    } else {
      this.homeworkForm.markAllAsTouched();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
