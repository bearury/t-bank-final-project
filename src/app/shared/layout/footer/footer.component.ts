import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactsComponent } from '@components/contacts/contacts.component';

import { BACKGROUND_COLOR_DARK, TXT_COLOR_LIGHT } from '../../consts/layout-theme.const';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, ContactsComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected contactsBackgroundColor = BACKGROUND_COLOR_DARK;
  protected contactsColor = TXT_COLOR_LIGHT;
}
