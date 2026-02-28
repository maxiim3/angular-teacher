import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { RecipeList } from './recipe-list';

const mockRecipes = [
  { id: 1, title: 'Crêpes', description: 'Classic French crêpes', cookingTime: 20, favorite: true },
  { id: 2, title: 'Ratatouille', description: 'Provençal vegetable stew', cookingTime: 45, favorite: false }
];

describe('RecipeList', () => {
  let component: RecipeList;
  let fixture: ComponentFixture<RecipeList>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeList],
      // TODO(human): Add the providers needed for HTTP testing.
      //
      // You need two providers:
      // 1. provideHttpClient() — same as app.config, registers the real HttpClient
      // 2. provideHttpClientTesting() — intercepts requests so nothing hits the network
      //
      // This gives us an HttpTestingController we can use to flush mock responses.
      providers: []
    })
    .compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(RecipeList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
