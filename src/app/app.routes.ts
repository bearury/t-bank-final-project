import { Route } from '@angular/router';
import { adminRouteGuard } from '@guards/admin-route.guard';
import { adminTeacherRouteGuard } from '@guards/admin-teacher-route.guard';
import { courseContentRouteGuard } from '@guards/course-content-route.guard';
import { unauthorizedRouterGuard } from '@guards/unauthorized-router.guard';
import { userTeacherGuard } from '@guards/user-teacher-route.guard';
import { AuthPageComponent } from '@pages/auth-page/auth-page.component';
import { CourseCreateEditPageComponent } from '@pages/course-create-edit-page/course-create-edit-page.component';
import { CoursePageComponent } from '@pages/course-page/course-page.component';
import { CoursesPageComponent } from '@pages/courses-page/courses-page.component';
import { FinishSignupComponent } from '@pages/finish-signup/finish-signup.component';
import { HomeworkPageComponent } from '@pages/homework-page/homework-page.component';
import { MainPageComponent } from '@pages/main-page/main-page.component';
import { NotFoundComponent } from '@pages/not-found/not-found.component';
import { ProfilePageComponent } from '@pages/profile-page/profile-page.component';
import { TeacherComponent } from '@pages/teacher-page/teacher.component';
import { TeachersPageComponent } from '@pages/teachers-page/teachers-page.component';
import { UpdateHomeworkPageComponent } from '@pages/update-homework-page/update-homework-page.component';
import { UsersPageComponent } from '@pages/users-page/users-page.component';

import { ProfileLayoutComponent } from './shared/layout/profile-layout/profile-layout.component';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: AuthPageComponent,
  },
  {
    path: 'signup',
    component: AuthPageComponent,
  },
  {
    path: 'finish-signup',
    component: FinishSignupComponent,
  },

  {
    path: 'profile',
    component: ProfileLayoutComponent,
    canActivate: [unauthorizedRouterGuard],
    children: [
      {
        path: 'homework',
        component: HomeworkPageComponent,
        canActivate: [userTeacherGuard],
      },
      { path: '', component: ProfilePageComponent },
    ],
  },
  {
    path: 'profile/homework/task/:id/:id1',
    component: UpdateHomeworkPageComponent,
    canActivate: [userTeacherGuard],
  },

  {
    path: 'teachers',
    component: TeachersPageComponent,
    children: [
      {
        path: ':id',
        component: TeacherComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: UsersPageComponent,
    canActivate: [adminRouteGuard],
  },
  {
    path: 'courses',
    children: [
      {
        path: 'create',
        component: CourseCreateEditPageComponent,
        canActivate: [adminRouteGuard],
      },
      {
        path: ':id',
        children: [
          {
            path: 'edit',
            loadComponent: () =>
              import(
                '@pages/course-create-edit-page/course-create-edit-page.component'
              ).then((m) => m.CourseCreateEditPageComponent),
            canActivate: [adminTeacherRouteGuard],
          },
          {
            path: 'lesson',
            children: [
              {
                path: 'create',
                loadComponent: () =>
                  import(
                    '@pages/lesson-create-edit-page/lesson-create-edit-page.component'
                  ).then((m) => m.LessonCreateEditPageComponent),
                canActivate: [adminTeacherRouteGuard],
              },
              {
                path: ':lessonId',
                children: [
                  {
                    path: 'edit',
                    loadComponent: () =>
                      import(
                        '@pages/lesson-create-edit-page/lesson-create-edit-page.component'
                      ).then((m) => m.LessonCreateEditPageComponent),
                    canActivate: [adminTeacherRouteGuard],
                  },
                  {
                    path: '',
                    loadComponent: () =>
                      import('@pages/lesson-page/lesson-page.component').then(
                        (m) => m.LessonPageComponent
                      ),
                    canActivate: [courseContentRouteGuard],
                  },
                ],
              },
            ],
          },
          {
            path: 'task',
            children: [
              {
                path: 'create',
                loadComponent: () =>
                  import(
                    '@pages/task-create-edit-page/task-create-edit-page.component'
                  ).then((m) => m.TaskCreateEditPageComponent),
                canActivate: [adminTeacherRouteGuard],
              },
              {
                path: ':taskId',
                children: [
                  {
                    path: 'edit',
                    loadComponent: () =>
                      import(
                        '@pages/task-create-edit-page/task-create-edit-page.component'
                      ).then((m) => m.TaskCreateEditPageComponent),
                    canActivate: [adminTeacherRouteGuard],
                  },
                  {
                    path: '',
                    loadComponent: () =>
                      import('@pages/task-page/task-page.component').then(
                        (m) => m.TaskPageComponent
                      ),
                    canActivate: [courseContentRouteGuard],
                  },
                ],
              },
            ],
          },
          {
            path: '',
            component: CoursePageComponent,
          },
        ],
      },
      {
        path: '',
        component: CoursesPageComponent,
      },
    ],
  },
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: '**',
    // redirectTo: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
];
