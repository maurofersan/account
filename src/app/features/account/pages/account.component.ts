import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-account',
  imports: [RouterOutlet],
  template: `
    <h1>Acount Flow</h1>
    <router-outlet></router-outlet>
  `,
})
export class AccountComponent {}
