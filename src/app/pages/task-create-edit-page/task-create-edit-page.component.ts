import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { TASK_EDIT_PAGE_REGEX } from '@consts/task-create-edit.const';
import { TaskEntity } from '@interfaces/task.entity';
import { TasksFiestoreService } from '@services/fire-storage/tasks-firestore.service';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiAlertService, TuiButton, TuiDialogService, TuiError, TuiLink } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiButtonLoading, TuiConfirmData, TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiInputDateModule, TuiInputModule, TuiTextareaModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-task-create-edit-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTextareaModule,
    TuiError,
    TuiFieldErrorPipe,
    TuiButton,
    TuiButtonLoading,
    TuiInputDateModule,
    TuiTextfieldControllerModule,
    TuiLink,
    RouterLink
  ],
  templateUrl: './task-create-edit-page.component.html',
  styleUrl: './task-create-edit-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
        required: 'Заполните поле',
    }),
],
})
export class TaskCreateEditPageComponent implements OnDestroy {
  private readonly tasksFirestoreService = inject(TasksFiestoreService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly tuiAlertService = inject(TuiAlertService);
  private readonly destroy$ = new Subject<void>();
  private readonly dialogs = inject(TuiDialogService);

  private readonly params: Params = this.activatedRoute.snapshot.params as {id: string};
  protected readonly courseId = this.params['id'];
  protected id = '';

  protected readonly form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    deadline: new FormControl<TuiDay | null>(null, Validators.required)
  });

  protected readonly loading = signal(false);

  constructor() {
    if (this.router.url.match(TASK_EDIT_PAGE_REGEX)) {
      this.id = this.params['taskId'];

      this.tasksFirestoreService.getTask(this.id)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(task => {
          if (task) {
            this.form.patchValue({
              name: task['name'],
              description: task['description'],
              deadline: TuiDay.fromLocalNativeDate(new Date(task['deadline']))
            })
          }
        })
    };
  }

  private createTask(formValue: Omit<TaskEntity, 'uid'>): void {
    this.tasksFirestoreService.createTask(formValue)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.finish('Задание успешно создано', `/courses/${this.courseId}`);
      })
  }

  private updateTask(formValue: TaskEntity): void {
    this.tasksFirestoreService.updateTask(formValue)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.finish('Задание успешно обновлено', `/courses/${this.courseId}/task/${this.id}`);
      })
  }

  private finish(alertMessage: string, route: string): void {
    this.loading.set(false);

    this.form.reset();
    this.form.enable();

    this.tuiAlertService.open('', {
      label: alertMessage,
      appearance: 'info'
    })
    .subscribe()

    this.router.navigate([route]);
  }

  protected get taskTitle(): string {
    return `${this.id ? 'Редактирование' : 'Создание'} задания`;
  }

  protected submit(): void {
    if (this.form.valid) {
      this.form.disable();
      this.loading.set(true);

      const formValue = {
        name: this.form.value.name,
        description: this.form.value.description,
        deadline: this.form.value.deadline?.toLocalNativeDate().toISOString(),
        courseId: this.courseId
      } as Omit<TaskEntity, 'uid'>;
      
      if (!this.id) {
        this.createTask(formValue);
      } else {
        this.updateTask({...formValue, uid: this.id});
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  protected cancel(): void {
    this.form.reset();
    const route = `/courses/${this.courseId}/` + (this.id ? `task/${this.id}` : '');
    this.router.navigate([route]);
  }

  protected delete(): void {
    const data: TuiConfirmData = {
      content:
          'После удаления данные нельзя восстановить',
      yes: 'Удалить',
      no: 'Отменить',
  };

  this.dialogs
    .open<boolean>(TUI_CONFIRM, {
      label: 'Удалить задание?',
      size: 's',
      data,
    })
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((response) => {
      if (response) {
        this.tasksFirestoreService.deleteTask(this.id).subscribe(() => {
          this.finish('Задание удалено', `/courses/${this.courseId}`);
        })
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
