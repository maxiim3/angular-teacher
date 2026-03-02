import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RecipeV18Service } from '../../services/recipe-v18.service';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 18 — Signals + @for/@if (May 2024)                  ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  WHAT CHANGED FROM v16:                                     ║
// ║                                                             ║
// ║  1. Signals replace Observables in the component             ║
// ║                                                             ║
// ║     Before (v16):                                           ║
// ║       recipes$ = this.service.recipes$;  // Observable      ║
// ║       // Template: *ngFor="let r of recipes$ | async"       ║
// ║                                                             ║
// ║     After (v18):                                            ║
// ║       recipes = this.service.recipes;  // Signal            ║
// ║       // Template: @for (r of recipes(); track r.id)        ║
// ║                                                             ║
// ║     Why it's better:                                        ║
// ║     - No async pipe — signals are synchronous reads         ║
// ║     - No Subscription management (was already handled by    ║
// ║       async pipe in v16, but now there's NO pipe at all)    ║
// ║     - No CommonModule import needed                         ║
// ║     - Signal reads are functions: recipes() not recipes     ║
// ║                                                             ║
// ║  2. @for/@if replace *ngFor/*ngIf                           ║
// ║     Built into the template engine. No imports needed.      ║
// ║     @for REQUIRES track — can't forget it (compile error).  ║
// ║     @empty built-in — no separate *ngIf for empty state.    ║
// ║                                                             ║
// ║  3. No CommonModule!                                        ║
// ║     @for/@if are built-in. imports: [] is EMPTY.            ║
// ║     Compare: v14 needed CommonModule in NgModule,           ║
// ║              v16 needed CommonModule in @Component.imports. ║
// ║                                                             ║
// ║  WHAT STAYED THE SAME:                                      ║
// ║  • standalone: true (still explicit, default=false)         ║
// ║  • inject() for DI                                          ║
// ║  • OnPush change detection                                  ║
// ║                                                             ║
// ║  Still painful:                                             ║
// ║  ✗ standalone: true must be set on every component          ║
// ║                                                             ║
// ║  ✦ v20 makes standalone the DEFAULT (no flag needed)        ║
// ╚══════════════════════════════════════════════════════════════╝

@Component({
  standalone: true, // v18: still must be set explicitly
  selector: 'ui-recipe-list-v18',

  // ── imports: EMPTY ────────────────────────────────────────────
  // No CommonModule! @for/@if are built into the template engine.
  // Compare:
  //   v14: CommonModule in NgModule
  //   v16: CommonModule in @Component.imports
  //   v18: Nothing. Zero imports for a list component.
  imports: [],
  templateUrl: './recipe-list-v18.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeListV18 {

  private recipeService = inject(RecipeV18Service);

  // ── Signals exposed directly ──────────────────────────────────
  // The service exposes signal() and computed().
  // The component just references them — no transformation needed.
  //
  // In the template, read via function call: recipes(), favoriteCount()
  //
  // Compare the evolution:
  //   v14: recipes: Recipe[] = []  (mutable, set via subscribe)
  //   v16: recipes$ = Observable   (async pipe in template)
  //   v18: recipes = Signal        (call in template: recipes())
  //
  // No subscribe. No async pipe. No lifecycle hooks.
  // The component is now FOUR lines of real code.
  recipes = this.recipeService.recipes;
  favoriteCount = this.recipeService.favoriteCount;

  toggleFavorite(id: number): void {
    this.recipeService.toggleFavorite(id);
  }
}
