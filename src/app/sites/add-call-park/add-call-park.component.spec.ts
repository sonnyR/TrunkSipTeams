import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCallParkComponent } from './add-call-park.component';

describe('AddCallParkComponent', () => {
  let component: AddCallParkComponent;
  let fixture: ComponentFixture<AddCallParkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCallParkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCallParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
