import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '@services/courses-service/courses-service';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { of } from 'rxjs';

import { CoursePageComponent } from './course-page.component';

describe('CoursePageComponent', () => {
  let component: CoursePageComponent;
  let fixture: ComponentFixture<CoursePageComponent>;

  let mockCurrentUserService: jest.Mocked<CurrentUserService>;
  let mockCoursesService: jest.Mocked<CoursesService>;
  let mockUsersFirestoreService: jest.Mocked<UsersFirestoreService>;
  let mockRouter: { navigate: jest.Mock };


  const activatedRouteStub = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('123')
      }
    }
  };


  beforeEach(async () => {
    mockCurrentUserService = {
      getCurrentUser: jest.fn().mockReturnValue(of(undefined))
    } as unknown as jest.Mocked<CurrentUserService>;

    mockCoursesService = {
      getCourseTasksLessons: jest.fn().mockReturnValue(of(undefined))
    } as unknown as jest.Mocked<CoursesService>;

    mockUsersFirestoreService = {
      addCourse: jest.fn().mockReturnValue(of(undefined)),
      removeCourse: jest.fn().mockReturnValue(of(undefined))
    } as unknown as jest.Mocked<UsersFirestoreService>;

    mockRouter = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [CoursePageComponent],
      providers: [
        { provide: CurrentUserService, useValue: mockCurrentUserService },
        { provide: CoursesService, useValue: mockCoursesService },
        { provide: UsersFirestoreService, useValue: mockUsersFirestoreService },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(CoursePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to task page when task is clicked', () => {
    const taskId = '123';

    component.handleClickTask(taskId);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/courses/undefined/task/' + taskId]);
  });
});
