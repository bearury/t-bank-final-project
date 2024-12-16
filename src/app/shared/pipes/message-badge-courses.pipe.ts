import { Pipe, PipeTransform } from '@angular/core';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';


@Pipe({
  name: 'messageBadgeCourses',
  standalone: true
})
export class MessageBadgeCoursesPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(course: CourseEntity, currentUser: (UserEntity | null)): string {
    if (currentUser?.role === 'user') {
      return currentUser.courses.includes(course.uid) ? 'В процессе' : 'Не начат';
    } else if (currentUser?.role === 'teacher' || currentUser?.role === 'admin') {
      return course.status === 'assigned' ? 'Назначен' : 'Не назначен';
    } else {
      return '';
    }
  }
}
