import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collectionData,
  docData,
  Firestore,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { TaskEntity } from '@interfaces/task.entity';
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  query,
} from 'firebase/firestore';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksFiestoreService {
  private readonly db = inject(Firestore);

  public foundForCourseId(courseUid: string): Observable<TaskEntity[]> {
    const tasksRef = collection(this.db, 'tasks');
    const q = query(tasksRef, where('courseId', '==', courseUid));
    return collectionData(q) as Observable<TaskEntity[]>;
  }

  public getAll(): Observable<readonly TaskEntity[]> {
    const queryId = query(collection(this.db, 'tasks'));
    return collectionData(queryId, { idField: 'id' }) as Observable<
      TaskEntity[]
    >;
  }

  public getTask(uid: string): Observable<DocumentData | null> {
    const taskRef = doc(this.db, 'tasks', uid);

    return docData(taskRef, { idField: 'id' }).pipe(
      map((data) => (data ? data : null))
    );
  }

  public getTaskById(uid: string): Observable<TaskEntity | null> {
    const userRef = doc(this.db, 'tasks', uid);
    return docData(userRef, { idField: 'id' }).pipe(
      map((task) => task as TaskEntity),
      map((data) => (data ? data : null))
    );
  }

  public getTasks(): Observable<TaskEntity[]> {
    const queryId = query(collection(this.db, 'tasks'));
    return collectionData(queryId, { idField: 'id' }) as Observable<
      TaskEntity[]
    >;
  }

  public createTask(
    createTaskData: Omit<TaskEntity, 'uid'>
  ): Observable<void | null> {
    return from(addDoc(collection(this.db, 'tasks'), createTaskData)).pipe(
      switchMap((taskDocRef) => {
        return from(updateDoc(taskDocRef, { uid: taskDocRef.id }));
      })
    );
  }

  public updateTask(editTaskData: {
    uid: string;
    name: string;
    description: string;
    courseId: string;
  }): Observable<void | null> {
    return from(
      updateDoc(doc(this.db, 'tasks', editTaskData.uid), editTaskData)
    );
  }

  public deleteTask(uid: string): Observable<void> {
    return from(deleteDoc(doc(this.db, 'tasks', uid)));
  }
}
