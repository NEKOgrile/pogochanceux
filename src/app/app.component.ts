import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string | null = null;
  isDarkMode: boolean = false;
  isPokeballClicked: boolean = false;

  constructor(private authService: AuthService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$().subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
      this.username = this.authService.getUsername();
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      const darkMode = localStorage.getItem('darkMode');
      if (darkMode === 'true') {
        this.isDarkMode = true;
        this.renderer.addClass(document.body, 'dark-mode');
      }
    }
  }

  logout(): void {
    this.authService.logout();
  }

  togglePokeball(): void {
    this.isPokeballClicked = !this.isPokeballClicked;
    const pokeballElement = document.querySelector('.pokeball-toggle');
    pokeballElement?.classList.toggle('animate');

    this.isDarkMode = !this.isDarkMode;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (this.isDarkMode) {
        this.renderer.addClass(document.body, 'dark-mode');
        localStorage.setItem('darkMode', 'true');
      } else {
        this.renderer.removeClass(document.body, 'dark-mode');
        localStorage.setItem('darkMode', 'false');
      }
    }
  }
}
