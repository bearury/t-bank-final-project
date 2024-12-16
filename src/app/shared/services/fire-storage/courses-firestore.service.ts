import { inject, Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { CourseEntity } from '@interfaces/course.entity';
import { CreateCourse, EditCourse } from '@interfaces/create-edit-course/create-edit-course.interface';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { UploadPhotoService } from '@services/upload-photo/upload-photo.service';
import { TuiAlertService } from '@taiga-ui/core';
import { collection, doc, DocumentData, query } from 'firebase/firestore';
import { catchError, forkJoin, from, map, Observable, of, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CoursesFirestoreService {
  private readonly db = inject(Firestore);
  private readonly uploadPhotoService = inject(UploadPhotoService);
  private readonly alert = inject(TuiAlertService);
  private readonly usersFirestoreService = inject(UsersFirestoreService);

  public getAll(): Observable<CourseEntity[]> {
    const queryId = query(collection(this.db, 'courses'));
    return collectionData(queryId, { idField: 'id' }) as Observable<
      CourseEntity[]
    >;
  }


  public getOne(uid: string): Observable<CourseEntity> {
    const userRef = doc(this.db, 'courses', uid);
    return docData(userRef, { idField: 'id' }).pipe(
      map((data) => (data ? data : null))
    ) as unknown as Observable<CourseEntity>;
  }

  public getCourse(uid: string): Observable<DocumentData | null> {
    const courseRef = doc(this.db, 'courses', uid);
    return docData(courseRef, { idField: 'id' }).pipe(
      map((data) => (data ? data : null))
    );
  }

  public createCourse(createCourseData: CreateCourse): Observable<void | null> {
    const newCourse: Omit<CourseEntity, 'uid'> = this.handleCourseData(createCourseData);

    if (createCourseData.poster && (createCourseData.poster instanceof File)) {
      return this.uploadPhotoService.setPhoto(createCourseData.poster)
        .pipe(
          switchMap((photo) => {
            newCourse.poster = photo ? photo : '';
            return from(addDoc(collection(this.db, 'courses'), newCourse));
          }),
          switchMap((courseDocRef) => {
            return from(updateDoc(courseDocRef, { uid: courseDocRef.id }));
          }),
          catchError(() => {
            this.alert
              .open('<strong class="alert">Ошибка при создании курса</strong>', {
                appearance: 'negative'
              })
              .subscribe();
            return of(null);
          })
        );
    }

    newCourse.poster = createCourseData.poster ? createCourseData.poster : '';
    return from(addDoc(collection(this.db, 'courses'), newCourse))
      .pipe(
        switchMap((courseDocRef) => {
          return from(updateDoc(courseDocRef, { uid: courseDocRef.id }));
        })
      );
  }

  public updateCourse(editCourseData: EditCourse): Observable<void | null> {
    const newCourse: Omit<CourseEntity, 'uid'> = this.handleCourseData(editCourseData);

    if (editCourseData.poster && (editCourseData.poster instanceof File)) {
      return this.uploadPhotoService.setPhoto(editCourseData.poster)
        .pipe(
          switchMap((photo) => {
            newCourse.poster = photo ? photo : '';
            return from(updateDoc(doc(this.db, 'courses', editCourseData.uid), newCourse));
          }),
          catchError(() => {
            this.alert
              .open('<strong class="alert">Ошибка при изменении курса</strong>', {
                appearance: 'negative'
              })
              .subscribe();
            return of(null);
          })
        );
    }

    newCourse.poster = editCourseData.poster ? editCourseData.poster : '';
    return from(updateDoc(doc(this.db, 'courses', editCourseData.uid), newCourse));
  }

  public deleteCourse(uid: string): Observable<void[]> {
    from(deleteDoc(doc(this.db, 'courses', uid))).subscribe();

    return this.usersFirestoreService.getAllUser().pipe(
      map(users => users
        .filter(user => user.courses.includes(uid))
        .map(user => {
          const deletedCourseIndex = user.courses.findIndex(courseId => courseId === uid);
          user.courses.splice(deletedCourseIndex, 1);
          return this.usersFirestoreService.updateUserCourses({ uid: user.uid, courses: user.courses });
        })
      ),
      switchMap((updateUsers$: Observable<void>[]) => {
        return forkJoin(updateUsers$);
      })
    );
  }

  private handleCourseData(courseData: CreateCourse | EditCourse): Omit<CourseEntity, 'uid'> {
    return {
      name: courseData.name,
      description: courseData.description,
      poster: '',
      teachers: courseData.teachers.map(teacher => teacher.uid),
      stack: courseData.stack ? courseData.stack.split(',').map(item => item.trim()) : [],
      status: courseData.status ? 'assigned' : 'unassigned'
    };
  }
}
