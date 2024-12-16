import { InputSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TaskEntity } from '@interfaces/task.entity';

import { TaskUnitComponent } from './task-unit.component';

describe('TaskUnitComponent', () => {
  let component: TaskUnitComponent;
  let fixture: ComponentFixture<TaskUnitComponent>;

  const titleText = 'Task 1';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskUnitComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskUnitComponent);
    component = fixture.componentInstance;


    const mockTask: TaskEntity = { uid: '1', name: titleText } as TaskEntity;
    component.task = signal(mockTask) as unknown as InputSignal<TaskEntity>;
    component.index = signal(1) as unknown as InputSignal<number>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task title', () => {
    const titleElement = fixture.debugElement.query(By.css('.title')).nativeElement;

    expect(titleElement.textContent).toContain(titleText);
  });
});
