import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskEntity } from '@interfaces/task.entity';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { TasksFiestoreService } from '@services/fire-storage/tasks-firestore.service';
import { HomeworksService } from '@services/homeworks/homeworks.service';
import {
  TuiAlertService,
  TuiAppearance,
  TuiButton,
  TuiError,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiFieldErrorPipe } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';
import { map, Subject, switchMap, tap } from 'rxjs';
import { urlValidator } from 'src/app/shared/validators/url-validator';

@Component({
  selector: 'app-update-homework-page',
  standalone: true,
  imports: [
    CommonModule,
    TuiAppearance,
    TuiInputModule,
    TuiTextfield,
    AsyncPipe,
    TuiButton,
    ReactiveFormsModule,
    TuiError,
    TuiFieldErrorPipe,
  ],
  templateUrl: './update-homework-page.component.html',
  styleUrl: './update-homework-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateHomeworkPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly taskService = inject(TasksFiestoreService);
  private readonly homeworksServise = inject(HomeworksService);
  private readonly alert = inject(TuiAlertService);
  public readonly currentUser$ = inject(CurrentUserService).getCurrentUser();

  public readonly task$: Subject<TaskEntity> = new Subject();
  public homeworkId!: string;

  public form = new FormGroup({
    answerLink: new FormControl('', [Validators.required, urlValidator()]),
    comment: new FormControl('', [Validators.required]),
  });

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        map((params) => {
          const paramsObj = { id: params['id'], id1: params['id1'] };
          return paramsObj;
        }),
        tap((params) => (this.homeworkId = params.id1)),
        switchMap((params) => this.taskService.getTaskById(params.id)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((teacher) => {
        if (!teacher) {
          return;
        }
        this.task$.next(teacher);
      });
  }

  public submit(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
    }
    const { answerLink, comment } = this.form.value;
    const dateSubmitted = new Date().toISOString();
    if (answerLink && comment)
      this.homeworksServise
        .updateHomeworkFields(this.homeworkId, {
          answerLink: answerLink,
          comment: comment,
          dateSubmitted: dateSubmitted,
          status: 'pending',
        })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.alert.open('Успешно отправлено').subscribe();
          this.router.navigate(['/profile/homework']);
        });
  }
}
