import { TestBed } from '@angular/core/testing';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';
import { CoursesService } from '@services/courses/courses.service';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { of } from 'rxjs';


describe('CoursesService', () => {
  let service: CoursesService;
  let coursesFirestoreService: jest.Mocked<CoursesFirestoreService>;
  let currentUserService: jest.Mocked<CurrentUserService>;

  beforeEach(() => {
    coursesFirestoreService = {
      getAll: jest.fn()
    } as unknown as jest.Mocked<CoursesFirestoreService>;

    currentUserService = {
      getCurrentUser: jest.fn()
    } as unknown as jest.Mocked<CurrentUserService>;

    TestBed.configureTestingModule({
      providers: [
        CoursesService,
        { provide: CoursesFirestoreService, useValue: coursesFirestoreService },
        { provide: CurrentUserService, useValue: currentUserService }
      ]
    });

    service = TestBed.inject(CoursesService);
  });

  it('should retrieve all courses and current user', () => {
    const mockCourses: CourseEntity[] = [
      { uid: '1', status: 'assigned' } as CourseEntity,
      { uid: '2', status: 'unassigned' } as CourseEntity,
      { uid: '3', status: 'assigned' } as CourseEntity
    ];
    const mockUser: UserEntity = { uid: 'user1', role: 'user' } as UserEntity;


    coursesFirestoreService.getAll.mockReturnValue(of(mockCourses));
    currentUserService.getCurrentUser.mockReturnValue(of(mockUser));

    service.getAllCoursesAndCurrentUser().subscribe(result => {
      expect(result.courses.length).toBe(2);
    });
  });
});
