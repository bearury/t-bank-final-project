import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { COUSRE_EDIT_PAGE_REGEX } from '@consts/course-create-edit.const';
import { CreateCourse, EditCourse } from '@interfaces/create-edit-course/create-edit-course.interface';
import { UserEntity } from '@interfaces/user.entity';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { TUI_DEFAULT_MATCHER, TuiLet } from '@taiga-ui/cdk';
import { TuiAlertService, TuiButton, TuiDataList, TuiDialogService, TuiError, TuiInitialsPipe, TuiLabel, TuiLink } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiAvatar, TuiButtonClose, TuiButtonLoading, TuiCheckbox, TuiConfirmData, TuiDataListWrapper, TuiFieldErrorPipe, TuiFileLike, TuiFiles, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiInputModule, TuiMultiSelectModule, TuiTextareaModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { filter, finalize, map, Observable, of, startWith, Subject, switchMap, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'app-course-create-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextareaModule,
    TuiFiles,
    TuiAvatar,
    TuiDataList,
    TuiDataListWrapper,
    TuiInitialsPipe,
    TuiLet,
    TuiMultiSelectModule,
    TuiTextfieldControllerModule,
    TuiCheckbox,
    TuiError,
    TuiFieldErrorPipe,
    TuiLabel,
    TuiButton,
    TuiButtonLoading,
    TuiButtonClose,
    RouterLink, 
    TuiLink
  ],
  templateUrl: './course-create-edit-page.component.html',
  styleUrl: './course-create-edit-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
      required: 'Заполните поле'
    })
  ]
})
export class CourseCreateEditPageComponent implements OnDestroy {
  protected readonly form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>(''),
    poster: new FormControl<TuiFileLike | null>(null),
    teachers: new FormControl<readonly UserEntity[]>([]),
    stack: new FormControl<string>(''),
    status: new FormControl<boolean>(false)
  });
  protected file: TuiFileLike = {
    name: 'custom.txt'
  };
  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadedFiles$ = this.form.get('poster')?.valueChanges.pipe(
    switchMap((file) => this.processFile(file))
  );
  protected teachers: readonly UserEntity[] = [];
  protected id = '';
  protected items$: Observable<readonly UserEntity[] | null> | null = null;
  protected posterSrc = '';
  protected readonly search$ = new Subject<string | null>();
  protected readonly loading = signal(false);
  private readonly userFirestoreService = inject(UsersFirestoreService);
  private readonly coursesFirestoreService = inject(CoursesFirestoreService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly tuiAlertService = inject(TuiAlertService);
  private readonly destroy$ = new Subject<void>();
  private readonly dialogs = inject(TuiDialogService);
  private readonly teachers$: Observable<readonly UserEntity[]> = this.userFirestoreService.getAllUser()
    .pipe(
      map((users) => users.filter(user => user.role === 'teacher')),
      takeUntil(this.destroy$)
    );

  constructor() {
    this.teachers$.subscribe((teachers) => {
      this.teachers = teachers;

      this.items$ = this.search$.pipe(
        filter((value) => value !== null),
        switchMap((search) =>
          this.filterTeachers(search).pipe(startWith<readonly UserEntity[] | null>(null))
        ),
        startWith(this.teachers),
        takeUntil(this.destroy$)
      );
    });


    if (this.router.url.match(COUSRE_EDIT_PAGE_REGEX)) {
      this.id = (this.activatedRoute.snapshot.params as { id: string }).id;

      this.coursesFirestoreService.getCourse(this.id)
        .pipe(
          map((course) => {
            if (course) {
              course['teachers'] = course['teachers'].map((uid: string) => this.teachers.find(teacher => teacher.uid === uid)).filter((teacher: UserEntity | undefined) => !!teacher);
            }
            return course;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(course => {
          if (course) {
            this.posterSrc = course['poster'];

            this.form.patchValue({
              name: course['name'],
              description: course['description'],
              poster: null,
              teachers: course['teachers'],
              stack: course['stack'].join(', '),
              status: course['status'] === 'assigned'
            });
          }
        });
    }
  }

  protected get courseTitle(): string {
    return `${this.id ? 'Редактирование' : 'Создание'} курса`;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected removeFile(): void {
    this.form.get('poster')?.setValue(null);
    this.posterSrc = '';
  }

  protected processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null);
    if (this.form.get('poster')?.invalid || !file) {
      return of(null);
    }

    this.loadingFiles$.next(file);

    const url = URL.createObjectURL(file as File);
    this.posterSrc = url;

    return timer(500).pipe(
      map(() => {
        if (file) {
          return file;
        }
        this.failedFiles$.next(file);
        return null;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  protected onSearchChange(searchQuery: string | null): void {
    this.search$.next(searchQuery);
  }

  protected getTeacherName(user: UserEntity): string {
    return `${user.name} ${user.surname}`;
  }

  protected submit(): void {
    if (this.form.valid) {
      this.form.disable();
      this.loading.set(true);

      const formValue = this.form.value as CreateCourse;

      if (!formValue.poster && this.posterSrc) {
        formValue.poster = this.posterSrc;
      }

      if (!this.id) {
        this.createCourse(formValue);
      } else {
        this.updateCourse({ ...formValue, uid: this.id });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  protected cancel(): void {
    this.form.reset();
    const route = '/courses' + (this.id ? `/${this.id}` : '');
    this.router.navigate([route]);
  }

  protected delete(): void {
    const data: TuiConfirmData = {
      content:
        'После удаления данные нельзя восстановить',
      yes: 'Удалить',
      no: 'Отменить'
    };

    this.dialogs
      .open<boolean>(TUI_CONFIRM, {
        label: 'Удалить курс?',
        size: 's',
        data
      })
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        if (response) {
          this.coursesFirestoreService.deleteCourse(this.id).subscribe();
          this.finishCourseUpdate('Курс удален', '/courses');
        }
      });
  }

  private filterTeachers(searchQuery: string | null): Observable<readonly UserEntity[]> {
    const result = this.teachers.filter((teacher) =>
      TUI_DEFAULT_MATCHER(this.getTeacherName(teacher), searchQuery || '')
    );

    return of(result);
  }

  private createCourse(formValue: CreateCourse): void {
    this.coursesFirestoreService.createCourse(formValue)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.finishCourseUpdate('Курс успешно создан', '/courses');
      });
  }

  private updateCourse(formValue: EditCourse): void {
    this.coursesFirestoreService.updateCourse(formValue)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.finishCourseUpdate('Курс успешно обновлен', `/courses/${this.id}`);
      });
  }

  private finishCourseUpdate(alertMessage: string, route: string): void {
    this.loading.set(false);

    this.form.reset();
    this.form.enable();

    this.tuiAlertService.open('', {
      label: alertMessage,
      appearance: 'info'
    })
      .subscribe();

    this.router.navigate([route]);
  }
}
