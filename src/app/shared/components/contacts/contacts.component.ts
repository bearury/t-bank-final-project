import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, TuiIcon],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsComponent {
  @Input() public backgroundColor = 'var(--app-bg-light)';
  @Input() public color = 'var(--app-txt-primary)';
}
