export type LessonEntity = Readonly<{
  uid: string;
  name: string;
  description: string;
  videoLink: string;
  additionalMaterial: string[];
  courseId: string;
  deadline: string;
}>