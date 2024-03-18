import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCallPickupComponent } from './add-call-pickup.component';

describe('AddCallPickupComponent', () => {
  let component: AddCallPickupComponent;
  let fixture: ComponentFixture<AddCallPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCallPickupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCallPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
