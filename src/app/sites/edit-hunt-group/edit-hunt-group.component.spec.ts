import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHuntGroupComponent } from './edit-hunt-group.component';

describe('EditHuntGroupComponent', () => {
  let component: EditHuntGroupComponent;
  let fixture: ComponentFixture<EditHuntGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditHuntGroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditHuntGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
