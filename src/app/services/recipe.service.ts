import { Injectable, signal, computed } from '@angular/core';

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
  recipes = signal<Recipe[]>([
    {
      id: 1,
      title: 'Crêpes',
      description: 'Classic French crêpes',
      cookingTime: 20,
      favorite: true
    },
    {
      id: 2,
      title: 'Crêpes',
      description: 'Classic French crêpes',
      cookingTime: 20,
      favorite: true
    }
  ])
  favoriteCount = computed(() => this.recipes().filter(r => r.favorite).length)

  toggleFavorite(id: number) {
    this.recipes.update(recipes => recipes.map(r => r.id === id ? {...r, favorite: !r.favorite }: r))
  }
}
