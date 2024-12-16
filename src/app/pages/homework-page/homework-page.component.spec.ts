import { TestBed, ComponentFixture } from '@angular/core/testing';
import {
  NormalizedHomeworkEntity,
  StatusHomework,
} from '@interfaces/homework.entity';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { HomeworksService } from '@services/homeworks/homeworks.service';
import { of } from 'rxjs';

import { HomeworkPageComponent } from './homework-page.component';

describe('HomeworkPageComponent', () => {
  let component: HomeworkPageComponent;
  let fixture: ComponentFixture<HomeworkPageComponent>;
  let homeworkServiceMock: jest.Mocked<HomeworksService>;
  let currentUserServiceMock: jest.Mocked<CurrentUserService>;

  beforeEach(async () => {
    const mockHomeworks: NormalizedHomeworkEntity[] = [
      {
        uid: '1',
        taskId: 'task1',
        userId: 'user1',
        teacherId: 'teacher1',
        dateSubmitted: '2024-01-01',
        answerLink: 'http://example.com/answer',
        comment: 'Good job',
        review: 'Excellent',
        status: 'pending',
        userName: 'Student A',
        teacherName: 'Teacher A',
        taskName: 'Math Homework',
      },
      {
        uid: '2',
        taskId: 'task2',
        userId: 'user2',
        teacherId: 'teacher2',
        dateSubmitted: '2024-01-02',
        answerLink: 'http://example.com/answer2',
        comment: 'Needs improvement',
        review: 'Fair',
        status: 'approved',
        userName: 'Student B',
        teacherName: 'Teacher B',
        taskName: 'Science Homework',
      },
      {
        uid: '3',
        taskId: 'task2',
        userId: 'user2',
        teacherId: 'teacher2',
        dateSubmitted: '2024-01-02',
        answerLink: 'http://example.com/answer2',
        comment: 'Needs improvement',
        review: 'Fair',
        status: 'rejected',
        userName: 'Student B',
        teacherName: 'Teacher B',
        taskName: 'Science Homework',
      },
    ];

    homeworkServiceMock = {
      getNormalizedHomeworks: jest.fn().mockReturnValue(of(mockHomeworks)),
      filterByStatus: jest.fn((status: StatusHomework) =>
        of(mockHomeworks.filter((hw) => hw.status === status))
      ),
    } as unknown as jest.Mocked<HomeworksService>;

    currentUserServiceMock = {
      getCurrentUser: jest.fn((role: string) => of({ role: role })),
    } as unknown as jest.Mocked<CurrentUserService>;

    await TestBed.configureTestingModule({
      imports: [HomeworkPageComponent],
      providers: [
        { provide: HomeworksService, useValue: homeworkServiceMock },
        { provide: CurrentUserService, useValue: currentUserServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeworkPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set teacher view when role is teacher', () => {
    expect(component.isTeacher()).toBe(false);
  });
  it('setFilteredHomeworks should call filterByStatus with the correct status', () => {
    const status = 'pending';
    component.setFilteredHomeworks(status);
    expect(homeworkServiceMock.filterByStatus).toHaveBeenCalledWith(status);
  });

  it('setFilteredHomeworks should update homeworks$ with filtered data', () => {
    const status = 'pending';
    const filteredHomeworks = [
      {
        uid: '2',
        taskId: 'task2',
        userId: 'user2',
        teacherId: 'teacher2',
        dateSubmitted: '2024-01-02',
        answerLink: 'http://example.com/answer2',
        comment: 'Needs improvement',
        review: 'Fair',
        status: 'pending',
        userName: 'Student B',
        teacherName: 'Teacher B',
        taskName: 'Science Homework',
      },
    ];

    component.setFilteredHomeworks(status);
    component.homeworks$.subscribe((homeworks) => {
      expect(homeworks).toEqual(filteredHomeworks);
    });
  });
  it('get all homeworks', () => {
    const mockHomeworks: NormalizedHomeworkEntity[] = [
      {
        uid: '1',
        taskId: 'task1',
        userId: 'user1',
        teacherId: 'teacher1',
        dateSubmitted: '2024-01-01',
        answerLink: 'http://example.com/answer',
        comment: 'Good job',
        review: 'Excellent',
        status: 'pending',
        userName: 'Student A',
        teacherName: 'Teacher A',
        taskName: 'Math Homework',
      },
      {
        uid: '2',
        taskId: 'task2',
        userId: 'user2',
        teacherId: 'teacher2',
        dateSubmitted: '2024-01-02',
        answerLink: 'http://example.com/answer2',
        comment: 'Needs improvement',
        review: 'Fair',
        status: 'approved',
        userName: 'Student B',
        teacherName: 'Teacher B',
        taskName: 'Science Homework',
      },
      {
        uid: '3',
        taskId: 'task2',
        userId: 'user2',
        teacherId: 'teacher2',
        dateSubmitted: '2024-01-02',
        answerLink: 'http://example.com/answer2',
        comment: 'Needs improvement',
        review: 'Fair',
        status: 'rejected',
        userName: 'Student B',
        teacherName: 'Teacher B',
        taskName: 'Science Homework',
      },
    ];
    component.getHomeworks();
    component.homeworks$.subscribe((homeworks) => {
      expect(homeworks).toEqual(mockHomeworks);
    });
  });

  it('if current user role teacher show techer component', () => {
    currentUserServiceMock.getCurrentUser().subscribe(() => {
      expect(component.isTeacher()).toBe(true);
    });
  });

  it('if current user role not teacher hide teacher component', () => {
    currentUserServiceMock.getCurrentUser().subscribe(() => {
      expect(component.isTeacher()).toBe(true);
    });
  });
});
