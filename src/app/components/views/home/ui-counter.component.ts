import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HomeButton } from './ui-home-button.component';

@Component({
  selector: 'ui-counter',
  imports: [HomeButton],
  template: `
    <div class="flex items-center justify-center">
      <ui-home-button (click)="increment()">Increment</ui-home-button>
      <p class="ml-4 text-lg font-bold">{{ count() }}</p>
    </div>
  `,
})
export class Counter {
  private readonly _count = signal(0);
  readonly count = this._count.asReadonly();
  private readonly router = inject(Router);
  private readonly initialUrl: string;

  constructor() {
    this.initialUrl = this.router.url;
    this._count.set(parseInt(window.localStorage.getItem(this.initialUrl) || '0', 10));
  }

  ngOnDestroy() {
    console.log('Counter destroyed, saving to:', this.initialUrl);
    window.localStorage.setItem(this.initialUrl, this._count().toString());
  }

  increment() {
    this._count.update((c) => c + 1);
  }
}
