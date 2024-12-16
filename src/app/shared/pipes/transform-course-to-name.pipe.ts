import { Pipe, PipeTransform } from '@angular/core';
import { CourseEntity } from '@interfaces/course.entity';

@Pipe({
  name: 'transformCourseToName',
  standalone: true,
})
export class TransformCourseToNamePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  transform(id: string, courses: CourseEntity[]): string {
    return courses.find((c) => c.uid === id)?.name as string;
  }
}
