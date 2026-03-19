import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { listFadeIn } from '../../animations/list-fade/list-fade';
import { fadeInOut } from '../../animations/fade-in/fade-in';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    UserCardComponent,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './users-list.component.html',
  animations: [listFadeIn, fadeInOut],
})
export class UsersListComponent {
  _user = inject(UsersService);
  state$ = this._user.state$;
  loading$ = this._user.getLoading$;
  userList$: Observable<User[]> = this._user.users$;

  onChangePage(page: number) {
    this._user.changePage(page);
  }
}
