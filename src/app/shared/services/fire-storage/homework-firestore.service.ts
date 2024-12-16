import { inject, Injectable } from '@angular/core';
import {
  collection,
  collectionData,
  Firestore,
  query,
} from '@angular/fire/firestore';
import { HomeworkEntity } from '@interfaces/homework.entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeworkFirestoreService {
  private readonly firestore = inject(Firestore);
  public getHomeworks(): Observable<HomeworkEntity[]> {
    const queryId = query(collection(this.firestore, 'homeworks'));
    return collectionData(queryId, { idField: 'id' }) as Observable<
      HomeworkEntity[]
    >;
  }
}
