import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  WritableSignal,
  OnDestroy,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EditUserFormComponent } from '@components/edit-user-form/edit-user-form.component';
import { CourseEntity } from '@interfaces/course.entity';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { AuthFirestoreService } from '@services/fire-storage/auth-firestore.service';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import {
  TuiAlertService,
  TuiButton,
  TuiDialog,
  TuiHint,
  TuiIcon,
  TuiLoader,
} from '@taiga-ui/core';
import { TuiAvatar, TuiBadge } from '@taiga-ui/kit';
import { of, Subject, switchMap, takeUntil } from 'rxjs';

import { ShowImagePipe } from '../../shared/pipes/show-image.pipe';
import { ShowNumberPipe } from '../../shared/pipes/show-phone-number.pipe';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    CommonModule,
    TuiAvatar,
    TuiButton,
    TuiDialog,
    EditUserFormComponent,
    TuiLoader,
    TuiBadge,
    RouterLink,
    TuiIcon,
    TuiHint,
    ShowNumberPipe,
    ShowImagePipe,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnDestroy {
  public loader: WritableSignal<boolean> = signal(false);
  private readonly router = inject(Router);
  private readonly alert = inject(TuiAlertService);
  private readonly currentUserService = inject(CurrentUserService);
  private readonly courseServise = inject(CoursesFirestoreService);
  private readonly authService = inject(AuthFirestoreService);
  public readonly currentUser$ = this.currentUserService.getCurrentUser();
  public courses = signal<CourseEntity[]>([]);
  protected openEditForm = false;
  protected openLogoutDialog = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor() {
    this.loader.set(true);
    this.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loader.set(false));

    this.courseServise
      .getAll()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((courses) => {
          return this.currentUser$.pipe(
            switchMap((user) => {
              const userCourses = courses.filter((course) =>
                user?.courses.includes(course.uid)
              );
              return of(userCourses);
            })
          );
        })
      )
      .subscribe((courses) => {
        this.courses.set(courses);
      });
  }

  public setColorBadge(course: string): string {
    const index = this.courses().findIndex((c) => c.uid === course);
    const color = [
      'accent',
      'primary',
      'info',
      'warning',
      'positive',
      'custom',
    ];
    return color[index % color.length];
  }

  public showEditForm(): void {
    this.openEditForm = true;
  }

  public closeFormDialog(): void {
    this.openEditForm = false;
  }

  public showExitDialog(): void {
    this.openLogoutDialog = true;
  }

  public signOut(): void {
    this.authService.signOut().pipe(takeUntil(this.destroy$)).subscribe();
    this.router.navigate(['/login']);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
