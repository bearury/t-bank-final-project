import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TuiIconPipe } from '@taiga-ui/core';

@Component({
  selector: 'app-owl-image',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TuiIconPipe],
  templateUrl: './owl-image.component.html',
  styleUrl: './owl-image.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OwlImageComponent {
  public readonly image = 'owl.png';
  public title = input.required<string>();
}
