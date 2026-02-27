import { Component } from '@angular/core';

@Component({
  selector: 'ui-home-button',
  imports: [],
  template: `
    <button
      (click)="onClick($event)"
      class="bg-slate-100 hover:bg-slate-200 rounded-md px-4 py-2 text-sm font-medium text-gray-700"
    >
      <ng-content />
    </button>
  `,
})
export class HomeButton {
  onClick(event: MouseEvent) {
    console.log('HomeButton clicked', event);
  }
}
