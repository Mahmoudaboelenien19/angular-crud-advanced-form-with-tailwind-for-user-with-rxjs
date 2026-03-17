import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersListComponent } from './components/users-list/users-list.component';
import { SearchFormComponent } from './components/search-form/search-form/search-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UsersListComponent, SearchFormComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'angular-crud-user-with-rxjs';
}
