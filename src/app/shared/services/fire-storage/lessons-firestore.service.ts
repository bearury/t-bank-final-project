import { inject, Injectable } from '@angular/core';
import { addDoc, collectionData, deleteDoc, docData, Firestore, updateDoc, where } from '@angular/fire/firestore';
import { LessonEntity } from '@interfaces/lesson.entity';
import { collection, doc, DocumentData, query } from 'firebase/firestore';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonsFirestoreService {
  private readonly db = inject(Firestore);


  public foundForCourseId(courseUid: string): Observable<LessonEntity[]> {
    const tasksRef = collection(this.db, 'lessons');
    const q = query(
      tasksRef,
      where('courseId', '==', courseUid)
    );
    return collectionData(q) as Observable<LessonEntity[]>;
  }

  public getAll(): Observable<readonly LessonEntity[]> {
    const queryId = query(collection(this.db, 'lessons'));
    return collectionData(queryId, { idField: 'id' }) as Observable<
      LessonEntity[]
    >;
  }

  public getLesson(uid: string): Observable<DocumentData | null> {
    const lessonRef = doc(this.db, 'lessons', uid);

    return docData(lessonRef, { idField: 'id' }).pipe(
      map((data) => (data || null))
    );
  }

  public createLesson(createLessonData: Omit<LessonEntity, 'uid'>): Observable<void | null> {
    return from(addDoc(collection(this.db, 'lessons'), createLessonData))
      .pipe(
        switchMap((lessonDocRef) => {
          return from(updateDoc(lessonDocRef, { uid: lessonDocRef.id }));
        })
      );
  }

  public updateLesson(editLessonData: LessonEntity): Observable<void | null> {
    return from(updateDoc(doc(this.db, 'lessons', editLessonData.uid), editLessonData));
  }

  public deleteLesson(uid: string): Observable<void | null> {
    return from(deleteDoc(doc(this.db, 'lessons', uid)));
  }
}
