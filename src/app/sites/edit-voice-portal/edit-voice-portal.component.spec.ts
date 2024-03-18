import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVoicePortalComponent } from './edit-voice-portal.component';

describe('EditVoicePortalComponent', () => {
  let component: EditVoicePortalComponent;
  let fixture: ComponentFixture<EditVoicePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVoicePortalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVoicePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
