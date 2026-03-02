import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Recipe } from '../../models/recipe';
import { RecipeV14Service } from '../../services/recipe-v14.service';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 14 — The NgModule Era (June 2022)                   ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  THE BASELINE — How components consumed data before signals.║
// ║                                                             ║
// ║  Data flow:                                                 ║
// ║  ┌──────────────┐                                           ║
// ║  │ Service      │                                           ║
// ║  │ recipes$     │── Observable<Recipe[]> ──┐                 ║
// ║  │ faveCount$   │── Observable<number> ──┐ │                 ║
// ║  └──────────────┘                        │ │                 ║
// ║                                          ▼ ▼                 ║
// ║  ┌──────────────────────────────────────────┐               ║
// ║  │ Component                                 │               ║
// ║  │ ngOnInit()   → .subscribe() to each      │               ║
// ║  │ recipes: Recipe[] = []  (mutable!)       │               ║
// ║  │ ngOnDestroy() → .unsubscribe() each      │               ║
// ║  └──────────────────────────────────────────┘               ║
// ║                                                             ║
// ║  Key characteristics:                                       ║
// ║  • NgModule required — see recipe-list-v14.module.ts        ║
// ║  • Constructor injection — the only DI mechanism            ║
// ║  • subscribe() in ngOnInit — manual subscription            ║
// ║  • unsubscribe() in ngOnDestroy — MUST do or memory leak    ║
// ║  • Mutable class properties — recipes: Recipe[] = []        ║
// ║  • *ngFor/*ngIf — structural directives from CommonModule   ║
// ║  • trackBy function — optional performance optimization     ║
// ║                                                             ║
// ║  Pain points addressed by v16:                              ║
// ║  ✗ NgModule boilerplate (extra file, declarations array)    ║
// ║  ✗ Constructor DI forces class-based patterns               ║
// ║  ✗ subscribe/unsubscribe ceremony — easy to leak memory     ║
// ║                                                             ║
// ║  Pain points addressed by v18:                              ║
// ║  ✗ *ngFor requires CommonModule import                      ║
// ║  ✗ trackBy is optional — easy to forget → perf bugs         ║
// ║  ✗ Mutable state — component holds stale copies             ║
// ╚══════════════════════════════════════════════════════════════╝

@Component({
  standalone: false, // Angular 14: components MUST belong to an NgModule
  selector: 'ui-recipe-list-v14',
  templateUrl: './recipe-list-v14.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeListV14 implements OnInit, OnDestroy {

  // ── Mutable State ─────────────────────────────────────────────
  // The component holds its own copy of the data.
  // This is a MUTABLE array — it gets reassigned on each emission.
  // Compare with v18 signals: recipes = this.service.recipes;
  // (no local copy, no mutation, always in sync)
  recipes: Recipe[] = [];
  favoriteCount = 0;

  // ── Subscriptions ─────────────────────────────────────────────
  // Must store subscriptions to clean up in ngOnDestroy.
  // Forgetting to unsubscribe → memory leak, ghost updates,
  // and the dreaded "ExpressionChangedAfterItHasBeenChecked" error.
  //
  // Common patterns to avoid this:
  //   1. Manual unsubscribe (shown here)
  //   2. takeUntil(destroy$) pattern
  //   3. async pipe in template (v16 approach)
  //   4. Signals (v18+ — no subscriptions at all)
  private subscriptions: Subscription[] = [];

  // ── Constructor Injection ─────────────────────────────────────
  // The ONLY DI mechanism in v14.
  // Compare with v16: private service = inject(RecipeV16Service);
  constructor(private recipeService: RecipeV14Service) {}

  // ── Lifecycle: subscribe ──────────────────────────────────────
  // ngOnInit is the standard place to set up subscriptions.
  // Each .subscribe() returns a Subscription that must be stored.
  ngOnInit(): void {
    this.subscriptions.push(
      this.recipeService.recipes$.subscribe(recipes => {
        this.recipes = recipes;
      }),
      this.recipeService.favoriteCount$.subscribe(count => {
        this.favoriteCount = count;
      })
    );
  }

  // ── Lifecycle: unsubscribe ────────────────────────────────────
  // CRITICAL: forgetting this causes memory leaks.
  // Every tutorial warns about it. Every developer forgets it.
  // This entire lifecycle dance disappears with signals (v18+).
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ── trackBy ───────────────────────────────────────────────────
  // Optional performance optimization for *ngFor.
  // Without it, Angular re-renders ALL items when the array changes.
  // With it, Angular only re-renders items whose identity changed.
  //
  // In v18, @for REQUIRES track — you can't forget it.
  trackByRecipeId(_index: number, recipe: Recipe): number {
    return recipe.id;
  }

  toggleFavorite(id: number): void {
    this.recipeService.toggleFavorite(id);
  }
}
