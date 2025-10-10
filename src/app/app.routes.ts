import { Routes } from '@angular/router';

import { ACCOUNT_ROUTES } from './features/account.routes';

export const routes: Routes = [
  {
    path: '',
    children: ACCOUNT_ROUTES,
  },
];
