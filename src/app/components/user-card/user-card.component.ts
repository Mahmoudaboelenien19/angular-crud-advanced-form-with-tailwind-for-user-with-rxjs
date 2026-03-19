import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { listFadeIn } from '../../animations/list-fade/list-fade';
import { fadeInOut } from '../../animations/fade-in/fade-in';
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    CommonModule,
  ],
  animations: [fadeInOut],
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {
  @Input() user!: User;
  onEdit() {}
  onDelete() {}
}
