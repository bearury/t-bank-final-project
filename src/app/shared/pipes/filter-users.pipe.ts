import { Pipe, PipeTransform } from '@angular/core';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';

@Pipe({
  name: 'filterUsers',
  standalone: true
})
export class FilterUsersPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(users: UserEntity[], values: Partial<{ name: string | null; courses: CourseEntity[] | null }>): UserEntity[] {
    if (users?.length) {
      return users.filter((user) => {
        const matchesCourse =
          values.courses?.length === 0 ||
          user.courses.some((courseId) => {
            return values.courses?.find((c) => c.uid === courseId);
          });
        const matchesInput =
          !values.name ||
          user.name.toLowerCase().includes(values.name.toLowerCase()) ||
          user.surname.toLowerCase().includes(values.name.toLowerCase()) ||
          `${user.name.toLowerCase()}${user.surname.toLowerCase()}`.includes(
            values.name.toLowerCase().replace(/\s/g, '')
          );
        return matchesCourse && matchesInput;
      });
    } else {
      return [];
    }
  }
}
