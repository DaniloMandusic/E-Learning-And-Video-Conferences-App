import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTutionsComponent } from './student-tutions.component';

describe('StudentTutionsComponent', () => {
  let component: StudentTutionsComponent;
  let fixture: ComponentFixture<StudentTutionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTutionsComponent]
    });
    fixture = TestBed.createComponent(StudentTutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
