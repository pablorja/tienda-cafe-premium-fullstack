import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'catalogo' },
  { path: 'catalogo', component: Home, data: { admin: false } },
  { path: 'admin', component: Home, data: { admin: true } },
  { path: 'administracion', pathMatch: 'full', redirectTo: 'admin' },
  { path: 'login', component: Login },
  { path: '**', redirectTo: 'catalogo' },
];
