import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CurrentUserService } from '@services/current-user/current-user.service';
import { of } from 'rxjs';

import { ProfileLayoutComponent } from './profile-layout.component';

describe('ProfileLayoutComponent', () => {
  let component: ProfileLayoutComponent;
  let fixture: ComponentFixture<ProfileLayoutComponent>;
  let currentUserServiceMock: jest.Mocked<CurrentUserService>;
  let activatedRouteMock: jest.Mocked<ActivatedRoute>;
  beforeEach(async () => {
    currentUserServiceMock = {
      getCurrentUser: jest.fn((role: string) => of({ role: role })),
    } as unknown as jest.Mocked<CurrentUserService>;

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
    await TestBed.configureTestingModule({
      imports: [ProfileLayoutComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: CurrentUserService, useValue: currentUserServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCurrentUser', () => {
    expect(currentUserServiceMock.getCurrentUser).toHaveBeenCalled();
  });

  it('if cuurent user is user', () => {
    currentUserServiceMock.getCurrentUser.mockReturnValueOnce(
      of({
        uid: '12345',
        email: 'user@example.com',
        avatar: 'https://example.com/avatar.jpg',
        name: 'John',
        surname: 'Doe',
        phone: '+1234567890',
        role: 'user',
        courses: ['Math', 'Science', 'History'],
        description: 'A passionate learner and teacher.',
      })
    );
    expect(component.isAdmin()).toBe(false);
  });

  it('if cuurent user is admin', () => {
    currentUserServiceMock.getCurrentUser.mockReturnValueOnce(
      of({
        uid: '12345',
        email: 'user@example.com',
        avatar: 'https://example.com/avatar.jpg',
        name: 'John',
        surname: 'Doe',
        phone: '+1234567890',
        role: 'admin',
        courses: ['Math', 'Science', 'History'],
        description: 'A passionate learner and teacher.',
      })
    );
    expect(component.isAdmin()).toBe(false);
  });
});
