import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Recipe } from '../models/recipe';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 16 — inject() Swap (May 2023)                       ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  WHAT CHANGED FROM v14:                                     ║
// ║                                                             ║
// ║  1. inject() function  ← NEW DI MECHANISM                  ║
// ║     Replaces constructor injection. Can be used as a        ║
// ║     field initializer — no constructor needed.              ║
// ║                                                             ║
// ║     Before (v14):                                           ║
// ║       constructor(private http: HttpClient) {               ║
// ║         this.loadRecipes();                                 ║
// ║       }                                                     ║
// ║                                                             ║
// ║     After (v16):                                            ║
// ║       private http = inject(HttpClient);                    ║
// ║       constructor() { this.loadRecipes(); }                 ║
// ║                                                             ║
// ║     Why it matters for services:                            ║
// ║     - Enables functional patterns (functional guards, etc.) ║
// ║     - Dependencies visible as class fields, not constructor ║
// ║     - Easier to test: no need to match constructor signature║
// ║                                                             ║
// ║  2. Signals introduced (but NOT used here)                  ║
// ║     Signals exist in v16, but the community hadn't yet      ║
// ║     adopted them for service state. BehaviorSubject was     ║
// ║     still the dominant pattern.                             ║
// ║                                                             ║
// ║  WHAT STAYED THE SAME:                                      ║
// ║  • BehaviorSubject for state                                ║
// ║  • .asObservable() for encapsulation                        ║
// ║  • .getValue() + .next() for mutations                      ║
// ║  • pipe(map()) for derived state                            ║
// ║  • subscribe() for HTTP                                     ║
// ║                                                             ║
// ║  Still painful:                                             ║
// ║  ✗ BehaviorSubject verbosity (same as v14)                  ║
// ║  ✗ .getValue() breaks reactive flow (same as v14)           ║
// ║  ✗ Manual subscribe/unsubscribe in consumers (same as v14)  ║
// ║                                                             ║
// ║  ✦ v18 will replace ALL of this with signal()               ║
// ╚══════════════════════════════════════════════════════════════╝

@Injectable({ providedIn: 'root' })
export class RecipeV16Service {

  // ── inject() ──────────────────────────────────────────────────
  // NEW in v16! Functional alternative to constructor injection.
  //
  // Before (v14):
  //   constructor(private http: HttpClient) { ... }
  //
  // After (v16):
  //   private http = inject(HttpClient);
  //
  // inject() can ONLY be called in an "injection context":
  //   - Field initializers (like here)
  //   - Constructor body
  //   - Factory functions passed to providers
  // Calling it inside a method or setTimeout → runtime error.
  private http = inject(HttpClient);

  // ── State — identical to v14 ──────────────────────────────────
  // BehaviorSubject is still the standard. Signals exist in v16
  // but were too new for most teams to adopt in services.
  private recipesSubject = new BehaviorSubject<Recipe[]>([]);
  recipes$: Observable<Recipe[]> = this.recipesSubject.asObservable();

  favoriteCount$: Observable<number> = this.recipes$.pipe(
    map(recipes => recipes.filter(r => r.favorite).length)
  );

  // Constructor still needed for initialization logic,
  // but no longer carries DI parameters.
  constructor() {
    this.loadRecipes();
  }

  private loadRecipes(): void {
    this.http.get<Recipe[]>('/recipes.json').subscribe(recipes => {
      this.recipesSubject.next(recipes);
    });
  }

  // ── Mutations — identical to v14 ──────────────────────────────
  // .getValue() + .next() pattern unchanged.
  // The only difference in this entire file is `inject(HttpClient)`
  // vs `constructor(private http: HttpClient)`.
  toggleFavorite(id: number): void {
    const updated = this.recipesSubject.getValue().map(r =>
      r.id === id ? { ...r, favorite: !r.favorite } : r
    );
    this.recipesSubject.next(updated);
  }

  addRecipe(recipe: Omit<Recipe, 'id' | 'favorite'>): void {
    const current = this.recipesSubject.getValue();
    const newRecipe: Recipe = { ...recipe, id: Date.now(), favorite: false };
    this.recipesSubject.next([...current, newRecipe]);
  }

  deleteRecipe(id: number): void {
    const filtered = this.recipesSubject.getValue().filter(r => r.id !== id);
    this.recipesSubject.next(filtered);
  }
}
