import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { UserCardComponent } from '../user-card/user-card.component';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserCardComponent, MatProgressSpinnerModule],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent {
  _user = inject(UsersService);
  loading$ = this._user.getLoading$;
  userList$: Observable<User[]> = this._user.users$;
}
