import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  NormalizedHomeworkEntity,
  StatusHomework,
} from '@interfaces/homework.entity';
import { HomeworksService } from '@services/homeworks/homeworks.service';
import { TuiTable } from '@taiga-ui/addon-table';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiDialogService,
  TuiDialogSize,
  TuiHint,
  TuiIcon,
  TuiLink,
  TuiLoader,
} from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';
import { TuiTextareaModule } from '@taiga-ui/legacy';
import { PolymorpheusContent } from '@taiga-ui/polymorpheus';
import { Observer } from 'rxjs';

import { ChangeAppearancePipe } from '../../pipes/change-appearance.pipe';
import { ChangeStatusNamePipe } from '../../pipes/change-status-name.pipe';
import { ShowDataPipe } from '../../pipes/show-data.pipe';

@Component({
  selector: 'app-homework-teacher',
  standalone: true,
  imports: [
    CommonModule,
    TuiTable,
    RouterLink,
    TuiIcon,
    TuiTextareaModule,
    RouterLink,
    TuiLink,
    ReactiveFormsModule,
    ShowDataPipe,
    TuiChip,
    ChangeAppearancePipe,
    ChangeStatusNamePipe,
    TuiLoader,
    TuiHint,
  ],
  templateUrl: './homework-teacher.component.html',
  styleUrl: './homework-teacher.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeworkTeacherComponent {
  @Input() public homeworks!: NormalizedHomeworkEntity[];
  protected modalSignal = signal(false);
  private readonly dialogs = inject(TuiDialogService);
  private readonly homeworkService = inject(HomeworksService);
  private readonly alert = inject(TuiAlertService);
  protected comment = '';
  protected disable = signal(false);
  public form = new FormGroup({
    comment: new FormControl('', Validators.minLength(20)),
  });

  protected showModal(
    content: PolymorpheusContent<TuiDialogContext>,
    header: PolymorpheusContent,
    size: TuiDialogSize
  ): void {
    this.dialogs
      .open(content, {
        label: 'Проверка дз',
        header,
        size,
      })
      .subscribe();
  }

  protected setComment(comment: string): void {
    this.form.setValue({ comment });
  }

  protected submit(
    uid: string,
    observer: Observer<void>,
    status: StatusHomework
  ): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
    } else {
      this.disable.set(true);
      const review = this.form.value.comment;

      if (!review) {
        return;
      } else {
        const dateSubmitted = new Date().toISOString();
        this.homeworkService
          .updateHomeworkFields(uid, { review, dateSubmitted, status })
          .subscribe(() => {
            this.disable.set(false);
            observer.complete();
            this.alert.open('Успешно проверено').subscribe();
          });
      }
    }
  }
}
