import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../models/recipe';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 18 — The Signal Revolution (May 2024)               ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  WHAT CHANGED FROM v16:                                     ║
// ║                                                             ║
// ║  1. signal() replaces BehaviorSubject  ← BIGGEST CHANGE     ║
// ║     Angular's own reactive primitive replaces RxJS for       ║
// ║     synchronous state management.                           ║
// ║                                                             ║
// ║     Before (v16):                                           ║
// ║       private recipesSubject = new BehaviorSubject<T>([]);  ║
// ║       recipes$ = this.recipesSubject.asObservable();         ║
// ║                                                             ║
// ║     After (v18):                                            ║
// ║       recipes = signal<T>([]);                               ║
// ║                                                             ║
// ║     Why it's better:                                        ║
// ║     - 1 line replaces 2 (no Subject + Observable split)     ║
// ║     - Read-only by default (consumers call recipes())       ║
// ║     - No .asObservable() encapsulation needed               ║
// ║     - Glitch-free: computed() auto-tracks dependencies      ║
// ║                                                             ║
// ║  2. computed() replaces pipe(map())                          ║
// ║                                                             ║
// ║     Before (v16):                                           ║
// ║       favoriteCount$ = this.recipes$.pipe(                  ║
// ║         map(recipes => recipes.filter(...).length)           ║
// ║       );                                                    ║
// ║                                                             ║
// ║     After (v18):                                            ║
// ║       favoriteCount = computed(() =>                         ║
// ║         this.recipes().filter(...).length                    ║
// ║       );                                                    ║
// ║                                                             ║
// ║     Benefits:                                               ║
// ║     - No RxJS operator imports needed                       ║
// ║     - Automatic dependency tracking (no explicit pipe chain)║
// ║     - Memoized: only recalculates when dependencies change  ║
// ║     - Synchronous read: favoriteCount() returns a number    ║
// ║                                                             ║
// ║  3. .update() replaces .getValue() + .next()                 ║
// ║                                                             ║
// ║     Before (v16):                                           ║
// ║       const current = this.subject.getValue();              ║
// ║       this.subject.next([...current, newItem]);              ║
// ║                                                             ║
// ║     After (v18):                                            ║
// ║       this.recipes.update(prev => [...prev, newItem]);      ║
// ║                                                             ║
// ║  WHAT STAYED THE SAME:                                      ║
// ║  • inject() for DI                                          ║
// ║  • HttpClient.get().subscribe() for HTTP calls              ║
// ║  • providedIn: 'root' for singleton services                ║
// ║                                                             ║
// ║  Still painful:                                             ║
// ║  ✗ HTTP still needs subscribe() to bridge Observable→Signal ║
// ║  ✗ No httpResource yet — must manually push to signal       ║
// ║                                                             ║
// ║  ✦ v21 introduces httpResource() — HTTP IS a signal         ║
// ╚══════════════════════════════════════════════════════════════╝

@Injectable({ providedIn: 'root' })
export class RecipeV18Service {

  private http = inject(HttpClient);

  // ── signal() replaces BehaviorSubject ─────────────────────────
  // signal<T>(initialValue) creates a writable reactive primitive.
  //
  //   Read:   this.recipes()          — returns Recipe[]
  //   Write:  this.recipes.set([...]) — replaces the value
  //   Update: this.recipes.update(fn) — transforms based on previous
  //
  // Compare with BehaviorSubject:
  //   Read:   this.subject.getValue()   — synchronous escape hatch
  //   Write:  this.subject.next([...])  — push new value
  //   No .update() — must read + transform + push manually
  //
  // Signals are read-only when exposed via computed() or directly.
  // No need for .asObservable() encapsulation pattern.
  recipes = signal<Recipe[]>([]);

  // ── computed() replaces pipe(map()) ───────────────────────────
  // Automatic dependency tracking: Angular knows this depends on
  // this.recipes() because it's called inside computed().
  //
  // Memoized: if recipes hasn't changed, favoriteCount won't
  // recalculate. BehaviorSubject + pipe(map()) recalculates on
  // every emission, even if the result is the same.
  favoriteCount = computed(() =>
    this.recipes().filter(r => r.favorite).length
  );

  constructor() {
    this.loadRecipes();
  }

  // ── HTTP → Signal bridge ──────────────────────────────────────
  // Still need subscribe() to push Observable data into a signal.
  // This is the "bridge" pattern: Observable world → Signal world.
  //
  // In v21, httpResource() eliminates this entirely:
  //   recipes = httpResource<Recipe[]>(() => '/recipes.json');
  //   No subscribe, no bridge, no manual push.
  private loadRecipes(): void {
    this.http.get<Recipe[]>('/recipes.json').subscribe(recipes => {
      this.recipes.set(recipes);
    });
  }

  // ── Mutations with .update() ──────────────────────────────────
  // .update(fn) replaces the .getValue() + .next() pattern.
  // One line instead of two. The callback receives the previous
  // value, returns the new value. Immutable by convention.
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
