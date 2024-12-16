import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import {
  NormalizedHomeworkEntity,
  StatusHomework,
} from '@interfaces/homework.entity';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { TasksFiestoreService } from '@services/fire-storage/tasks-firestore.service';
import { HomeworksService } from '@services/homeworks/homeworks.service';
import { of } from 'rxjs';

import { UpdateHomeworkPageComponent } from './update-homework-page.component';

describe('UpdateHomeworkPageComponent', () => {
  let component: UpdateHomeworkPageComponent;
  let fixture: ComponentFixture<UpdateHomeworkPageComponent>;
  let homeworkServiceMock: jest.Mocked<HomeworksService>;
  let taskServiceMock: jest.Mocked<TasksFiestoreService>;
  let currentUserServiceMock: jest.Mocked<CurrentUserService>;
  let activatedRouteMock: jest.Mocked<ActivatedRoute>;

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

    activatedRouteMock = {
      snapshot: {
        params: { id: '123' }, // Пример данных из snapshot
        queryParams: { someQuery: 'value' }, // Пример query-параметра
      },
      paramMap: of({
        get: (key: string) => (key === 'id' ? '123' : null),
      }), // Мок для paramMap
      params: of({ id: '123' }), // params теперь - это Observable
    } as unknown as jest.Mocked<ActivatedRoute>;

    currentUserServiceMock = {
      getCurrentUser: jest.fn((role: string) => of({ role: role })),
    } as unknown as jest.Mocked<CurrentUserService>;

    homeworkServiceMock = {
      getNormalizedHomeworks: jest.fn().mockReturnValue(of(mockHomeworks)),
      filterByStatus: jest.fn((status: StatusHomework) =>
        of(mockHomeworks.filter((hw) => hw.status === status))
      ),
    } as unknown as jest.Mocked<HomeworksService>;

    taskServiceMock = {
      getTaskById: jest.fn(),
    } as unknown as jest.Mocked<TasksFiestoreService>;

    await TestBed.configureTestingModule({
      imports: [UpdateHomeworkPageComponent],
      providers: [
        { provide: HomeworksService, useValue: homeworkServiceMock },
        { provide: TasksFiestoreService, useValue: taskServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: CurrentUserService, useValue: currentUserServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateHomeworkPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    activatedRouteMock.params.pipe().subscribe();
    expect(component).toBeTruthy();
  });
  it('should get homework ID from route params', () => {
    // Проверка, что параметр `id` из маршрута передается в компонент
    activatedRouteMock.params = of({ id: '123', id1: '456' });
    component.ngOnInit();
    expect(component.homeworkId).toBe('456');
  });

  it('should call getTaskById with the correct id', () => {
    const taskServiceSpy = jest.spyOn(taskServiceMock, 'getTaskById');
    activatedRouteMock.params = of({ id: '123', id1: '456' });
    component.ngOnInit(); // Инициализация компонента
    expect(taskServiceSpy).toHaveBeenCalledWith('123');
  });

  it('should call getTaskById and set task$', () => {
    const mockTask = {
      uid: '1223',
      name: 'task1',
      description: 'блабла',
      courseId: '123131',
      deadline: 'newer',
    };
    taskServiceMock.getTaskById.mockReturnValue(of(mockTask));

    activatedRouteMock.params = of({ id: '123', id1: '456' });
    component.ngOnInit();

    expect(taskServiceMock.getTaskById).toHaveBeenCalledWith('123');
  });
});
