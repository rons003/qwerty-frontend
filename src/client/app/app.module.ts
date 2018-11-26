import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AccountModule } from './account/account.module';

import { AboutModule } from './about/about.module';
import { HomeModule } from './home/home.module';
import { CoreModule } from './core/core.module';

import { WelcomeModule } from './welcome/welcome.module';
import { SuperDashboardModule } from './dashboard/superadmin/super-dashboard.module';
import { ModulesModule } from './modules/modules.module';
import { SectionsModule } from './sections/sections.module';
import { SchoolsModule } from './schools/schools.module';
import { SchoolAdminModule } from './dashboard/schooladmin/school-admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PasswordModule } from './password/password.module';

import { TeacherModule } from './roles/teacher/teacher.module';
import { GroupsModule } from './groups/groups.module';
import { ProjectsModule } from './projects/projects.module';
import { ChaptersModule } from './modules/chapters/chapters.module';
import { ChallengesModule } from './challenges/challenges.module';
import { SharedModule } from './shared/shared.module';
import { Ng5BreadcrumbModule } from 'ng5-breadcrumb';


@NgModule({
  imports: [
    BrowserModule,
    CoreModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    AboutModule,
    HomeModule,
    WelcomeModule,
    DashboardModule,
    SuperDashboardModule,
    ModulesModule,
    SchoolAdminModule,
    TeacherModule,
    GroupsModule,
    ProjectsModule,
    PasswordModule,
    ChaptersModule,
    ChallengesModule,
    AccountModule,
    SectionsModule,
    SchoolsModule,
    Ng5BreadcrumbModule.forRoot(),
    SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [{
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }],
  bootstrap: [AppComponent]

})
export class AppModule { }
