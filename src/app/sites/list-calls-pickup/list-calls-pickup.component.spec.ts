import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCallsPickupComponent } from './list-calls-pickup.component';

describe('ListCallsPickupComponent', () => {
  let component: ListCallsPickupComponent;
  let fixture: ComponentFixture<ListCallsPickupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCallsPickupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCallsPickupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
