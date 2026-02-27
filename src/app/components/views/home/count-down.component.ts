import { ChangeDetectionStrategy, Component, signal, effect } from '@angular/core';
import { HomeButton } from './ui-home-button.component';

@Component({
  selector: 'app-count-down',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HomeButton],
  template: `
    @if (this.countDown() > 0) {
      <p [class.opacity-50]="this.countDown() <= 0">Countdown: {{ countDown() }}</p>
    } @else {
      <ui-home-button (click)="this.countDown.set(10)">Start Countdown</ui-home-button>
    }
  `,
})
export class CountDownComponent {
  countDown = signal(10);

  constructor() {
    let intervalId: number;

    effect((onCleanup) => {
      intervalId = setInterval(() => {
        this.countDown.update((v: number) => v - 1);
      }, 1000);

      if (this.countDown() <= 0) {
        clearInterval(intervalId);
      }

      onCleanup(() => {
        clearInterval(intervalId);
      });
    });
  }
}
