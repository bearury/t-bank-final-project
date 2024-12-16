import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { roleItems } from '@consts/role-items.consts';
import { setColor } from '@helpers/set-color-badge';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';
import { RoleUserToColorPipe } from '@pipes/role-user-to-color.pipe';
import { RoleUserToNamePipe } from '@pipes/role-user-to-name.pipe';
import { TransformCourseToNamePipe } from '@pipes/transform-course-to-name.pipe';
import { LoaderService } from '@services/loader.service';
import { TuiTableTd } from '@taiga-ui/addon-table';
import { TuiAutoColorPipe, TuiHintDirective, TuiInitialsPipe, TuiTitle } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge, TuiSkeleton, TuiStatus } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { TuiSelectModule } from '@taiga-ui/legacy';

import { RoleItems } from '../../models/role-items.model';

@Component({
  standalone: true,
  selector: 'app-user-item-table',
  imports: [CommonModule, TuiTableTd, TuiCell, TuiAvatar, TuiBadge, TuiStatus, TuiHintDirective, ReactiveFormsModule, TuiSelectModule, RoleUserToColorPipe, RoleUserToNamePipe, TuiSkeleton, TransformCourseToNamePipe, TuiInitialsPipe, TuiAutoColorPipe, TuiTitle],
  templateUrl: './user-item-table.component.html',
  styleUrl: './user-item-table.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserItemTableComponent implements OnInit {
  public readonly setColor = setColor;
  public readonly roleItems = roleItems;
  public item = input.required<UserEntity>();
  public courses = input.required<CourseEntity[]>();
  public loadingChangeRole = signal<boolean>(false);

  public readonly form = new FormGroup<{ role?: FormControl }>({});
  public readonly auth = inject(Auth);
  @Output() public handleChangeRole = new EventEmitter<{ uid: string, roleItem: RoleItems }>();
  private readonly loaderService = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    const control = new FormControl(
      roleItems.find((role) => role.name === this.item().role)
    );
    this.form.addControl('role', control);

    this.loaderService.loading$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(status => this.loadingChangeRole.set(status));
  }
}
