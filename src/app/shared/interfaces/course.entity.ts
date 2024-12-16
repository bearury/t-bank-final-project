export interface CourseEntity {
  uid: string;
  name: string;
  description: string;
  poster: string;
  stack: string[];
  status: StatusCourse;
  teachers: string[];
}

export type StatusCourse = 'assigned' | 'unassigned';
