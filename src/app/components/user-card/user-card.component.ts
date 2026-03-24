import { Component, DestroyRef, inject, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';

import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { listFadeIn } from '../../animations/list-fade/list-fade';
import { fadeInOut } from '../../animations/fade-in/fade-in';
import { AddUserDialogComponent } from '../add-new-user/add-new-user-modal/add-new-user-modal.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../shared/confirm-delete-dialog/confirm-delete-dialog.component';
import { UsersService } from '../../services/users/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
    MatProgressSpinner,
  ],
  animations: [fadeInOut],
  templateUrl: './user-card.component.html',
})
export class UserCardComponent {
  @Input() user!: User;
  private _userService = inject(UsersService);
  private destroyRef = inject(DestroyRef);
  loading$ = this._userService.actionLoading$;
  mode: 'delete' | 'edit' | '' = '';
  constructor(private dialog: MatDialog) {}

  onEdit() {
    this.mode = 'edit';
    this.dialog.open(AddUserDialogComponent, {
      data: this.user, // can be any value or object
    });
  }

  onConfirm(id: string) {
    this._userService.deleteUserAction(id);
  }
  onDelete(id: string) {
    this.mode = 'delete';
    const dialogData: ConfirmDialogData = {
      title: 'Confirm Delete',
      message: `Are you sure you want to delete ${this.user.name}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: dialogData,
    });

    this._userService.actionCompleted$;

    dialogRef
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed: boolean) => {
        if (confirmed) {
          this._userService.deleteUserAction(id);
        }
      });
  }
}
