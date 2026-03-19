import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  delay,
  EMPTY,
  finalize,
  map,
  Observable,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class GlobalObservablesHandlerService {
  constructor() {}

  withLoadingAndError<T>(
    source: Observable<T>,
    loading: BehaviorSubject<boolean>,
  ) {
    loading.next(true);
    return source.pipe(
      // i added delay to show spinners
      delay(800),
      map((res) => res),
      finalize(() => {
        loading.next(false);
      }),
      catchError((e) => {
        console.log(e.message);
        return EMPTY;
      }),
    );
  }
}
