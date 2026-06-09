import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'app-mantenimientos-entry',
  template: `<router-outlet />`,
})
export class RemoteEntry {}
