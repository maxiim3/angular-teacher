import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RecipeV16Service } from '../../services/recipe-v16.service';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 16 — The Standalone Revolution (May 2023)           ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  WHAT CHANGED FROM v14:                                     ║
// ║                                                             ║
// ║  1. standalone: true  ← NO MORE NgModule                    ║
// ║     Component is self-contained. No more module file.       ║
// ║     imports[] moves into @Component decorator.              ║
// ║                                                             ║
// ║  2. inject() replaces constructor injection                  ║
// ║     No constructor needed for DI.                           ║
// ║                                                             ║
// ║  3. async pipe replaces subscribe/unsubscribe  ← KEY CHANGE ║
// ║     The BIGGEST improvement for list components.            ║
// ║                                                             ║
// ║     Before (v14):                                           ║
// ║       ngOnInit() { this.sub = service.recipes$.subscribe(   ║
// ║         recipes => this.recipes = recipes                   ║
// ║       )}                                                    ║
// ║       ngOnDestroy() { this.sub.unsubscribe() }              ║
// ║                                                             ║
// ║     After (v16):                                            ║
// ║       recipes$ = this.service.recipes$;                     ║
// ║       // Template: *ngFor="let r of recipes$ | async"       ║
// ║                                                             ║
// ║     Benefits:                                               ║
// ║     - No manual subscribe/unsubscribe                       ║
// ║     - No memory leak risk                                   ║
// ║     - No ngOnInit/ngOnDestroy lifecycle hooks                ║
// ║     - No mutable state — async pipe handles everything      ║
// ║     - Works perfectly with OnPush change detection           ║
// ║                                                             ║
// ║  WHAT STAYED THE SAME:                                      ║
// ║  • *ngFor/*ngIf structural directives                       ║
// ║  • CommonModule required for directives + async pipe        ║
// ║  • Observable-based data flow from service                  ║
// ║                                                             ║
// ║  Still painful:                                             ║
// ║  ✗ CommonModule still needed for *ngFor/*ngIf + async       ║
// ║  ✗ standalone: true must be set explicitly (default=false)  ║
// ║  ✗ async pipe adds | async boilerplate in templates         ║
// ║  ✗ trackBy is still optional (easy to forget)               ║
// ║                                                             ║
// ║  ✦ v18 replaces Observables with Signals — no async pipe    ║
// ╚══════════════════════════════════════════════════════════════╝

@Component({
  // ── standalone: true ──────────────────────────────────────────
  // NEW in v16! No NgModule needed. Compare:
  //   v14: RecipeListV14Module → declarations → RecipeListV14
  //   v16: Just this file. Done.
  standalone: true,
  selector: 'ui-recipe-list-v16',

  // ── imports in @Component ─────────────────────────────────────
  // CommonModule provides *ngFor, *ngIf, and the async pipe.
  // In v14, this was in the NgModule's imports[].
  // Now it's per-component — more explicit but still verbose.
  imports: [CommonModule],
  templateUrl: './recipe-list-v16.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeListV16 {

  // ── inject() ──────────────────────────────────────────────────
  // Replaces constructor(private service: RecipeV16Service)
  private recipeService = inject(RecipeV16Service);

  // ── Expose Observables directly ───────────────────────────────
  // No subscribe(), no mutable state, no lifecycle hooks.
  // The async pipe in the template handles everything:
  //   - Subscribes when component mounts
  //   - Unsubscribes when component destroys
  //   - Triggers change detection on new values
  //
  // Compare with v14:
  //   recipes: Recipe[] = [];
  //   ngOnInit() { this.sub = this.service.recipes$.subscribe(...) }
  //   ngOnDestroy() { this.sub.unsubscribe() }
  //
  // 3 properties + 2 lifecycle hooks → 2 field declarations. Done.
  recipes$ = this.recipeService.recipes$;
  favoriteCount$ = this.recipeService.favoriteCount$;

  toggleFavorite(id: number): void {
    this.recipeService.toggleFavorite(id);
  }
}
