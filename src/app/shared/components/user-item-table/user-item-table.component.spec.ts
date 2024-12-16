import { InputSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';

import { UserItemTableComponent } from './user-item-table.component';

describe('UserItemTableComponent', () => {
  let component: UserItemTableComponent;
  let fixture: ComponentFixture<UserItemTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserItemTableComponent],
      providers: [
        { provide: Auth, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserItemTableComponent);
    component = fixture.componentInstance;


    const mockUser: UserEntity = { uid: 'course1', name: 'Jack', avatar: '' } as UserEntity;
    const mockCourses: CourseEntity[] = [{ uid: 'course1', name: 'Course 1' }] as CourseEntity[];

    component.item = signal(mockUser) as unknown as InputSignal<UserEntity>;
    component.courses = signal(mockCourses) as unknown as InputSignal<CourseEntity[]>;
    component.loadingChangeRole = signal<boolean>(false);


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
