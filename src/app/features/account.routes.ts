import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'seleccionar-cuenta',
    pathMatch: 'full',
  },
  {
    path: 'seleccionar-cuenta',
    loadComponent: () =>
      import('./select-account').then((m) => m.SelectAccountPageComponent),
  },
  {
    path: 'resumen-cuenta',
    loadComponent: () =>
      import('./account-summary').then((m) => m.AccountSummaryPageComponent),
  },
  {
    path: 'cuenta-activada',
    loadComponent: () =>
      import('./account-summary').then((m) => m.AccountSuccessPageComponent),
  },
];
