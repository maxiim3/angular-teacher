import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeList } from '../../recipe-list/recipe-list';

@Component({
  selector: 'ui-home',
  imports: [RecipeList],
  templateUrl: './home.html',
})
export class Home {}
