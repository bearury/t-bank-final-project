import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';

export interface ICourses {
  readonly courses: CourseEntity[];
  readonly currentUser: UserEntity | undefined;
}

