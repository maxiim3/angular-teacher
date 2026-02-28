import { Component, inject } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'ui-recipe-list',
  imports: [],
  templateUrl: './recipe-list.html',
})
export class RecipeList {
  private recipeService = inject(RecipeService);
  recipes = this.recipeService.recipes.value;
  favoriteCount = this.recipeService.favoriteCount;
  toggleFavorite = (id: number) => this.recipeService.toggleFavorite(id);
}
