import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';
import { ShowImagePipe } from '@pipes/show-image.pipe';
import { TuiAvatar, TuiBadge } from '@taiga-ui/kit';
import { TuiCardMedium } from '@taiga-ui/layout';

import { TransformCourseToNamePipe } from '../../pipes/transform-course-to-name.pipe';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    CommonModule,
    TuiAvatar,
    ShowImagePipe,
    TuiBadge,
    RouterLink,
    TransformCourseToNamePipe,
    RouterLinkActive,
    TuiCardMedium,
  ],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() public teacher!: UserEntity;
  @Input() public courses!: CourseEntity[];

  public setColorBadge(course: string): string {
    const index = this.courses.findIndex((c: CourseEntity) => c.uid === course);
    const color = [
      'accent',
      'primary',
      'info',
      'warning',
      'positive',
      'custom',
    ];
    return color[index % color.length];
  }
}
