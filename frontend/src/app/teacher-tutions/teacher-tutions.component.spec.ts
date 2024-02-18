import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherTutionsComponent } from './teacher-tutions.component';

describe('TeacherTutionsComponent', () => {
  let component: TeacherTutionsComponent;
  let fixture: ComponentFixture<TeacherTutionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherTutionsComponent]
    });
    fixture = TestBed.createComponent(TeacherTutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
