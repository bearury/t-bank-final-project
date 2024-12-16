import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NormalizedHomeworkEntity } from '@interfaces/homework.entity';
import {
  TuiAppearance,
  TuiButton,
  TuiLink,
  TuiScrollable,
  TuiScrollbar,
} from '@taiga-ui/core';
import { TuiChip, TuiFade } from '@taiga-ui/kit';
import { TuiCardLarge } from '@taiga-ui/layout';

import { ChangeAppearancePipe } from '../../pipes/change-appearance.pipe';
import { ChangeStatusNamePipe } from '../../pipes/change-status-name.pipe';
import { ShowDataPipe } from '../../pipes/show-data.pipe';

@Component({
  selector: 'app-homework-user',
  standalone: true,
  imports: [
    CommonModule,
    TuiCardLarge,
    TuiAppearance,
    TuiChip,
    TuiFade,
    TuiScrollable,
    TuiScrollbar,
    TuiButton,
    RouterLink,
    ChangeAppearancePipe,
    ChangeStatusNamePipe,
    TuiLink,
    ShowDataPipe,
  ],
  templateUrl: './homework-user.component.html',
  styleUrl: './homework-user.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeworkUserComponent {
  @Input() public homeworks!: NormalizedHomeworkEntity[];
}
