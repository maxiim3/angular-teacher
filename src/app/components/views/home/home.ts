import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeList } from '../../recipe-list/recipe-list';
import { RecipeForm } from '../../recipe-form/recipe-form';

@Component({
  selector: 'ui-home',
  imports: [RecipeList, RecipeForm],
  templateUrl: './home.html',
})
export class Home {}
