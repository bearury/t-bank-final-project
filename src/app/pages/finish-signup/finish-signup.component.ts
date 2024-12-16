import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFirestoreService } from '@services/fire-storage/auth-firestore.service';

@Component({
  selector: 'app-finish-signup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finish-signup.component.html',
  styleUrl: './finish-signup.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinishSignupComponent implements OnInit {
  constructor(
    private authService: AuthFirestoreService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    const email = window.localStorage.getItem('emailForSignIn');

    if (email) {
      this.authService.confirmSignIn(email).subscribe();
      this.router.navigate(['/']);
    }
  }
}
