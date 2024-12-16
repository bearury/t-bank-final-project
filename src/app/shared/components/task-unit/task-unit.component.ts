import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import { TaskEntity } from '@interfaces/task.entity';
import { TuiAutoColorPipe, TuiInitialsPipe, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { TuiCardLarge, TuiCell } from '@taiga-ui/layout';

@Component({
  selector: 'app-task-unit',
  standalone: true,
  imports: [CommonModule, TuiCardLarge, TuiCell, TuiSurface, TuiAvatar, TuiTitle, TuiAutoColorPipe, TuiInitialsPipe],
  templateUrl: './task-unit.component.html',
  styleUrl: './task-unit.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskUnitComponent {
  public task = input.required<TaskEntity>();
  public index = input.required<number>();
  @Output() public handleClick = new EventEmitter<string>();
  protected readonly String = String;
}
