import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service'; // Assurez-vous d'importer correctement votre service d'authentification

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // S'abonner aux changements d'état d'authentification
    this.authService.isLoggedIn$().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      this.username = this.authService.getUsername();
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
