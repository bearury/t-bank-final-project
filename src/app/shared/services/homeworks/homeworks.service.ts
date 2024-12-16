import { inject, Injectable } from '@angular/core';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import {
  HomeworkEntity,
  NormalizedHomeworkEntity,
  StatusHomework,
} from '@interfaces/homework.entity';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { HomeworkFirestoreService } from '@services/fire-storage/homework-firestore.service';
import { TasksFiestoreService } from '@services/fire-storage/tasks-firestore.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { TuiAlertService } from '@taiga-ui/core';
import {
  catchError,
  combineLatest,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeworksService {
  private readonly firestore = inject(Firestore);
  private readonly currentUser$ = inject(CurrentUserService).getCurrentUser();
  private readonly homeworks$ = inject(HomeworkFirestoreService).getHomeworks();
  private readonly allUsers$ = inject(UsersFirestoreService).getAllUser();
  private readonly allTasks$ = inject(TasksFiestoreService).getTasks();
  private readonly alert = inject(TuiAlertService);

  private getHomeworksForUser(): Observable<HomeworkEntity[]> {
    return this.currentUser$.pipe(
      switchMap((user) => {
        if (!user) {
          this.alert.open('Пользователь не найден').subscribe();
          return of([]);
        }

        return this.homeworks$.pipe(
          map((homeworks) => {
            if (user.role === 'user') {
              return homeworks.filter(
                (homework) => homework.userId === user.uid
              );
            } else if (user.role === 'teacher') {
              return homeworks.filter(
                (homework) => homework.teacherId === user.uid
              );
            }
            return [];
          })
        );
      }),
      catchError(() => {
        this.alert.open('Ошибка при загрузке заданий').subscribe();
        return of([]);
      })
    );
  }

  public getNormalizedHomeworks(): Observable<NormalizedHomeworkEntity[]> {
    const homeworks$ = this.getHomeworksForUser();
    return combineLatest([this.allUsers$, homeworks$, this.allTasks$]).pipe(
      map(([users, homeworks, tasks]) => {
        const userMap = users.reduce((acc, user) => {
          acc[user.uid] = `${user.name} ${user.surname}`;
          return acc;
        }, {} as Record<string, string>);

        const taskMap = tasks.reduce((acc, task) => {
          acc[task.uid] = task.name;
          return acc;
        }, {} as Record<string, string>);

        return homeworks.map((homework) => ({
          ...homework,
          userName: userMap[homework.userId] || 'Unknown User',
          teacherName: userMap[homework.teacherId] || 'Unknown Teacher',
          taskName: taskMap[homework.taskId] || 'Unknown Task',
        }));
      }),
      map((homeworks) =>
        homeworks.sort((a, b) => {
          {
            const dateA = new Date(a.dateSubmitted).getTime();
            const dateB = new Date(b.dateSubmitted).getTime();
            return dateB - dateA;
          }
        })
      ),

      catchError(() => {
        this.alert.open('Ошибка при загрузке заданий').subscribe();
        return of([]);
      })
    );
  }

  public updateHomeworkFields(
    uid: string,
    fieldsToUpdate: Partial<{
      comment: string;
      review: string;
      answerLink: string;
      dateSubmitted: string;
      status: StatusHomework;
    }>
  ): Observable<void> {
    const userDocRef = doc(this.firestore, `homeworks/${uid}`);
    return from(updateDoc(userDocRef, fieldsToUpdate));
  }

  public filterByStatus(
    status: StatusHomework
  ): Observable<NormalizedHomeworkEntity[]> {
    return this.getNormalizedHomeworks().pipe(
      map((homeworks) =>
        homeworks.filter((homework) => homework.status === status)
      )
    );
  }
}
