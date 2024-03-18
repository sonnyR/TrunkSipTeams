import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCallsParkComponent } from './list-calls-park.component';

describe('ListCallsParkComponent', () => {
  let component: ListCallsParkComponent;
  let fixture: ComponentFixture<ListCallsParkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCallsParkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCallsParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
