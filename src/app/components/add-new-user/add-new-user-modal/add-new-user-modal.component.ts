import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { SharedInputComponent } from '../../shared/input/input.component';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCommonModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users/users.service';
import { User } from '../../../models/user.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
interface UserForm {
  name: FormControl<string>;
  age: FormControl<number>;
  email: FormControl<string>;
  skills: FormArray<FormControl<string>>;
  experience: FormArray<FormGroup<ExperienceForm>>;
}

interface ExperienceForm {
  title: FormControl<string>;
  years: FormControl<number>;
}

@Component({
  selector: 'app-add-new-user-modal',
  standalone: true,
  template: `<div class="w-full flex justify-end p-4">
    <button mat-flat-button (click)="openDialog()">Add User</button>
  </div>`,
  imports: [MatButtonModule, MatDialogModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewUserModalComponent {
  readonly dialog = inject(MatDialog);
  editableUser: User | undefined;
  openDialog() {
    const dialogRef = this.dialog.open(AddUserDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
@Component({
  selector: 'dialog-content',

  templateUrl: './add-new-user-modal.component.html',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    SharedInputComponent,
    MatIcon,
    MatDividerModule,
    MatCommonModule,
    CommonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
})
export class AddUserDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<AddUserDialogComponent>);
  private data = inject(MAT_DIALOG_DATA) as User | undefined; // the passed user or undefined

  private _user_service = inject(UsersService);
  userForm!: FormGroup<UserForm>;
  private destroyRef = inject(DestroyRef);
  actionLoading$ = this._user_service.actionLoading$;
  actionCompleted$ = this._user_service.actionCompleted$;
  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5)],
      }),
      age: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(12)],
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: Validators.email,
      }),
      skills: new FormArray([
        new FormControl('', {
          nonNullable: true,
          validators: Validators.required,
        }),
      ]),
      experience: new FormArray([
        new FormGroup({
          title: new FormControl('', {
            validators: Validators.required,
            nonNullable: true,
          }),
          years: new FormControl(0, {
            validators: [Validators.required, Validators.min(1)],
            nonNullable: true,
          }),
        }),
      ]),
    });

    this.userFormControl('age')
      ?.valueChanges.pipe(
        tap((age) => {
          if (age ?? 0 >= 18) {
            this.userFormControl('email')?.addValidators([Validators.required]);
          } else {
            this.userFormControl('email')?.removeValidators([
              Validators.required,
            ]);
          }
          this.userFormControl('email')?.updateValueAndValidity();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  userFormControl(control: 'name' | 'age' | 'email' | 'skills' | 'experience') {
    return this.userForm.get(control);
  }
  skillsControl() {
    return <FormArray>this.userFormControl('skills');
  }

  addSkill() {
    this.skillsControl().push(new FormControl('', Validators.required));
  }
  removeSkill(i: number) {
    this.skillsControl().removeAt(i);
  }
  experienceControl() {
    return <FormArray>this.userFormControl('experience');
  }

  addExperience() {
    this.experienceControl().push(
      new FormGroup({
        title: new FormControl('', Validators.required),
        years: new FormControl(null, [Validators.required, Validators.min(1)]),
      }),
    );
  }
  removeExperience(i: number) {
    this.experienceControl().removeAt(i);
  }
  addUser() {
    if (this.userForm.valid) {
      const newUser = {
        ...this.userForm.value,
      } as User;
      this._user_service.addUserAction(newUser);
      this.actionCompleted$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((bool) => {
          if (bool) {
            this.dialogRef.close();
          }
        });
    }
  }
}
