import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Recipe } from '../../models/recipe';

// ╔══════════════════════════════════════════════════════════════╗
// ║  ANGULAR 14 — The NgModule Era (June 2022)                  ║
// ╠══════════════════════════════════════════════════════════════╣
// ║                                                             ║
// ║  THE BASELINE — This is the "classic" Angular pattern.      ║
// ║  Everything that follows is a reaction to the pain points   ║
// ║  visible here.                                              ║
// ║                                                             ║
// ║  Architecture:                                              ║
// ║  ┌─────────────┐     ┌──────────────────┐                   ║
// ║  │ NgModule     │────▶│ Component        │                   ║
// ║  │ declarations │     │ (cannot exist    │                   ║
// ║  │ imports      │     │  without module) │                   ║
// ║  │ exports      │     └──────────────────┘                   ║
// ║  └─────────────┘                                            ║
// ║                                                             ║
// ║  Key characteristics:                                       ║
// ║  • NgModule required — see recipe-form-v14.module.ts        ║
// ║  • Constructor injection — the only DI mechanism            ║
// ║  • @Output() + EventEmitter — decorator-based outputs       ║
// ║  • FormGroup (untyped!) — .value returns `any`              ║
// ║  • *ngIf/*ngFor — structural directives from CommonModule   ║
// ║  • No signals — state is mutable class properties           ║
// ║                                                             ║
// ║  Pain points addressed by v16:                              ║
// ║  ✗ NgModule boilerplate (extra file, declarations array)    ║
// ║  ✗ Constructor DI forces class-based patterns               ║
// ║  ✗ FormGroup is untyped — .get('title') returns any         ║
// ║  ✗ No reactive primitives — Zone.js detects ALL changes     ║
// ╚══════════════════════════════════════════════════════════════╝

@Component({
  standalone: false, // Angular 14: standalone didn't exist, false is the default
  selector: 'ui-recipe-form-v14',
  templateUrl: './recipe-form-v14.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeFormV14 {

  // ── Output ──────────────────────────────────────────────────
  // @Output decorator + EventEmitter: the only way to emit events.
  // Downsides:
  //   - Decorator syntax is verbose
  //   - EventEmitter extends RxJS Subject (leaky abstraction)
  //   - Easy to forget () on the decorator → silent failure
  @Output() recipeAdded = new EventEmitter<Omit<Recipe, 'id' | 'favorite'>>();

  // ── Form ────────────────────────────────────────────────────
  // FormGroup is UNTYPED in v14. recipeForm.value returns `any`.
  // recipeForm.get('title') also returns AbstractControl | null.
  // Typos in control names ('titl') won't be caught by TypeScript.
  //
  // v14.1 introduced Typed Forms (FormGroup<T>), but adoption
  // was gradual and fb.group() still returned untyped by default.
  recipeForm: FormGroup;

  // ── Dependency Injection ────────────────────────────────────
  // Constructor injection: the ONLY way to get dependencies.
  // Forces you into a class with a constructor, even for simple components.
  // Makes testing require TestBed.configureTestingModule() setup.
  constructor(private fb: FormBuilder) {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      cookingTime: [0, [Validators.required, Validators.min(1)]],
    });
  }

  submit(): void {
    if (this.recipeForm.valid) {
      // .value is `any` — no type safety here
      this.recipeAdded.emit(this.recipeForm.value);
      this.recipeForm.reset({ title: '', description: '', cookingTime: 0 });
    }
  }
}
