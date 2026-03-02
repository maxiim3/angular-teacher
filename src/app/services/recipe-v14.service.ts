import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Recipe } from '../models/recipe';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 14 — The RxJS Baseline (June 2022)                  ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  THE BASELINE — State management IS RxJS in this era.       ║
// ║  BehaviorSubject is the de facto "store" for component      ║
// ║  state. Every service follows this pattern.                 ║
// ║                                                             ║
// ║  Architecture:                                              ║
// ║  ┌──────────────┐   subscribe()   ┌───────────────┐        ║
// ║  │ HttpClient   │───────────────▶│ BehaviorSubject │        ║
// ║  │ .get()       │                │ .next(data)     │        ║
// ║  └──────────────┘                └───────┬─────────┘        ║
// ║                                          │                  ║
// ║                              .asObservable()                ║
// ║                                          │                  ║
// ║                                  ┌───────▼─────────┐        ║
// ║                                  │ Component        │        ║
// ║                                  │ .subscribe()     │        ║
// ║                                  │ ngOnDestroy()    │        ║
// ║                                  └─────────────────┘        ║
// ║                                                             ║
// ║  Key characteristics:                                       ║
// ║  • BehaviorSubject<T> — holds current value + emits changes ║
// ║  • .asObservable() — hides .next() from consumers           ║
// ║  • .getValue() — synchronous read (often a code smell)      ║
// ║  • .next() — push new state                                 ║
// ║  • pipe(map()) — derived state via RxJS operators           ║
// ║  • Constructor injection — the only DI mechanism            ║
// ║                                                             ║
// ║  Pain points addressed by v16:                              ║
// ║  ✗ Constructor DI forces class-based patterns               ║
// ║                                                             ║
// ║  Pain points addressed by v18:                              ║
// ║  ✗ BehaviorSubject is verbose (Subject + Observable + next) ║
// ║  ✗ .getValue() breaks reactive flow (synchronous escape)    ║
// ║  ✗ pipe(map()) for simple derived state is overkill         ║
// ║  ✗ Consumers must subscribe() AND unsubscribe() manually    ║
// ╚══════════════════════════════════════════════════════════════╝

@Injectable({ providedIn: 'root' })
export class RecipeV14Service {

  // ── State ─────────────────────────────────────────────────────
  // BehaviorSubject: an RxJS Subject that holds a "current value".
  // It replays the last emitted value to new subscribers.
  // This is the de facto "signal" before signals existed.
  //
  // Why BehaviorSubject and not just Subject?
  //   Subject:         no initial value, late subscribers miss past emissions
  //   BehaviorSubject: has initial value, late subscribers get the current value
  private recipesSubject = new BehaviorSubject<Recipe[]>([]);

  // ── Public Observable ─────────────────────────────────────────
  // .asObservable() hides .next() from consumers.
  // Without this, any component could call recipesSubject.next([])
  // and corrupt the state. This is a manual encapsulation pattern.
  //
  // Compare with v18 signals:
  //   signal<Recipe[]>([]) → read-only by default via computed()
  recipes$: Observable<Recipe[]> = this.recipesSubject.asObservable();

  // ── Derived State ─────────────────────────────────────────────
  // pipe(map()) creates a derived Observable.
  // Every time recipes$ emits, this recalculates.
  //
  // Compare with v18:
  //   favoriteCount = computed(() => this.recipes().filter(...).length);
  //   One line, no pipe, no map import, automatic dependency tracking.
  favoriteCount$: Observable<number> = this.recipes$.pipe(
    map(recipes => recipes.filter(r => r.favorite).length)
  );

  // ── Dependency Injection ──────────────────────────────────────
  // Constructor injection: the ONLY way to get dependencies in v14.
  // Forces you into a class with a constructor.
  //
  // Compare with v16:
  //   private http = inject(HttpClient);
  constructor(private http: HttpClient) {
    this.loadRecipes();
  }

  // ── HTTP + subscribe() ────────────────────────────────────────
  // The classic pattern: HTTP call → subscribe → push to Subject.
  // This is verbose but explicit about the data flow.
  //
  // subscribe() returns a Subscription, but here we ignore it
  // because the service lives forever (providedIn: 'root').
  // In a component, you'd need to store it and call .unsubscribe().
  private loadRecipes(): void {
    this.http.get<Recipe[]>('/recipes.json').subscribe(recipes => {
      this.recipesSubject.next(recipes);
    });
  }

  // ── Mutations ─────────────────────────────────────────────────
  // .getValue() gives synchronous access to the current state.
  // This is often called a "code smell" in RxJS because it breaks
  // the reactive paradigm — but it's the only practical way to
  // do read-modify-write on BehaviorSubject.
  //
  // Compare with v18 signals:
  //   this.recipes.update(prev => prev.map(...))
  //   One line, no .getValue(), no .next()
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
