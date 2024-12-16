import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, isSignInWithEmailLink, sendEmailVerification, sendSignInLinkToEmail, signInWithEmailAndPassword, signInWithEmailLink, updateProfile } from '@angular/fire/auth';
import { AnalyticsService } from '@services/analytics/analytics.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { TuiAlertService } from '@taiga-ui/core';
import { User } from 'firebase/auth';
import { catchError, from, map, mergeMap, Observable, of, switchMap, tap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root'
})
export class AuthFirestoreService {
  private readonly analytics = inject(AnalyticsService);
  private readonly auth = inject(Auth);
  private readonly alerts = inject(TuiAlertService);
  private readonly usersFirestoreService = inject(UsersFirestoreService);

  public createAccount(
    email: string,
    password: string,
    name: string
  ): Observable<User | null> {
    return fromPromise(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      tap(() => this.analytics.trackEvent(`Try create account for ${email} `)),
      tap((userCredential) => {
        this.analytics.trackEvent(
          `Account created for ${userCredential.user.email} `
        );
        return updateProfile(userCredential.user, { displayName: name });
      }),
      tap((userCredential) => sendEmailVerification(userCredential.user)),
      tap((userCredential) => {
        this.analytics.trackEvent(
          `Verification email sent to ${userCredential.user.email}`
        );
        this.alerts
          .open('', {
            label: `Ссылка для подтверждения почты, отправлена на почту ${userCredential.user.email}`,
            appearance: 'info'
          })
          .subscribe();
      }),
      switchMap((userCredential) => of(userCredential.user)),
      catchError((error) => {
        this.analytics.logError(error);
        this.alerts
          .open('', { label: error, appearance: 'negative' })
          .subscribe();
        return of(null);
      })
    );
  }

  public sendSignInLink(email: string): Observable<boolean> {
    const actionCodeSettings = {
      url: 'http://localhost:4200/finish-signup',
      handleCodeInApp: true
    };

    return fromPromise(
      sendSignInLinkToEmail(this.auth, email, actionCodeSettings)
    ).pipe(
      tap(() => window.localStorage.setItem('emailForSignIn', email)),
      tap(() => {
        this.analytics.trackEvent(`Verification email sent to ${email}`);
        this.alerts
          .open('', {
            label: 'Ссылка для входа отправлена на электронную почту!',
            appearance: 'info'
          })
          .subscribe();
      }),
      switchMap(() => of(true)),
      catchError((error) => {
        this.analytics.logError(error);
        this.alerts
          .open('', { label: error, appearance: 'negative' })
          .subscribe();
        return of(false);
      })
    );
  }

  public confirmSignIn(email: string): Observable<User | null> {
    if (isSignInWithEmailLink(this.auth, window.location.href)) {
      return fromPromise(
        signInWithEmailLink(this.auth, email, window.location.href)
      ).pipe(
        tap(() => window.localStorage.removeItem('emailForSignIn')),
        tap((userCredential) =>
          this.usersFirestoreService.createUser({
            uid: userCredential.user.uid,
            email: userCredential.user.email || '',
            name: userCredential.user.displayName || ''
          })
        ),
        switchMap((userCredential) => of(userCredential.user)),
        catchError((error) => {
          this.alerts
            .open('', { label: error, appearance: 'negative' })
            .subscribe();
          return of(null);
        })
      );
    } else {
      return of(null);
    }
  }

  public signIn(email: string, password: string): Observable<User | null> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      tap((userCredential) =>
        this.analytics.trackEvent(`Start sign in ${userCredential.user.email}`)
      ),
      mergeMap((userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) {
          this.analytics.trackEvent(`${user.email} not verificated `);
          this.alerts
            .open('Проверьте почту для подтверждения', {
              label: 'Почта не подтверждена',
              appearance: 'negative'
            })
            .subscribe();
          this.auth.signOut();
          return of(null);
        } else {
          this.analytics.trackEvent(`${user.email} succesful signin `);
          if (userCredential.user.uid) {
            return this.usersFirestoreService
              .getUser(userCredential.user.uid)
              .pipe(
                mergeMap((userData) => {
                  if (!userData) {
                    return this.usersFirestoreService
                      .createUser({
                        uid: userCredential.user.uid,
                        email: userCredential.user.email || '',
                        name: userCredential.user.displayName || ''
                      })
                      .pipe(map(() => user));
                  } else {
                    return of(user);
                  }
                })
              );
          } else {
            return of(null);
          }
        }
      }),

      catchError((error) => {
        this.analytics.logError(error);
        this.alerts
          .open('Ошибка входа', {
            label: 'Не верный логин или пароль',
            appearance: 'negative'
          })
          .subscribe();
        return of(null);
      })
    );
  }

  public signOut(): Observable<void> {
    this.analytics.trackEvent(`user ${this.auth.currentUser?.email} is logout`);
    return from(this.auth.signOut()).pipe(
      tap(() => {
        if (!this.auth.currentUser) {
          this.alerts
            .open('Вы успешно вышли из системы', {
              label: 'Выход выполнен',
              appearance: 'info'
            })
            .subscribe();
        }
      })
    );
  }
}
