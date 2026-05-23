import { Component } from '@angular/core';
//import { RouterModule } from '@angular/router';
//import { NxWelcome } from './nx-welcome';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'Gestion de Usuarios';
}
