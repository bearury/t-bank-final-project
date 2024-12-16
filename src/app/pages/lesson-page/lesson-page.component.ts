import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { LessonsFirestoreService } from '@services/fire-storage/lessons-firestore.service';
import { TuiButton, TuiLink } from '@taiga-ui/core';
import { map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-lesson-page',
  standalone: true,
  imports: [CommonModule, RouterLink, TuiButton, TuiLink],
  templateUrl: './lesson-page.component.html',
  styleUrl: './lesson-page.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonPageComponent {
  private readonly lessonsFirebaseService = inject(LessonsFirestoreService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly coursesFirestoreService = inject(CoursesFirestoreService);
  private readonly currentUserService = inject(CurrentUserService);

  private readonly params: Params = this.activatedRoute.snapshot.params as {id: string, lessonId: string};
  protected readonly id = this.params['lessonId'];
  protected readonly courseId = this.params['id'];

  protected lesson$ = this.lessonsFirebaseService.getLesson(this.id).pipe(
    map((lesson) => {
      if (lesson && lesson['videoLink']) {
        lesson['videoLink'] = this.sanitizer.bypassSecurityTrustResourceUrl(lesson['videoLink']);
      }
      return lesson;
    })
  );

  protected isAdminOrTeacher = signal(false);

  constructor() {
    this.coursesFirestoreService.getCourse(this.courseId).pipe(
      switchMap(course => {
        if (course) {
          return this.currentUserService.getCurrentUser().pipe(
            map((user) => {
              if (user) {
                this.isAdminOrTeacher.set(user.role === 'admin' || course['teachers'].includes(user.uid));
              }
              return user;
            })
          );
        }
        return of(course);
      }),
      takeUntilDestroyed()
    )
    .subscribe()
  }
}
