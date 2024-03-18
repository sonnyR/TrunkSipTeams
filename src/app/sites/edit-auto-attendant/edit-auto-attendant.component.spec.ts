import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAutoAttendantComponent } from './edit-auto-attendant.component';

describe('EditAutoAttendantComponent', () => {
  let component: EditAutoAttendantComponent;
  let fixture: ComponentFixture<EditAutoAttendantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAutoAttendantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAutoAttendantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
