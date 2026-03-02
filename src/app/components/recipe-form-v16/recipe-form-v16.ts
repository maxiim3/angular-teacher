import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Recipe } from '../../models/recipe';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 16 — The Standalone Revolution (May 2023)          ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  WHAT CHANGED FROM v14:                                     ║
// ║                                                             ║
// ║  1. standalone: true  ← BIGGEST CHANGE                     ║
// ║     Components no longer need an NgModule to exist.         ║
// ║     The recipe-form-v14.module.ts file? Gone.               ║
// ║     imports[] moves directly INTO the @Component decorator. ║
// ║                                                             ║
// ║     Before (v14):                                           ║
// ║       NgModule → declares component → imports CommonModule  ║
// ║     After (v16):                                            ║
// ║       Component → imports CommonModule directly             ║
// ║                                                             ║
// ║  2. inject() function  ← NEW DI MECHANISM                  ║
// ║     Replaces constructor injection. Can be used as a        ║
// ║     field initializer — no constructor needed.              ║
// ║     Enables functional patterns and composition via         ║
// ║     plain functions (not just classes).                     ║
// ║                                                             ║
// ║  3. Signals introduced (signal, computed, effect)           ║
// ║     First reactive primitive in Angular. Not yet used       ║
// ║     for forms, but lays the groundwork for v18+.            ║
// ║                                                             ║
// ║  WHAT STAYED THE SAME:                                      ║
// ║  • @Output() + EventEmitter (output() doesn't exist yet)   ║
// ║  • *ngIf/*ngFor structural directives + CommonModule        ║
// ║  • Reactive Forms with FormBuilder + Validators             ║
// ║                                                             ║
// ║  Still painful:                                             ║
// ║  ✗ CommonModule still needed for *ngIf/*ngFor               ║
// ║  ✗ @Output is verbose (decorator + EventEmitter combo)      ║
// ║  ✗ standalone: true must be explicitly set (default=false)  ║
// ╚══════════════════════════════════════════════════════════════╝

@Component({
  // ── standalone: true ────────────────────────────────────────
  // NEW in v16! This single flag eliminates the need for NgModule.
  // The component is self-contained: it declares its own imports.
  // But you MUST set it explicitly — default is still false.
  standalone: true,
  selector: 'ui-recipe-form-v16',

  // ── imports moved here ──────────────────────────────────────
  // In v14, these lived in the NgModule's imports[].
  // Now each component declares exactly what it needs.
  // More explicit, but CommonModule is still required for *ngIf.
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form-v16.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeFormV16 {

  // @Output still the norm — output() function arrives in v17/v18
  @Output() recipeAdded = new EventEmitter<Omit<Recipe, 'id' | 'favorite'>>();

  // ── inject() ────────────────────────────────────────────────
  // NEW in v16! Functional alternative to constructor injection.
  //
  // Before (v14):
  //   constructor(private fb: FormBuilder) { ... }
  //
  // After (v16):
  //   private fb = inject(FormBuilder);
  //
  // Why it matters:
  //   - No constructor needed → simpler classes
  //   - Works in plain functions (not just classes)
  //   - Enables functional guards, resolvers, interceptors
  //   - Better tree-shaking potential
  private fb = inject(FormBuilder);

  // fb.group() now returns FormGroup<{...}> with inferred types (v14.1+).
  // But .value still has optional fields: { title?: string | null, ... }
  // because controls can be disabled (disabled → excluded from .value).
  recipeForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    cookingTime: [0, [Validators.required, Validators.min(1)]],
  });

  submit(): void {
    if (this.recipeForm.valid) {
      // Type assertion needed: .value has optional fields due to Typed Forms
      this.recipeAdded.emit(this.recipeForm.value as Omit<Recipe, 'id' | 'favorite'>);
      this.recipeForm.reset({ title: '', description: '', cookingTime: 0 });
    }
  }
}
