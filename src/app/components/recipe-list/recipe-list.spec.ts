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

  it('should display recipes after HTTP response', () => {
    // Step 1: Catch the pending request that httpResource fired automatically
    const req = httpTesting.expectOne('/recipes.json');

    // Step 2: Respond with our mock data (like returning a fake API response)
    req.flush(mockRecipes);

    // Step 3: Tell Angular to process the signal update into the DOM
    fixture.detectChanges();

    // Step 4: Now the component has data — query the rendered DOM
    const compiled = fixture.nativeElement as HTMLElement;

    // TODO(human): Write 2-3 expect() assertions to verify the recipes rendered.
    //
    // You have access to:
    //   compiled.querySelectorAll(...)  — find DOM elements (like document.querySelectorAll)
    //   compiled.textContent            — all text in the component
    //   component.recipes()             — the signal value directly
    //
    // Ideas: check the number of recipe cards, check that "Crêpes" appears,
    //        check the favorite count shows "1 favorites" (only Crêpes is favorite).
  });
});
