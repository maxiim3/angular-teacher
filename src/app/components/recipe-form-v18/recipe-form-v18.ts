import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Recipe } from '../../models/recipe';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 18 — The Template DX Leap (May 2024)               ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  WHAT CHANGED FROM v16:                                     ║
// ║                                                             ║
// ║  1. @if / @for / @switch  ← TEMPLATE REVOLUTION             ║
// ║     Built-in control flow replaces structural directives.   ║
// ║     No import needed — they're part of the template engine. ║
// ║                                                             ║
// ║     Before (v16):                                           ║
// ║       imports: [CommonModule]  ← needed for *ngIf/*ngFor    ║
// ║       <div *ngIf="condition">...</div>                      ║
// ║                                                             ║
// ║     After (v18):                                            ║
// ║       // No CommonModule needed!                            ║
// ║       @if (condition) { <div>...</div> }                    ║
// ║                                                             ║
// ║     Why it matters:                                         ║
// ║     - Smaller bundles (no CommonModule + directive code)     ║
// ║     - Better type narrowing inside blocks                   ║
// ║     - @for requires track — prevents performance bugs       ║
// ║     - @empty block built-in (no more *ngIf + else template) ║
// ║                                                             ║
// ║  2. output() function  ← REPLACES @Output DECORATOR         ║
// ║     Functional API, consistent with inject().               ║
// ║                                                             ║
// ║     Before (v16):                                           ║
// ║       @Output() recipeAdded = new EventEmitter<T>();        ║
// ║                                                             ║
// ║     After (v18):                                            ║
// ║       recipeAdded = output<T>();                             ║
// ║                                                             ║
// ║     Benefits:                                               ║
// ║     - No EventEmitter (no accidental .subscribe() on it)    ║
// ║     - No decorator (consistent with input(), model())       ║
// ║     - Type-safe by default                                  ║
// ║                                                             ║
// ║  3. input() function (not shown here — no @Input in form)   ║
// ║     Same pattern: replaces @Input() decorator.              ║
// ║     Returns a Signal<T>, making inputs reactive.            ║
// ║                                                             ║
// ║  WHAT STAYED THE SAME:                                      ║
// ║  • standalone: true (still explicit, default=false)         ║
// ║  • Reactive Forms with FormBuilder + Validators             ║
// ║  • inject() for DI                                          ║
// ║                                                             ║
// ║  Still painful:                                             ║
// ║  ✗ standalone: true must be set on every component          ║
// ║  ✗ Reactive Forms still use RxJS Observables, not Signals   ║
// ║  ✗ FormBuilder.group() .value has optional fields           ║
// ╚══════════════════════════════════════════════════════════════╝

@Component({
  standalone: true, // v18: still must be set explicitly
  selector: 'ui-recipe-form-v18',

  // ── No more CommonModule! ───────────────────────────────────
  // @if/@for are built into the template engine.
  // Only ReactiveFormsModule remains for [formGroup]/formControlName.
  imports: [ReactiveFormsModule],
  templateUrl: './recipe-form-v18.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeFormV18 {

  // ── output() function ───────────────────────────────────────
  // Replaces: @Output() recipeAdded = new EventEmitter<T>();
  //
  // output() returns OutputEmitterRef<T>, NOT an EventEmitter.
  // You can .emit() but consumers can't .subscribe() — they must
  // use (recipeAdded)="..." in templates. Cleaner contract.
  recipeAdded = output<Omit<Recipe, 'id' | 'favorite'>>();

  private fb = inject(FormBuilder);

  recipeForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    cookingTime: [0, [Validators.required, Validators.min(1)]],
  });

  submit(): void {
    if (this.recipeForm.valid) {
      this.recipeAdded.emit(this.recipeForm.value as Omit<Recipe, 'id' | 'favorite'>);
      this.recipeForm.reset({ title: '', description: '', cookingTime: 0 });
    }
  }
}
