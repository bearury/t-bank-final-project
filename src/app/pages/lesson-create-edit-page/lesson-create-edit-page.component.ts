import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { LESSON_EDIT_PAGE_REGEX } from '@consts/lesson-create-edit.const';
import { LessonEntity } from '@interfaces/lesson.entity';
import { LessonsFirestoreService } from '@services/fire-storage/lessons-firestore.service';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiAlertService, TuiButton, TuiDialogService, TuiError, TuiLabel, TuiLink } from '@taiga-ui/core';
import { TUI_CONFIRM, TuiButtonLoading, TuiConfirmData, TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiInputDateModule, TuiInputModule, TuiTextareaModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-lesson-create-edit-page',
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
    TuiLabel,
    TuiInputDateModule,
    TuiTextfieldControllerModule,
    TuiLink,
    RouterLink
  ],
  templateUrl: './lesson-create-edit-page.component.html',
  styleUrl: './lesson-create-edit-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiValidationErrorsProvider({
        required: 'Заполните поле'
    })
  ],
})
export class LessonCreateEditPageComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly tuiAlertService = inject(TuiAlertService);
  private readonly destroy$ = new Subject<void>();
  private readonly lessonsFirestoreService = inject(LessonsFirestoreService);
  private readonly dialogs = inject(TuiDialogService);

  private readonly params: Params = this.activatedRoute.snapshot.params as {id: string};
  protected readonly courseId = this.params['id'];
  protected id = '';

  protected readonly form = new FormGroup({
    name: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null, Validators.required),
    videoLink: new FormControl<string>(''),
    deadline: new FormControl<TuiDay | null>(null, Validators.required),
    additionalMaterial: new FormArray([])
  });

  protected readonly loading = signal(false);

  constructor() {
    if (this.router.url.match(LESSON_EDIT_PAGE_REGEX)) {
      this.id = this.params['lessonId'];

      this.lessonsFirestoreService.getLesson(this.id)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(lesson => {
          if (lesson) {
            this.additionalMaterial.controls = [];

            this.form.patchValue({
              name: lesson['name'],
              description: lesson['description'],
              videoLink: lesson['videoLink'],
              deadline: TuiDay.fromLocalNativeDate(new Date(lesson['deadline']))
            });

            this.appendAdditionalMaterialInputs(lesson['additionalMaterial']); 
          } else {
            this.router.navigate(['/404']);
          }
        })
    }
  }

  private appendAdditionalMaterialInputs(additionalMaterials: string[]): void {
    for (let i = 0; i < additionalMaterials.length; i++) {
      this.addInput(additionalMaterials[i]);
    }
  }

  private createLesson(formValue: Omit<LessonEntity, 'uid'>): void {
    this.lessonsFirestoreService.createLesson(formValue)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.finish('Урок успешно создан', `/courses/${this.courseId}`);
      })
  }

  private updateLesson(formValue: LessonEntity): void {
    this.lessonsFirestoreService.updateLesson(formValue)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.finish('Урок успешно обновлен', `/courses/${this.courseId}/lesson/${this.id}`);
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

  protected get lessonTitle(): string {
    return `${this.id ? 'Редактирование' : 'Создание'} лекции`;
  }


  protected addInput(value: string |  null = null): void {
    const additionalControl = new FormControl<string | null>(value);
    this.additionalMaterial.push(additionalControl);
  }

  protected deleteInput(index: number): void {
    this.additionalMaterial.removeAt(index);
  }

  protected cancel(): void {
    this.form.reset();
    const route = `/courses/${this.courseId}/` + (this.id ? `lesson/${this.id}` : '');
    this.router.navigate([route]);
  }

  protected submit(): void {
    if (this.form.valid) {
      this.form.disable();
      this.loading.set(true);

      const formValue = {
        name: this.form.value.name,
        description: this.form.value.description,
        videoLink: this.form.value.videoLink,
        deadline: this.form.value.deadline?.toLocalNativeDate().toISOString(),
        additionalMaterial: this.form.value.additionalMaterial?.filter(material => material),
        courseId: this.courseId,
      } as Omit<LessonEntity, 'uid'>;

      if (!this.id) {
        this.createLesson(formValue);
      } else {
        this.updateLesson({...formValue, uid: this.id});
      }
    } else {
      this.form.markAllAsTouched();
    }
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
      label: 'Удалить лекцию?',
      size: 's',
      data,
    })
    .pipe(
      takeUntil(this.destroy$)
    )
    .subscribe((response) => {
      if (response) {
        this.lessonsFirestoreService.deleteLesson(this.id).subscribe(() => {
          this.finish('Урок удален', `/courses/${this.courseId}`);
        })
      }
    });
  }

  public get additionalMaterial(): FormArray {
    return this.form.get('additionalMaterial') as FormArray;
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
