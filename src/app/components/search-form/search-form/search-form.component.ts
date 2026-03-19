import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../services/users/users.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fadeInOut } from '../../../animations/fade-in/fade-in';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './search-form.component.html',
  animations: [fadeInOut],
})
export class SearchFormComponent implements OnInit {
  private _userService = inject(UsersService);
  loading$ = this._userService.searchLoading$;
  searchForm!: FormGroup;

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
    });
  }

  searchFormControl(key: 'search') {
    return this.searchForm.get(key);
  }
  search() {
    console.log('search');

    this._userService.searchAction(
      this.searchFormControl('search')?.value || '',
    );
  }
}
