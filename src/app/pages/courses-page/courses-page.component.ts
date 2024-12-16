import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CardCourseComponent } from '@components/card-course/card-course.component';
import { CoursesService } from '@services/courses/courses.service';
import { TuiAutoColorPipe, TuiButton, TuiLoader, TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiBadge, TuiStatus } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-courses-page',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    NgOptimizedImage,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    TuiButton,
    TuiSurface,
    TuiBadge,
    TuiStatus,
    TuiAutoColorPipe,
    CardCourseComponent,
    TuiLoader
  ],
  templateUrl: './courses-page.component.html',
  styleUrl: './courses-page.component.less'
})
export class CoursesPageComponent {
  private readonly coursesService = inject(CoursesService);
  public isLoading$ = this.coursesService.isLoading$;
  public readonly allCoursesAnfCurrentUser = toSignal(this.coursesService.getAllCoursesAndCurrentUser());
  public readonly courses = computed(() => {
    return this.allCoursesAnfCurrentUser()?.courses;
  });
  public readonly currentUser = computed(() => {
    return this.allCoursesAnfCurrentUser()?.currentUser;
  });
}
