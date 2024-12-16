import { Injectable } from '@angular/core';
import { StatusHomework } from '@interfaces/homework.entity';
import { HomeworkStatusBadge } from '@interfaces/homework-status-badge/homework-status-badge.interface';

@Injectable({
  providedIn: 'root'
})
export class HomeworkStatusService {
  private readonly statuses: {
    [key in StatusHomework | 'initial']: HomeworkStatusBadge
  } = {
    approved: {
      appearance: 'positive',
      text: 'Зачтено'
    },
    pending: {
      appearance: 'default',
      text: 'На проверке'
    },
    rejected: {
      appearance: 'error',
      text: 'Не зачтено'
    },
    initial: {
      appearance: 'info',
      text: 'Не выполнено'
    },
  }

  public getStatus(status: StatusHomework | 'initial'): HomeworkStatusBadge {
    return this.statuses[status];
  }
}
