import { Injectable } from '@angular/core';
import * as Sentry from '@sentry/browser';
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  public trackEvent(label: string): void {
    Sentry.captureMessage(`Action: ${label}`, {
      level: 'info',
    });
  }

  public logError(error: Error): void {
    Sentry.captureException(error);
  }
}
