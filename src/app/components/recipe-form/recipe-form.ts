import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { form, FormField, required, minLength, min } from '@angular/forms/signals';
import { Recipe } from '../../models/recipe';

interface RecipeFormData {
  title: string;
  description: string;
  cookingTime: number;
}

@Component({
  selector: 'ui-recipe-form',
  imports: [FormField],
  templateUrl: './recipe-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipeForm {
  recipeAdded = output<Omit<Recipe, 'id' | 'favorite'>>();

  // Signal holds the form data model — this IS the source of truth
  recipeModel = signal<RecipeFormData>({
    title: '',
    description: '',
    cookingTime: 0,
  });

  recipeForm = form(this.recipeModel, (p) => {
    required(p.title, { message: 'Title is required' });
    minLength(p.title, 2, { message: 'At least 2 characters' });
    required(p.description, { message: 'Description is required' });
    required(p.cookingTime, { message: 'Cooking time is required' });
    min(p.cookingTime, 1, { message: 'At least 1 minute' });
  });

  submit(event: any) {
    event.preventDefault()
    console.log(this.recipeForm())
  }
  // TODO(human): Create the field tree and validation schema.
  //
  // Use form() with your recipeModel and a validation function:
  //
  //   recipeForm = form(this.recipeModel, p => {
  //     required(p.title, { message: 'Title is required' })
  //     minLength(p.title, 2, { message: 'At least 2 characters' })
  //     required(p.description, { message: 'Description is required' })
  //     required(p.cookingTime, { message: 'Cooking time is required' })
  //     min(p.cookingTime, 1, { message: 'At least 1 minute' })
  //   })
  //
  // Then implement submit():
  //   - Read the model value with this.recipeModel()
  //   - Emit it with this.recipeAdded.emit(...)
  //   - Reset by setting recipeModel back to defaults
}
