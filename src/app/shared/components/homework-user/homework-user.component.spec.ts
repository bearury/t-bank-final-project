import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeworkUserComponent } from './homework-user.component';

describe('HomeworkUserComponent', () => {
  let component: HomeworkUserComponent;
  let fixture: ComponentFixture<HomeworkUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeworkUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeworkUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
