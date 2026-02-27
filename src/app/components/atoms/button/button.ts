import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ui-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  label = input<string>('I am a button');
  value = 'odoud'
  onClick = output<MouseEvent>();
}
