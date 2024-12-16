import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesService } from '@services/courses/courses.service';
import { of } from 'rxjs';

import { CoursesPageComponent } from './courses-page.component';

describe('CoursesPageComponent', () => {
  let component: CoursesPageComponent;
  let fixture: ComponentFixture<CoursesPageComponent>;
  let mockCoursesService: jest.Mocked<CoursesService>;

  beforeEach(async () => {
    mockCoursesService = {
      getAllCoursesAndCurrentUser: jest.fn().mockReturnValue(of(undefined))
    } as unknown as jest.Mocked<CoursesService>;


    await TestBed.configureTestingModule({
      imports: [CoursesPageComponent],
      providers: [
        { provide: CoursesService, useValue: mockCoursesService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CoursesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
