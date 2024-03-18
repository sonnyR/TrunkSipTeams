import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCallQueueComponent } from './edit-call-queue.component';

describe('EditCallQueueComponent', () => {
  let component: EditCallQueueComponent;
  let fixture: ComponentFixture<EditCallQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCallQueueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCallQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
