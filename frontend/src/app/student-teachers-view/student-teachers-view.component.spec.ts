import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTeachersViewComponent } from './student-teachers-view.component';

describe('StudentTeachersViewComponent', () => {
  let component: StudentTeachersViewComponent;
  let fixture: ComponentFixture<StudentTeachersViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTeachersViewComponent]
    });
    fixture = TestBed.createComponent(StudentTeachersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
