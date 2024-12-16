import { ICourse } from '@interfaces/course.interface';
import { LessonEntity } from '@interfaces/lesson.entity';
import { TaskEntity } from '@interfaces/task.entity';

export interface CourseData {
  readonly course: ICourse | null;
  readonly lessons: LessonEntity[];
  readonly tasks: TaskEntity[];
  readonly isCourseToTeacher: boolean;
}
