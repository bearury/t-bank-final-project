import { InputSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { CourseEntity } from '@interfaces/course.entity';
import { UserEntity } from '@interfaces/user.entity';

import { CardCourseComponent } from './card-course.component';

describe('CardCourseComponent', () => {
  let component: CardCourseComponent;
  let fixture: ComponentFixture<CardCourseComponent>;

  beforeEach(async () => {
    const activatedRouteStub = {
      snapshot: { params: {} }
    };

    await TestBed.configureTestingModule({
      imports: [CardCourseComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CardCourseComponent);
    component = fixture.componentInstance;

    const mockCourse: CourseEntity = { uid: 'course1', name: 'Course 1' } as CourseEntity;
    const mockUser: UserEntity = { uid: 'course1', name: 'Course 1' } as UserEntity;

    component.course = signal(mockCourse) as unknown as InputSignal<CourseEntity>;
    component.currentUser = signal(mockUser) as unknown as InputSignal<UserEntity | null>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

