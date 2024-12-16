import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StatisticsUnits } from '../../types/statistics-units.type';

@Component({
  selector: 'app-statistics-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-card.component.html',
  styleUrl: './statistics-card.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsCardComponent {
  @Input({required: true}) public value!: number;

  @Input({required: true}) 
  public set units(units: StatisticsUnits) {
    this.unitsMapping = {
      '=1': this.declensions[units][0],
      '=2': this.declensions[units][1],
      '=3': this.declensions[units][1],
      '=4': this.declensions[units][1],
      'other': this.declensions[units][2],
    }
  };

  private readonly declensions: Record<StatisticsUnits, string[]> = {
    course: ['курс', 'курса', 'курсов'],
    teacher: ['преподаватель', 'преподавателя', 'преподавателей'],
    student: ['ученик', 'ученика', 'учеников']
  };

  protected unitsMapping: { [k: string]: string } = {};
}
