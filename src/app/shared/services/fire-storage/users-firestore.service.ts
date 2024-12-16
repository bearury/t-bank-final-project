import { inject, Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import {
  arrayRemove,
  arrayUnion,
  collectionData,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { UserEntity, UserRole } from '@interfaces/user.entity';
import { collection, doc, query } from 'firebase/firestore';
import { from, map, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

import { RoleItems } from '../../models/role-items.model';

@Injectable({
  providedIn: 'root',
})
export class UsersFirestoreService {
  private readonly db = inject(Firestore);

  public createUser({
    uid,
    email,
    name,
  }: {
    uid: string;
    email: string;
    name: string;
  }): Observable<void> {
    const newUser: UserEntity = {
      email: email,
      uid: uid,
      name: name,
      surname: '',
      avatar: '',
      phone: '',
      role: 'user',
      courses: [],
    };
    return from(setDoc(doc(this.db, 'users', uid), newUser));
  }

  public getUser(uid: string): Observable<DocumentData | null> {
    const userRef = doc(this.db, 'users', uid);
    return docData(userRef, { idField: 'id' }).pipe(
      map((data) => (data ? data : null))
    );
  }

  public getAllUser(): Observable<UserEntity[]> {
    const queryId = query(collection(this.db, 'users'));
    return collectionData(queryId, { idField: 'id' }) as Observable<
      UserEntity[]
    >;
  }

  public updateUserRole(user: {
    uid: string;
    role: RoleItems;
  }): Observable<void> {
    const userRef = doc(this.db, 'users', user.uid);
    return fromPromise(updateDoc(userRef, { role: user.role.name }));
  }

  public getUsersByRole(role: UserRole): Observable<readonly UserEntity[]> {
    return this.getAllUser().pipe(
      map((users: UserEntity[]) => users.filter((user) => user.role === role))
    );
  }

  public addCourse({
    userUid,
    courseUid,
  }: {
    userUid: string;
    courseUid: string;
  }): Observable<void> {
    const userRef = doc(this.db, 'users', userUid);
    return fromPromise(updateDoc(userRef, { courses: arrayUnion(courseUid) }));
  }

  public removeCourse({
    userUid,
    courseUid,
  }: {
    userUid: string;
    courseUid: string;
  }): Observable<void> {
    const userRef = doc(this.db, 'users', userUid);
    return fromPromise(updateDoc(userRef, { courses: arrayRemove(courseUid) }));
  }

  public updateUserCourses(user: {
    uid: string;
    courses: string[];
  }): Observable<void> {
    const userRef = doc(this.db, 'users', user.uid);
    return fromPromise(updateDoc(userRef, { courses: user.courses }));
  }
}
