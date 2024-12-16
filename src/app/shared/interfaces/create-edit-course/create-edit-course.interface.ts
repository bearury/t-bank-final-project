import { UserEntity } from "@interfaces/user.entity";

export interface CreateCourse {
  name: string;
  description: string;
  poster: File | string | null;
  teachers: UserEntity[];
  stack: string;
  status: boolean;
}

export interface EditCourse extends CreateCourse {
  uid: string,
}
