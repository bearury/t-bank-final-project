import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';
import { UsersPageComponent } from '@pages/users-page/users-page.component';
import { CoursesFirestoreService } from '@services/fire-storage/courses-firestore.service';
import { UsersFirestoreService } from '@services/fire-storage/users-firestore.service';
import { of } from 'rxjs';

import { RoleItems } from '../../shared/models/role-items.model';


describe('UsersPageComponent', () => {
  let component: UsersPageComponent;
  let fixture: ComponentFixture<UsersPageComponent>;
  let coursesServiceMock: jest.Mocked<CoursesFirestoreService>;
  let usersFirestoreServiceMock: jest.Mocked<UsersFirestoreService>;


  beforeEach(async () => {
    coursesServiceMock = {
      getAll: jest.fn().mockReturnValue(of(undefined))
    } as unknown as jest.Mocked<CoursesFirestoreService>;

    usersFirestoreServiceMock = {
      getAllUser: jest.fn().mockReturnValue(of(undefined)),
      updateUserRole: jest.fn().mockReturnValue(of(undefined))
    } as unknown as jest.Mocked<UsersFirestoreService>;


    await TestBed.configureTestingModule({
      imports: [UsersPageComponent, ReactiveFormsModule, RouterModule.forRoot([{
        path: '',
        component: UsersPageComponent
      }])],
      providers: [
        { provide: CoursesFirestoreService, useValue: coursesServiceMock },
        { provide: UsersFirestoreService, useValue: usersFirestoreServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize users', () => {
    const mockUsers: UserEntity[] = [{ uid: 1, name: 'John Doe' } as unknown as UserEntity];

    usersFirestoreServiceMock.getAllUser.mockReturnValue(of(mockUsers));
    component.ngOnInit();

    expect(component.users()).toEqual(mockUsers);
  });


  it('should initialize courses', () => {
    const mockCourses: CourseEntity[] = [{ uid: 1, name: 'Course A' } as unknown as CourseEntity];

    coursesServiceMock.getAll.mockReturnValue(of(mockCourses));
    component.ngOnInit();

    expect(component.courses()).toEqual(mockCourses);
  });

  it('should loading status in true', () => {
    const mockUsers: UserEntity[] = [{ uid: 1, name: 'John Doe' } as unknown as UserEntity];

    usersFirestoreServiceMock.getAllUser.mockReturnValue(of(mockUsers));
    component.ngOnInit();

    expect(component.loadingUsers()).toBeTruthy();
  });

  it('should update user role', () => {
    const mockUid = '1';
    const mockRole = { name: 'admin', color: 'red', title: 'Администратор' } as RoleItems;
    usersFirestoreServiceMock.updateUserRole.mockReturnValue(of(undefined));

    component.onSelectRole({ uid: mockUid, roleItem: mockRole });

    expect(usersFirestoreServiceMock.updateUserRole).toHaveBeenCalledWith({
      uid: mockUid,
      role: mockRole
    });
  });

});
