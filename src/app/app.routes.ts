import { Routes } from '@angular/router';
import { Home } from './components/views/home/home';
import { MainLayout } from './components/layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Home,
      },
    ],
  },
];
