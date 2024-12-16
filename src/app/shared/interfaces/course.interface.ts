import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';

export interface ICourse extends CourseEntity {
  readonly teacherUsers: UserEntity[];
}
