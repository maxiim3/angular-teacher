import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RecipeFormV14 } from './recipe-form-v14';

// ──────────────────────────────────────────────────────────────
// NgModule — Angular 14's mandatory wiring layer
// ──────────────────────────────────────────────────────────────
//
// Every component MUST be declared in exactly one NgModule.
// This creates a tight coupling between components and their module:
//
//   declarations: [] → registers components that BELONG to this module
//   imports: []      → brings in OTHER modules whose directives/pipes we need
//   exports: []      → makes components available to PARENT modules
//
// Pain points this pattern creates:
//   1. A component can't exist without a module → extra boilerplate file
//   2. CommonModule must be imported everywhere for basic *ngIf/*ngFor
//   3. ReactiveFormsModule must also be imported for form directives
//   4. Circular dependency risks when modules import each other
//   5. "declarations" vs "imports" confusion for beginners
//
// This entire file DISAPPEARS in Angular 16+ thanks to standalone components.
// ──────────────────────────────────────────────────────────────
@NgModule({
  declarations: [RecipeFormV14],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [RecipeFormV14],
})
export class RecipeFormV14Module {}
