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
  {
    path: 'identity-validation-failed',
    loadComponent: () =>
      import('./identity-validation-failed').then((m) => m.IdentityValidationFailedComponent),
  },
  {
    path: 'max-attempts-exceeded',
    loadComponent: () =>
      import('./max-attempts-exceeded').then((m) => m.MaxAttemptsExceededComponent),
  },
  {
    path: 'page-load-error',
    loadComponent: () =>
      import('./page-load-error').then((m) => m.PageLoadErrorComponent),
  },
];
