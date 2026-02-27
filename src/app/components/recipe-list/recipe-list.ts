import { Component, computed, signal } from '@angular/core';

interface Recipe {
  id: number
  title: string
  description: string
  cookingTime: number // in minute
  favorite: boolean
}

@Component({
  selector: 'ui-recipe-list',
  imports: [],
  templateUrl: './recipe-list.html'
})
export class RecipeList {
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
