import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipeListV14 } from './recipe-list-v14';

// ──────────────────────────────────────────────────────────────
// NgModule — Angular 14's mandatory wiring layer
// ──────────────────────────────────────────────────────────────
//
// Same pattern as recipe-form-v14.module.ts:
// Every component MUST be declared in exactly one NgModule.
//
//   declarations: [] → registers components that BELONG to this module
//   imports: []      → brings in OTHER modules whose directives/pipes we need
//   exports: []      → makes components available to PARENT modules
//
// CommonModule is needed for *ngFor and *ngIf in the template.
// No ReactiveFormsModule here — this component has no forms.
//
// This entire file DISAPPEARS in Angular 16+ thanks to standalone.
// ──────────────────────────────────────────────────────────────
@NgModule({
  declarations: [RecipeListV14],
  imports: [CommonModule],
  exports: [RecipeListV14],
})
export class RecipeListV14Module {}
