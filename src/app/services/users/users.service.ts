import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concatMap,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  pipe,
  scan,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { GlobalObservablesHandlerService } from '../globalObservablesHandler/global-observables-handler.service';
import { User } from '../../models/user.model';
const Page_Size = 5;
type EffectMap = {
  getAll: { users: User[] };
  search: { users: User[] };
  refresh: { users: User[] };
  edit: { user: User };
};
type State = {
  page: number;
  total: number;
  search: string;
};
type UsersEffect = {
  [K in keyof EffectMap]: { type: K } & EffectMap[K];
}[keyof EffectMap];
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor() {}
  //services
  private http = inject(HttpClient);
  private _ob_handler = inject(GlobalObservablesHandlerService);

  //subjects
  getLoading = new BehaviorSubject(false);
  getLoading$ = this.getLoading.asObservable();
  searchLoading = new BehaviorSubject(false);
  searchLoading$ = this.searchLoading.asObservable();

  actionLoading = new BehaviorSubject(false);
  actionLoading$ = this.actionLoading.asObservable();

  actionCompleted = new BehaviorSubject(false);
  actionCompleted$ = this.actionCompleted.asObservable();
  state$ = new BehaviorSubject<State>({
    page: 0,
    total: 0,
    search: '',
  });
  private add$ = new Subject<User>();
  private edit$ = new Subject<User>();
  private delete$ = new Subject<string>();
  users$: Observable<User[]> = merge(
    this.add$.pipe(concatMap((u) => this.addUserWithHandler(u))),
    this.edit$.pipe(concatMap((u) => this.EditUserWithHandler(u))),
    this.delete$.pipe(concatMap((id) => this.deleteUserWithHandler(id))),
    this.state$.pipe(
      // map((p) => p.page),
      distinctUntilChanged(
        (prev, curr) => prev.page === curr.page && prev.search === curr.search,
      ),
      switchMap((state) => {
        if (!state.search) {
          return this.getAllUsersWithHandler(state.page);
        } else {
          return this.searchUsersWithHandler(state.search, state.page);
        }
      }),
    ),
  ).pipe(
    scan((users, event) => {
      switch (event.type) {
        case 'getAll':
          return event.users;
        case 'search':
          return event.users;
        case 'refresh':
          return event.users;
        case 'edit':
          return users.map((u) => (u.id == event.user.id ? event.user : u));
        default:
          return users;
      }
    }, [] as User[]),
    startWith([]),
  );
  private changeState(key: keyof State, value: any) {
    this.state$.next({ ...this.state$.value, [key]: value });
  }
  changePage(page: number) {
    this.changeState('page', page);
  }
  getAllUsers(page: number): Observable<User[]> {
    return this.http
      .get<
        User[]
      >(`http://localhost:3000/users?_page=${page + 1}&_limit=${Page_Size}&_sort=id&_order=desc`, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<User[]>) => {
          const totalCount = Number(response.headers.get('X-Total-Count'));
          this.changeState('total', totalCount);
          return response.body as User[];
        }),
      );
  }

  getAllUsersWithHandler(page: number): Observable<UsersEffect> {
    return this._ob_handler
      .withLoadingAndError(this.getAllUsers(page), this.getLoading)
      .pipe(map((users) => ({ users, type: 'getAll' })));
  }
  clearSearch() {
    this.changeState('search', '');
  }
  searchAction(name: string) {
    this.changeState('page', 0);
    this.changeState('search', name);
    // this.search$.next(name);
  }
  private searchUsers(name: string, page: number): Observable<User[]> {
    return this.http
      .get<
        User[]
      >(`http://localhost:3000/users?name_like=${name}&_page=${page + 1}&_limit=${Page_Size}`, { observe: 'response' })
      .pipe(
        map((response: HttpResponse<User[]>) => {
          const total = Number(response.headers.get('X-Total-Count'));
          this.changeState('total', total);
          return response.body as User[];
        }),
      );
  }
  searchUsersWithHandler(name: string, page: number): Observable<UsersEffect> {
    return this._ob_handler
      .withLoadingAndError(this.searchUsers(name, page), this.searchLoading)
      .pipe(map((users) => ({ users, type: 'search' })));
  }

  addUserAction(u: User) {
    this.changeState('search', '');
    this.actionCompleted.next(false);
    this.add$.next(u);
  }
  addUser(u: User) {
    return this.http.post<User>('http://localhost:3000/users', u);
  }

  addUserWithHandler(u: User): Observable<UsersEffect> {
    return this._ob_handler
      .withLoadingAndError(this.addUser(u), this.actionLoading)
      .pipe(
        tap(() => {
          this.actionCompleted.next(true);
        }),
        concatMap(() =>
          this.getAllUsers(0).pipe(
            map((users) => {
              this.changeState('page', 0);
              return { users, type: 'refresh' } as UsersEffect;
            }),
          ),
        ),
      );
  }

  deleteUserAction(id: string) {
    this.actionCompleted.next(false);
    this.delete$.next(id);
  }
  deleteUser(id: string) {
    return this.http.delete<User>('http://localhost:3000/users/' + id);
  }

  deleteUserWithHandler(id: string): Observable<UsersEffect> {
    return this._ob_handler
      .withLoadingAndError(this.deleteUser(id), this.actionLoading)
      .pipe(
        tap(() => {
          this.actionCompleted.next(true);
        }),
        concatMap(() =>
          this.getAllUsers(this.state$.value.page).pipe(
            map((users) => {
              // this.changeState('page', 0);
              return { users, type: 'refresh' } as UsersEffect;
            }),
          ),
        ),
      );
  }
  EditUserAction(u: User) {
    console.log(u);

    this.actionCompleted.next(false);
    this.edit$.next(u);
  }
  editUser(u: User) {
    return this.http.put<User>('http://localhost:3000/users/' + u.id, u);
  }

  EditUserWithHandler(u: User): Observable<UsersEffect> {
    return this._ob_handler
      .withLoadingAndError(this.editUser(u), this.actionLoading)
      .pipe(
        tap(() => {
          this.actionCompleted.next(true);
        }),
        map((user) => ({ user, type: 'edit' })),
      );
  }
}
