import { inject, Injectable, signal } from '@angular/core';
import { UserEntity } from '@interfaces/user.entity';
import { FirestorageSerarchService } from '@services/fire-storage/firestorage-search.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private readonly userService = inject(UsersFirestoreService);
  private readonly searchService = inject(FirestorageSerarchService);

  public loading = signal(false);
  public names = signal<string[]>([]);

  public getTeachers(): Observable<UserEntity[]> {
    return this.userService
      .getAllUser()
      .pipe(map((users) => users.filter((user) => user.role === 'teacher')));
  }

  public getTeacherById(id: string): Observable<UserEntity> {
    return this.userService.getUser(id).pipe(map((user) => user as UserEntity));
  }

  public searchTeachers(
    query$: Observable<string | null>
  ): Observable<UserEntity[]> {
    return query$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
      tap(() => this.loading.set(true)),
      switchMap((query) =>
        query
          ? this.searchService.searchItems('users', 'name', query).pipe(
              map((users) => users as UserEntity[]),
              map((users) => users.filter((user) => user.role === 'teacher')),
              switchMap((teachers) => {
                if (teachers.length === 0) {
                  return this.getTeachers();
                }
                return of(teachers);
              })
            )
          : this.getTeachers()
      ),
      tap(() => this.loading.set(false)),
      tap((teachers) => this.names.set(teachers.map((teacher) => teacher.name)))
    );
  }
}
