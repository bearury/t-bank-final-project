import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StatisticsCardComponent } from '@components/statistics-card/statistics-card.component';
import { Advantage } from '@interfaces/advantage.interface';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { TuiIconPipe } from '@taiga-ui/core';
import { Observable, map } from 'rxjs';
import { StatisticsUnits } from 'src/app/shared/types/statistics-units.type';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, StatisticsCardComponent, NgOptimizedImage, TuiIconPipe],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent {
  private readonly usersFirestoreService = inject(UsersFirestoreService);
  private readonly coursesFirestoreService = inject(CoursesFirestoreService);

  protected coursesAmount$: Observable<number>;
  protected teachersAmount$: Observable<number>;
  protected studentsAmount$: Observable<number>;

  protected advantages: Advantage[] = [
    {
      svg: '/svg/process.svg',
      text: 'Передовой подход к образовательному процессу'
    },
    {
      svg: '/svg/book.svg',
      text: 'Непрерывное усовершенствование и пополнение базы курсов'
    },
    {
      svg: '/svg/lesson.svg',
      text: 'Только практикующие преподаватели'
    },
    {
      svg: '/svg/teacher.svg',
      text: 'Сопровождение на всех этапах. От начала обучения до трудоустройства'
    },
  ];

  protected statisticsItems: {amount: Observable< number>, units: StatisticsUnits}[] = [];

  constructor() {
    this.coursesAmount$ = this.coursesFirestoreService.getAll()
    .pipe(
      map(courses => courses.length),
      takeUntilDestroyed()
    ) 

    this.teachersAmount$ = this.usersFirestoreService.getUsersByRole('teacher')
      .pipe(
        map(teachers => teachers.length),
        takeUntilDestroyed()
      ) 

    this.studentsAmount$ = this.usersFirestoreService.getUsersByRole('user')
      .pipe(
        map(users => users.length),
        takeUntilDestroyed()
      )

    this.statisticsItems = [
      {
        amount: this.coursesAmount$,
        units: 'course'
      },
      {
        amount: this.teachersAmount$,
        units: 'teacher'
      },
      {
        amount: this.studentsAmount$,
        units: 'student'
      },
    ];
  }
}
