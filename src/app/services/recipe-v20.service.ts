import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 20 — Signal Maturity (May 2025)                     ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  WHAT CHANGED FROM v18:                                     ║
// ║                                                             ║
// ║  Almost nothing in the service layer!                       ║
// ║  Signals were introduced in v18 and didn't change much.     ║
// ║  The v18→v20 evolution happened in:                         ║
// ║  • Components (standalone default, no explicit flag)        ║
// ║  • Forms (nonNullable.group(), typed .controls access)      ║
// ║  • Ecosystem (zoneless experimental, deferrable views)      ║
// ║                                                             ║
// ║  For services, v20 IS v18 — the signal API stabilized.      ║
// ║                                                             ║
// ║  This is actually a GOOD THING:                             ║
// ║  It means the signal API was well-designed from the start.  ║
// ║  No breaking changes, no migration headaches.               ║
// ║                                                             ║
// ║  WHAT STAYED THE SAME (everything):                         ║
// ║  • signal() for state                                       ║
// ║  • computed() for derived state                             ║
// ║  • .update() for mutations                                  ║
// ║  • inject() for DI                                          ║
// ║  • subscribe() bridge for HTTP                              ║
// ║                                                             ║
// ║  Still painful:                                             ║
// ║  ✗ HTTP still needs subscribe() to bridge Observable→Signal ║
// ║  ✗ No way to make HTTP itself a signal                      ║
// ║                                                             ║
// ║  What's NEXT (v21):                                         ║
// ║  ✦ httpResource() — HTTP requests as signals                ║
// ║  ✦ No subscribe, no bridge, no manual push                  ║
// ║  ✦ .value is a WritableSignal — update() works on it        ║
// ║  ✦ See recipe.service.ts for the v21 implementation         ║
// ╚══════════════════════════════════════════════════════════════╝

@Injectable({ providedIn: 'root' })
export class RecipeV20Service {

  private http = inject(HttpClient);

  // ── Identical to v18 ──────────────────────────────────────────
  // signal(), computed(), .update() — all unchanged.
  // The signal API was stable from v18 through v20.
  recipes = signal<Recipe[]>([]);

  favoriteCount = computed(() =>
    this.recipes().filter(r => r.favorite).length
  );

  constructor() {
    this.loadRecipes();
  }

  // ── Still the Observable→Signal bridge ────────────────────────
  // This is the LAST version that needs this pattern.
  // v21's httpResource() eliminates subscribe() entirely:
  //
  //   recipes = httpResource<Recipe[]>(() => '/recipes.json');
  //   // .value is already a WritableSignal<Recipe[]>
  //   // No subscribe, no loadRecipes(), no constructor init
  private loadRecipes(): void {
    this.http.get<Recipe[]>('/recipes.json').subscribe(recipes => {
      this.recipes.set(recipes);
    });
  }

  // ── Mutations — identical to v18 ──────────────────────────────
  toggleFavorite(id: number): void {
    this.recipes.update(prev =>
      prev.map(r => r.id === id ? { ...r, favorite: !r.favorite } : r)
    );
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'favorite'>): void {
    const newRecipe: Recipe = { ...recipe, id: Date.now(), favorite: false };
    this.recipes.update(prev => [...prev, newRecipe]);
  }

  deleteRecipe(id: number): void {
    this.recipes.update(prev => prev.filter(r => r.id !== id));
  }
}
