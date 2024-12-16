import { inject, Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, query } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { ITestData } from 'src/app/shared/interfaces/test-data/test-data.interface';

@Injectable({
  providedIn: 'root',
})
export class FireStorageService {
  private readonly firestore = inject(Firestore);
  private readonly testCollection = collection(this.firestore, 'Hello');

  public getWelcomeTitle(): Observable<ITestData[]> {
    const queryId = query(this.testCollection);
    return collectionData(queryId, { idField: 'id' }) as Observable<
      ITestData[]
    >;
  }
}
