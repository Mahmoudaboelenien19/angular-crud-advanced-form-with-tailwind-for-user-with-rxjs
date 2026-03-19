import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormControl,
  AbstractControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { fadeInOut } from '../../../animations/fade-in/fade-in';

@Component({
  selector: 'shared-input',
  templateUrl: './input.component.html',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  animations: [fadeInOut],
})
export class SharedInputComponent {
  @Input() label = '';
  @Input() type = 'text';
  @Input() control: FormControl | AbstractControl = new FormControl();
  @Input() errorMessages: { [key: string]: string } = {}; // optional custom messages
  get formControl(): FormControl {
    if (!(this.control instanceof FormControl)) {
      throw new Error(
        'AppInputComponent requires a FormControl, but received a different type.',
      );
    }
    return this.control;
  }
  // Helper to get error message for first active error
  get errorMessage(): string | null {
    if (!this.control || !this.control.errors || !this.control.touched) {
      return null;
    }
    const firstError = Object.keys(this.control.errors)[0];
    if (!firstError) return null;
    const error = this.control.errors[firstError];
    let message = this.errorMessages[firstError];
    // Replace placeholders like {{requiredLength}} with actual values
    if (message && error) {
      Object.keys(error).forEach((key) => {
        message = message.replace(`{{${key}}}`, error[key]);
      });
    }
    return message || 'Invalid value';
  }
}
