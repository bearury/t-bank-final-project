import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserItemTableComponent } from '@components/user-item-table/user-item-table.component';
import { setColor } from '@helpers/set-color-badge';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';
import { FilterUsersPipe } from '@pipes/filter-users.pipe';
import { RoleUserToColorPipe } from '@pipes/role-user-to-color.pipe';
import { RoleUserToNamePipe } from '@pipes/role-user-to-name.pipe';
import { TransformCourseToNamePipe } from '@pipes/transform-course-to-name.pipe';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { LoaderService } from '@services/loader.service';
import { TuiTableCell, TuiTableDirective, TuiTableTbody, TuiTableTd, TuiTableTh, TuiTableThGroup, TuiTableTr } from '@taiga-ui/addon-table';
import { TuiFor, TuiLet } from '@taiga-ui/cdk';
import { TuiAutoColorPipe, TuiButton, TuiFormatNumberPipe, TuiHintDirective, TuiInitialsPipe, TuiLoader, TuiTextfieldOptionsDirective, TuiTitle } from '@taiga-ui/core';
import { TuiAvatar, TuiBadge, TuiPin, TuiRadioList, TuiSkeleton, TuiStatus } from '@taiga-ui/kit';
import { TuiCell } from '@taiga-ui/layout';
import { TuiInputModule, TuiMultiSelectModule, TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

import { RoleItems } from '../../shared/models/role-items.model';

@Component({
  selector: 'app-filtered-users-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RoleUserToColorPipe,
    RoleUserToNamePipe,
    TransformCourseToNamePipe,
    UserItemTableComponent,
    FilterUsersPipe,
    TuiButton,
    TuiRadioList,
    TuiTableDirective,
    TuiTableTh,
    TuiTableThGroup,
    TuiTableTbody,
    TuiTableCell,
    TuiTableTd,
    TuiFormatNumberPipe,
    TuiTableTr,
    TuiCell,
    TuiTitle,
    TuiStatus,
    TuiAvatar,
    TuiBadge,
    TuiInitialsPipe,
    TuiAutoColorPipe,
    TuiSelectModule,
    TuiSkeleton,
    TuiPin,
    TuiLoader,
    TuiInputModule,
    TuiTextfieldOptionsDirective,
    TuiMultiSelectModule,
    TuiTextfieldControllerModule,
    TuiLet,
    TuiFor,
    TuiHintDirective
  ],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersPageComponent implements OnInit {
  public readonly courses = signal<CourseEntity[]>([]);
  public readonly users = signal<UserEntity[]>([]);
  public readonly loadingUsers = signal<boolean>(false);


  public formFilter: FormGroup<{
    name: FormControl<string | null>;
    courses: FormControl<CourseEntity[] | null>;
  }> = new FormGroup(
    {
      name: new FormControl<string | null>(null),
      courses: new FormControl<CourseEntity[] | null>([])
    }
  );

  protected readonly setColor = setColor;
  private readonly userFirestoreService = inject(UsersFirestoreService);
  private readonly coursesService = inject(CoursesFirestoreService);
  private readonly loaderService = inject(LoaderService);
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.userFirestoreService.getAllUser().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((dataUsers) => {
      this.loadingUsers.set(true);
      this.users.update(() => dataUsers);
    });

    this.coursesService.getAll().subscribe((data) =>
      this.courses.set(data)
    );
  }

  public getNameFromCourse(course: CourseEntity): string {
    return course.name;
  }

  public onSelectRole({ uid, roleItem }: { uid: string, roleItem: RoleItems }): void {
    this.loaderService.show();
    this.userFirestoreService
      .updateUserRole({
        uid,
        role: roleItem
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loaderService.hide();
      });
  }
}
