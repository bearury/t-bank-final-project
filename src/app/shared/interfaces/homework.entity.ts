export type HomeworkEntity = Readonly<{
  uid: string;
  taskId: string;
  userId: string;
  teacherId: string;
  dateSubmitted: string;
  answerLink: string;
  comment: string;
  review: string;
  status: StatusHomework;
}>;
export interface NormalizedHomeworkEntity extends HomeworkEntity {
  userName: string;
  teacherName: string;
  taskName: string;
}

export type StatusHomework = 'pending' | 'approved' | 'rejected';
