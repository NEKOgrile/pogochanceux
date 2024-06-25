import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  username: string | null = null;
  isLoggedIn: boolean = false; // Définir la propriété isLoggedIn

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.username = this.authService.getUsername();
    this.isLoggedIn = this.authService.isLoggedIn(); // Mettre à jour la valeur de isLoggedIn
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false; // Mettre à jour la valeur de isLoggedIn après la déconnexion
  }

  navigateToLogin() {
    // Code pour naviguer vers la page de connexion (si nécessaire)
  }

  navigateToRegister() {
    // Code pour naviguer vers la page d'inscription (si nécessaire)
  }
}
