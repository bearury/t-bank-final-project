import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { DocumentData } from '@angular/fire/compat/firestore';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ContactsComponent } from '@components/contacts/contacts.component';
import {
  BACKGROUND_COLOR_LIGHT,
  TXT_COLOR_DARK,
} from '@consts/layout-theme.const';
import { AuthFirestoreService } from '@services/fire-storage/auth-firestore.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { HeaderThemeService } from '@services/header-theme/header-theme.service';
import { TuiButton, TuiDataList, TuiDropdown, TuiFallbackSrcPipe, TuiIcon } from '@taiga-ui/core';
import { TuiAvatar, TuiChevron } from '@taiga-ui/kit';
import { Observable, Subject, map, of, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    TuiIcon, 
    RouterLink, 
    RouterLinkActive, 
    TuiDataList, 
    TuiButton, 
    TuiDropdown, 
    CommonModule,
    TuiIcon,
    RouterLink,
    RouterLinkActive,
    TuiDataList,
    TuiButton,
    TuiDropdown,
    TuiChevron,
    ContactsComponent,
    TuiAvatar,
    TuiFallbackSrcPipe, 
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly auth = inject(Auth);
  private readonly authFirestoreService = inject(AuthFirestoreService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();
  private readonly usersFirestoreService = inject(UsersFirestoreService);
  private readonly headerThemeService = inject(HeaderThemeService);
  private readonly router = inject(Router);

  protected theme$ = this.headerThemeService.getTheme();

  protected userName: string | null = null;
  protected userAvatar: string | null = null;
  protected user$: Observable<DocumentData | null> = of(null);
  protected isAdmin = false;

  protected contactsBackgroundColor = BACKGROUND_COLOR_LIGHT;
  protected contactsColor = TXT_COLOR_DARK;

  protected isProfileDropdownOpened = false;

  protected isMenuOpened = false;

  protected isScrolled = false;

  @HostListener('window:scroll', [])
  protected onWindowScroll(): void {
    this.isScrolled = window.scrollY > 0;
  }

  public ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user$ = this.usersFirestoreService.getUser(user.uid)
          .pipe(
            map((userData) => {
              if (userData) {
                if (!userData['name']) {
                  userData['name'] = 'Пользователь';
                }
                this.isAdmin = userData['role'] === 'admin';
              }
              return userData;
            }),
            takeUntil(this.destroy$)
          )
      } 
      else {
        this.user$ = of(null);
        this.isAdmin = false;
      }
      this.cdr.markForCheck();
    })
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected closeDropdown(): void {
    this.isProfileDropdownOpened = false;
  }

  protected toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  protected closeMenu(): void {
    this.isMenuOpened = false;
  }

  protected logout(): void {
    this.authFirestoreService.signOut()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeMenu();
        this.router.navigate(['']);
      })
  }
}
