import { InputSignal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwlImageComponent } from './owl-image.component';

describe('OwlImageComponent', () => {
  let component: OwlImageComponent;
  let fixture: ComponentFixture<OwlImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwlImageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OwlImageComponent);
    component = fixture.componentInstance;

    const mockTitle = 'Test Title';
    component.title = signal(mockTitle) as unknown as InputSignal<string>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
