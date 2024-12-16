import { AsyncPipe, CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { UpdateUserService } from '@services/update-user/update-user.service';
import { TuiAlertService, TuiButton, TuiLoader } from '@taiga-ui/core';
import { TuiAvatar, TuiFileLike, TuiFiles } from '@taiga-ui/kit';
import {
  TuiInputModule,
  TuiInputPhoneModule,
  TuiTextareaModule,
} from '@taiga-ui/legacy';
import {
  finalize,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

import { ShowImagePipe } from '../../pipes/show-image.pipe';

@Component({
  selector: 'app-edit-user-form',
  standalone: true,
  imports: [
    CommonModule,
    TuiAvatar,
    TuiInputModule,
    AsyncPipe,
    ReactiveFormsModule,
    TuiFiles,
    TuiButton,
    TuiLoader,
    TuiInputPhoneModule,
    ShowImagePipe,
    TuiTextareaModule,
  ],
  templateUrl: './edit-user-form.component.html',
  styleUrl: './edit-user-form.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserFormComponent implements OnInit, OnDestroy {
  @Output() public closeDialogEvent: EventEmitter<void> =
    new EventEmitter<void>();

  public avatar: WritableSignal<string> = signal('');
  public name = 'fdffd';
  public surname: WritableSignal<string | null> = signal('');
  public phone: WritableSignal<string | null> = signal('');

  public disabled: WritableSignal<boolean> = signal(false);
  private readonly alert = inject(TuiAlertService);

  private readonly currentUserService = inject(CurrentUserService);
  private readonly updateUserService = inject(UpdateUserService);

  protected readonly form = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    surname: new FormControl<string>('', Validators.required),
    phone: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(12)],
    }),
    file: new FormControl<TuiFileLike | null>(null),
    description: new FormControl<string>('', [Validators.required]),
  });

  private readonly destroy$ = new Subject<void>();
  protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();
  protected readonly loadedFiles$ = this.form.get('file')?.valueChanges.pipe(
    takeUntil(this.destroy$),
    switchMap((file) => this.processFile(file))
  );

  public ngOnInit(): void {
    this.currentUserService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.avatar.set(user?.avatar || '');
        this.form.patchValue({
          name: user?.name || '',
          surname: user?.surname || '',
          phone: user?.phone || '',
          description: user?.description || 'Пока не придумал',
        });
      });
  }

  protected removeFile(): void {
    this.form.get('file')?.setValue(null);
  }

  private processFile(
    file: TuiFileLike | null
  ): Observable<TuiFileLike | null> {
    this.failedFiles$.next(null);

    if (this.form.get('file')?.invalid || !file) {
      return of(null);
    }

    this.loadingFiles$.next(file);

    return this.getFileUrl(file).pipe(
      takeUntil(this.destroy$),
      map((fileUrl) => {
        this.avatar.set(fileUrl);

        if (fileUrl) {
          return file;
        }

        this.failedFiles$.next(file);
        return null;
      }),
      finalize(() => this.loadingFiles$.next(null))
    );
  }

  private getFileUrl(file: TuiFileLike): Observable<string> {
    return new Observable<string>((observer) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>): void => {
        const result = (event.target as FileReader).result as string;
        observer.next(result);
        observer.complete();
      };
      reader.onerror = (): void => {
        observer.error('Ошибка чтения файла');
      };
      reader.readAsDataURL(file as File);
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.alert.open('<strong>Заполните все поля</strong>').subscribe();
    } else {
      console.log(this.form.value);
      const { name, surname, phone, file, description } = {
        ...this.form.value,
      } as {
        name: string;
        surname: string;
        phone: string;
        file: File;
        description: string;
      };

      this.disabled.set(true);
      this.updateUserService
        .updateUser(name, surname, phone, file, description)
        .pipe(
          takeUntil(this.destroy$),
          tap(() => this.removeFile())
        )
        .subscribe(() => {
          this.disabled.set(false);
          this.alert.open('<strong>Данные записаны</strong>').subscribe();
          this.closeDialogEvent.emit();
        });
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
