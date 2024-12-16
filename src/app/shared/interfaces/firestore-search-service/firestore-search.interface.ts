import { DocumentData } from 'firebase/firestore';
import { Observable } from 'rxjs';

export interface IFirestoreSearch {
  searchItems(
    collectionName: string,
    field: string,
    searchTerm: string
  ): Observable<DocumentData | null>;
}
