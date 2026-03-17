import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  map,
  merge,
  Observable,
  scan,
  startWith,
  Subject,
} from 'rxjs';
import { GlobalObservablesHandlerService } from '../globalObservablesHandler/global-observables-handler.service';
import { User } from '../../models/user.model';
const Page_Size = 5;
type EffectMap = {
  getAll: { users: User[] };
  search: { users: User[] };
};

type UsersEffect = {
  [K in keyof EffectMap]: { type: K } & EffectMap[K];
}[keyof EffectMap];
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  page = new BehaviorSubject(0);
  private http = inject(HttpClient);
  private _ob_handler = inject(GlobalObservablesHandlerService);
  getLoading = new BehaviorSubject(false);
  getLoading$ = this.getLoading.asObservable();
  searchLoading = new BehaviorSubject(false);
  searchLoading$ = this.searchLoading.asObservable();
  private search$ = new Subject<string>();
  constructor() {}
  users$: Observable<User[]> = merge(
    this.getAllUsersWithHandler(),
    this.search$.pipe(concatMap((name) => this.searchUsersWithHandler(name))),
  ).pipe(
    scan((users, event) => {
      switch (event.type) {
        case 'getAll':
          return event.users;
        case 'search':
          return event.users;
        default:
          return users;
      }
    }, [] as User[]),
    startWith([]),
  );
  getAllUsers() {
    return this.http.get<User[]>('http://localhost:3000/users');
  }

  getAllUsersWithHandler(): Observable<UsersEffect> {
    return this._ob_handler
      .withLoadingAndError(this.getAllUsers(), this.getLoading)
      .pipe(map((users) => ({ users, type: 'getAll' })));
  }

  searchUsers(name: string) {
    return this.http.get<User[]>(
      'http://localhost:3000/users?name_like=' + name,
    );
  }

  searchAction(name: string) {
    this.search$.next(name);
  }
  searchUsersWithHandler(name: string): Observable<UsersEffect> {
    return this._ob_handler
      .withLoadingAndError(this.searchUsers(name), this.searchLoading)
      .pipe(map((users) => ({ users, type: 'search' })));
  }
}
