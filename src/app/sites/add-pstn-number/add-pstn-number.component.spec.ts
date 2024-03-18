import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPstnNumberComponent } from './add-pstn-number.component';

describe('AddPstnNumberComponent', () => {
  let component: AddPstnNumberComponent;
  let fixture: ComponentFixture<AddPstnNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPstnNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPstnNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
