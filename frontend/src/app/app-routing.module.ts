import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { IndexComponent } from './index/index.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { RegisterTeacherComponent } from './register-teacher/register-teacher.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login.component';
import { UnregisteredComponent } from './unregistered/unregistered.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { StudentTeachersViewComponent } from './student-teachers-view/student-teachers-view.component';
import { TeacherByClass } from './models/teacherByClass';
import { TeacherInfoComponent } from './teacher-info/teacher-info.component';
import { StudentTutionsComponent } from './student-tutions/student-tutions.component';
import { TeacherProfileComponent } from './teacher-profile/teacher-profile.component';
import { TeacherTutionsComponent } from './teacher-tutions/teacher-tutions.component';
import { TeacherStudentsListComponent } from './teacher-students-list/teacher-students-list.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'mainpage', component: MainpageComponent },
  { path: 'registerTeacher', component: RegisterTeacherComponent },
  { path: 'changePassword', component: ChangePasswordComponent },
  { path: 'login', component: LoginComponent },
  { path: 'unregistered', component: UnregisteredComponent },
  { path: 'studentProfile', component: StudentProfileComponent },
  { path: 'studentTeachersView', component: StudentTeachersViewComponent },
  { path: 'teacherInfo/:username', component: TeacherInfoComponent },
  { path: 'studentTutions', component: StudentTutionsComponent },
  { path: 'teacherProfile', component: TeacherProfileComponent },
  { path: 'teacherTutions', component: TeacherTutionsComponent },
  { path: 'teacherStudentsList', component: TeacherStudentsListComponent },
  { path: 'admin', component: AdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
