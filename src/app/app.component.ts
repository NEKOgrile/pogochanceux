import { Component } from '@angular/core';
import { AuthService } from './auth.service'; // Assurez-vous d'importer AuthService correctement

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private authService: AuthService) {}
}
