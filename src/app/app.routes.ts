import { Routes } from '@angular/router';

import { ACCOUNT_ROUTES } from './features/account.routes';

export const routes: Routes = [
  {
    path: 'cuenta',
    children: ACCOUNT_ROUTES,
  },
  {
    path: '',
    redirectTo: 'cuenta',
    pathMatch: 'full',
  },
];
