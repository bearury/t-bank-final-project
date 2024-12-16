import { Injectable, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HeaderTheme } from '@interfaces/header-theme/header-theme.interface';
import { Observable, Subject, filter, map, takeUntil } from 'rxjs';

import { BACKGROUND_COLOR_DARK, BACKGROUND_COLOR_LIGHT, LOGO_DARK, LOGO_LIGHT, TXT_COLOR_DARK, TXT_COLOR_LIGHT } from '../../consts/layout-theme.const';

@Injectable({
  providedIn: 'root'
})
export class HeaderThemeService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly router = inject(Router);
  private readonly themeSubject = new Subject<HeaderTheme>();

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map((event: NavigationEnd) => event.url),
        takeUntil(this.destroy$)
      )
      .subscribe((url) => {
        this.themeSubject.next(url === '/' ? {
          backgroundColor: BACKGROUND_COLOR_LIGHT,
          color: TXT_COLOR_DARK,
          logo: LOGO_DARK,
        } : {
          backgroundColor: BACKGROUND_COLOR_DARK,
          color: TXT_COLOR_LIGHT,
          logo: LOGO_LIGHT,
        });
      })
  }

  public getTheme(): Observable<HeaderTheme> {
    return this.themeSubject.asObservable();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
