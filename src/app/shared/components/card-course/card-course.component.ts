import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { setColor } from '@helpers/set-color-badge';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';
import { MessageBadgeCoursesPipe } from '@pipes/message-badge-courses.pipe';
import { TuiSurface, TuiTitle } from '@taiga-ui/core';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-card-course',
  standalone: true,
  imports: [CommonModule, TuiCardLarge, TuiHeader, TuiSurface, NgOptimizedImage, TuiBadge, TuiTitle, RouterLink, MessageBadgeCoursesPipe],
  templateUrl: './card-course.component.html',
  styleUrl: './card-course.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardCourseComponent {
  public readonly notFoundImg = 'not-found-img.webp';
  public readonly setColor = setColor;

  public course = input.required<CourseEntity>();
  public currentUser = input.required<UserEntity | null>();
}
