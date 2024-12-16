import { Injectable, inject } from '@angular/core';
import { addDoc, collectionData, docData, Firestore, updateDoc } from '@angular/fire/firestore';
import { HomeworkEntity } from '@interfaces/homework.entity';
import { collection, doc, DocumentData, query } from 'firebase/firestore';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeworksFirestoreServiceTsService {
  private readonly db = inject(Firestore);

  public getAll(): Observable<readonly HomeworkEntity[]> {
    const queryId = query(collection(this.db, 'homeworks'));
    return collectionData(queryId, { idField: 'id' }) as Observable<
      HomeworkEntity[]
    >;
  }

  public getHomework(uid: string): Observable<DocumentData | null> {
    const homeworkRef = doc(this.db, 'homeworks', uid);

    return docData(homeworkRef, { idField: 'id' }).pipe(
      map((data) => (data ? data : null))
    );
  }

  public getHomeworkByUserAndTask(userId: string, taskId: string): Observable<HomeworkEntity | null> {
    return this.getAll().pipe(
      map((homeworks) => {
        const homework: HomeworkEntity | undefined = homeworks.find((homework) => {
          return homework.userId === userId && homework.taskId === taskId
        });
        return homework ? homework : null;
      }),
    )
  }
  
  public createHomework(createHomeworkData: Omit<HomeworkEntity, 'uid'>): Observable<void | null> {
    return from(addDoc(collection(this.db, 'homeworks'), createHomeworkData))
    .pipe(
      switchMap((homeworkDocRef) => {
        return from(updateDoc(homeworkDocRef, {uid: homeworkDocRef.id}));
      }),
    );
  }

  public updateHomework(editHomeworkData: HomeworkEntity): Observable<void | null> {
    return from(updateDoc(doc(this.db, 'homeworks', editHomeworkData.uid), editHomeworkData));
  }
}
