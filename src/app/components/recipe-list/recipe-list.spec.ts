import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { RecipeList } from './recipe-list';

const mockRecipes = [
  { id: 1, title: 'Crêpes', description: 'Classic French crêpes', cookingTime: 20, favorite: true },
  {
    id: 2,
    title: 'Ratatouille',
    description: 'Provençal vegetable stew',
    cookingTime: 45,
    favorite: false,
  },
];

describe('RecipeList', () => {
  let component: RecipeList;
  let fixture: ComponentFixture<RecipeList>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeList],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RecipeList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display recipes after HTTP response', async () => {
    // Step 0: Kick off change detection so httpResource fires the request
    fixture.detectChanges();

    // Step 1: Catch the pending request
    const req = httpTesting.expectOne('/recipes.json');

    // Step 2: Respond with mock data
    req.flush(mockRecipes);

    // Step 3: Wait for async signal update, then re-render
    await fixture.whenStable();
    fixture.detectChanges();

    // Step 4: Assert
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h2')?.textContent).toContain('Recipes');
    expect(compiled.querySelectorAll('[data-test-id="list-item"]').length).toBe(mockRecipes.length);
  });
});
