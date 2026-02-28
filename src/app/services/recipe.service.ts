import { Injectable, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Recipe } from '../models/recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  recipes = httpResource<Recipe[]>(() => '/recipes.json', { defaultValue: [] });

  favoriteCount = computed(() => this.recipes.value().filter((r) => r.favorite).length);

  toggleFavorite(id: number) {
    this.recipes.value.update((prev) =>
      prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)),
    );
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'favorite'>) {
    const id = Date.now();
    const newRecipe = { ...recipe, id, favorite: false };
    this.recipes.value.update((prev) => [...prev, newRecipe]);
  }

  deleteRecipe(id: number) {
    this.recipes.value.update((prev) => prev.filter((r) => r.id !== id));
  }
}
