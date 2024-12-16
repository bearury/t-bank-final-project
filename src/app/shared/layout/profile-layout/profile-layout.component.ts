import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IsActiveMatchOptions,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { TuiSegmented } from '@taiga-ui/kit';

@Component({
  selector: 'app-profile-layout',
  standalone: true,
  imports: [
    CommonModule,
    TuiSegmented,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
  ],
  templateUrl: './profile-layout.component.html',
  styleUrl: './profile-layout.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileLayoutComponent {
  public isAdmin = signal(false);
  private readonly currentUser$ = inject(CurrentUserService)
    .getCurrentUser()
    .pipe(takeUntilDestroyed());

  protected readonly options: IsActiveMatchOptions = {
    matrixParams: 'exact',
    queryParams: 'exact',
    paths: 'exact',
    fragment: 'exact',
  };
  constructor() {
    this.currentUser$.subscribe((user) => {
      if (!user) return;
      if (user.role === 'admin') {
        this.isAdmin.set(true);
      } else {
        this.isAdmin.set(false);
      }
    });
  }
}
