import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Counter } from './ui-counter.component';
import { HomeButton } from './ui-home-button.component';
import { CountDownComponent } from './count-down.component';
import { RecipeList } from '../../recipe-list/recipe-list';

@Component({
  selector: 'ui-home',
  imports: [HomeButton, Counter, CountDownComponent, RecipeList],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
