import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RecipeV20Service } from '../../services/recipe-v20.service';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 20 — Standalone by Default (May 2025)               ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  WHAT CHANGED FROM v18:                                     ║
// ║                                                             ║
// ║  1. standalone IS THE DEFAULT  ← NO MORE BOILERPLATE         ║
// ║     You no longer write standalone: true. It just works.    ║
// ║                                                             ║
// ║     v14: standalone didn't exist (NgModule mandatory)       ║
// ║     v16: standalone: true (opt-in, explicit)                ║
// ║     v18: standalone: true (opt-in, explicit)                ║
// ║     v20: standalone: true (DEFAULT — don't write it!)       ║
// ║                                                             ║
// ║  The @Component decorator is now minimal. Compare:          ║
// ║                                                             ║
// ║     v14 (component + module file):                          ║
// ║       @NgModule({ declarations: [...], imports: [...] })    ║
// ║       @Component({ standalone: false, ... })                ║
// ║                                                             ║
// ║     v20 (single file, no flags):                            ║
// ║       @Component({ selector: '...', imports: [] })          ║
// ║                                                             ║
// ║  WHAT STAYED THE SAME (everything else):                    ║
// ║  • signal() for state (from v18)                            ║
// ║  • computed() for derived state (from v18)                  ║
// ║  • @for/@if template syntax (from v18)                      ║
// ║  • inject() for DI (from v16)                               ║
// ║                                                             ║
// ║  The component code is IDENTICAL to v18.                    ║
// ║  The only diff is the absence of standalone: true.          ║
// ║                                                             ║
// ║  What's NEXT (v21):                                         ║
// ║  ✦ httpResource() — HTTP requests as signals                ║
// ║  ✦ See recipe-list/ for the v21 implementation              ║
// ╚══════════════════════════════════════════════════════════════╝

@Component({
  // ── standalone is DEFAULT ─────────────────────────────────────
  // No standalone: true. Compare with v18's explicit flag.
  // This is the cleanest @Component decorator in Angular history.
  selector: 'ui-recipe-list-v20',
  imports: [],
  templateUrl: './recipe-list-v20.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeListV20 {

  private recipeService = inject(RecipeV20Service);

  // ── Identical to v18 ──────────────────────────────────────────
  // Signals, inject(), no lifecycle hooks, no subscribe.
  // The component reached its final form in v18.
  // v20 just removed the standalone: true noise.
  recipes = this.recipeService.recipes;
  favoriteCount = this.recipeService.favoriteCount;

  toggleFavorite(id: number): void {
    this.recipeService.toggleFavorite(id);
  }
}
