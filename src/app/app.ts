import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Button } from './components/atoms/button/button';
import { Text } from './components/atoms/text/text';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Button, Text, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ng-playground');
  textValue: string = 'coucou';

  handler(event: MouseEvent) {
    console.log(event);
  }
}
