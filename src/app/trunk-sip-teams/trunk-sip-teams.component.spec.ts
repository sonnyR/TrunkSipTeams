import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrunkSipTeamsComponent } from './trunk-sip-teams.component';

describe('TrunkSipTeamsComponent', () => {
  let component: TrunkSipTeamsComponent;
  let fixture: ComponentFixture<TrunkSipTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrunkSipTeamsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrunkSipTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
