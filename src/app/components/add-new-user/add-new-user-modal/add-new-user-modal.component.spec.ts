import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewUserModalComponent } from './add-new-user-modal.component';

describe('AddNewUserModalComponent', () => {
  let component: AddNewUserModalComponent;
  let fixture: ComponentFixture<AddNewUserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewUserModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
