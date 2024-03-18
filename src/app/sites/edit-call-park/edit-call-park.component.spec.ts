import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCallParkComponent } from './edit-call-park.component';

describe('EditCallParkComponent', () => {
  let component: EditCallParkComponent;
  let fixture: ComponentFixture<EditCallParkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCallParkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCallParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
