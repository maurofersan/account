import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountEntryComponent } from './account-entry.component';

const routes: Routes = [
  {
    path: '',
    component: AccountEntryComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./account.routes').then((m) => m.ACCOUNT_ROUTES),
      },
    ],
  },
];

@NgModule({
  declarations: [AccountEntryComponent],
  imports: [RouterModule.forChild(routes)],
})
export class AccountEntryModule {}
