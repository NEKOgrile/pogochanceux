import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from './auth.service'; // Assurez-vous d'importer correctement votre service d'authentification

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string | null = null;
  isDarkMode: boolean = false; // État pour suivre le mode sombre
  isPokeballClicked: boolean = false; // État pour suivre l'état de la Pokéball

  constructor(private authService: AuthService, private renderer: Renderer2) {}

  ngOnInit(): void {
    // S'abonner aux changements d'état d'authentification
    this.authService.isLoggedIn$().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      this.username = this.authService.getUsername();
    });

    // Vérifier le mode sombre dans localStorage au chargement de la page
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
      this.isDarkMode = true;
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  logout(): void {
    this.authService.logout();
  }



  togglePokeball(): void {
    // Animation de la Pokeball normale
    this.isPokeballClicked = !this.isPokeballClicked;
    const pokeballElement = document.querySelector('.pokeball-toggle');
    pokeballElement?.classList.toggle('animate');

    // Toggle du mode sombre
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }
}
