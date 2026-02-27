import { Component } from '@angular/core';

@Component({
  selector: 'ui-text',
  imports: [],
  templateUrl: './text.html',
  styleUrl: './text.css',
})
export class Text {
  text: string = '';

  updateText(newText: string) {
    this.text = newText
  }
}
