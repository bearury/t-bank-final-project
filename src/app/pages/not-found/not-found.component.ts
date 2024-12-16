import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OwlImageComponent } from '@components/owl-image/owl-image.component';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, TuiButton, OwlImageComponent, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {
}
