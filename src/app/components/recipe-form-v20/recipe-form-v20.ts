import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Recipe } from '../../models/recipe';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 20 — Standalone by Default (May 2025)              ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  WHAT CHANGED FROM v18:                                     ║
// ║                                                             ║
// ║  1. standalone: true IS THE DEFAULT  ← NO MORE BOILERPLATE  ║
// ║     You no longer write standalone: true. It just works.    ║
// ║     Setting standalone: false is now the explicit opt-out.  ║
// ║                                                             ║
// ║     v14: standalone didn't exist (NgModule mandatory)       ║
// ║     v16: standalone: true (opt-in, explicit)                ║
// ║     v18: standalone: true (opt-in, explicit)                ║
// ║     v20: standalone: true (DEFAULT — don't write it!)       ║
// ║                                                             ║
// ║  2. fb.nonNullable.group()  ← BETTER TYPED FORMS           ║
// ║     Returns controls that can't be null after reset.        ║
// ║     .getRawValue() returns the full type without optionals. ║
// ║                                                             ║
// ║     Before (v18):                                           ║
// ║       this.fb.group({...})                                  ║
// ║       .value → { title?: string | null, ... }  // optional! ║
// ║       need `as T` type assertion                            ║
// ║                                                             ║
// ║     After (v20):                                            ║
// ║       this.fb.nonNullable.group({...})                      ║
// ║       .getRawValue() → { title: string, ... }  // exact!   ║
// ║       no assertion needed                                   ║
// ║                                                             ║
// ║  3. Matured ecosystem                                       ║
// ║     • Deferrable views (@defer) for lazy loading             ║
// ║     • Zoneless change detection (experimental)              ║
// ║     • Signal-based inputs/outputs are the standard          ║
// ║     • NgModules effectively deprecated for new code         ║
// ║                                                             ║
// ║  WHAT STAYED THE SAME:                                      ║
// ║  • Reactive Forms (FormBuilder + Validators)                ║
// ║  • inject() for DI                                          ║
// ║  • output() for events                                      ║
// ║  • @if/@for control flow                                    ║
// ║                                                             ║
// ║  What's NEXT (v21):                                         ║
// ║  ✦ Signal-based forms — form(), FormField                   ║
// ║  ✦ Validators as functions: required(), min(), minLength()  ║
// ║  ✦ signal() as the form data model (no more FormBuilder)    ║
// ║  ✦ See recipe-form/ for the v21 implementation              ║
// ╚══════════════════════════════════════════════════════════════╝

@Component({
  // ── standalone is DEFAULT ───────────────────────────────────
  // No standalone: true needed. This is the cleanest @Component
  // decorator in Angular history. Compare with v14's separate
  // module file + declarations array.
  selector: 'ui-recipe-form-v20',
  imports: [ReactiveFormsModule],
  templateUrl: './recipe-form-v20.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeFormV20 {
  recipeAdded = output<Omit<Recipe, 'id' | 'favorite'>>();

  private fb = inject(FormBuilder);

  // ── nonNullable FormBuilder ─────────────────────────────────
  // fb.nonNullable.group() ensures controls reset to their
  // initial values, not null. This means:
  //   - .reset() brings fields back to '' and 0 (not null)
  //   - .getRawValue() returns { title: string } (not string | null)
  //   - No more type assertions needed
  //
  // This is the LAST evolution of Reactive Forms before v21
  // replaces the entire paradigm with signal-based forms.
  recipeForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    cookingTime: [0, [Validators.required, Validators.min(1)]],
  });

  submit(): void {
    if (this.recipeForm.valid) {
      // getRawValue() → fully typed, no assertion needed
      this.recipeAdded.emit(this.recipeForm.getRawValue());
      this.recipeForm.reset(); // resets to initial values, not null
    }
  }
}
