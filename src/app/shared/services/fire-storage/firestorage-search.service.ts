import { inject, Injectable } from '@angular/core';
import {
  collectionData,
  collection,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { IFirestoreSearch } from '@interfaces/firestore-search-service/firestore-search.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestorageSerarchService implements IFirestoreSearch {
  private readonly firestore = inject(Firestore);

  public searchItems(
    collectionName: string,
    field: string,
    value: string
  ): Observable<any[]> {
    const colRef = collection(this.firestore, collectionName);
    const q = query(
      colRef,
      where(field, '>=', value),
      where(field, '<=', value + '\uf8ff')
    );
    return collectionData(q);
  }
}
