import { Injectable, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';

interface Recipe {
  id: number
  title: string
  description: string
  cookingTime: number // in minutes
  favorite: boolean
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipes = httpResource<Recipe[]>(() => '/recipes.json', {defaultValue: []})

  favoriteCount = computed(() => this.recipes.value().filter(r => r.favorite).length)
  toggleFavorite = (id: number) => this.recipes.value.update((prev) => prev.map(r => r.id === id ? {...r, favorite: !r.favorite} : r))
}
