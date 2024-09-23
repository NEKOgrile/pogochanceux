import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent implements OnInit { 
  users: any[] = [];
  showUsers: boolean = false; // Variable pour afficher ou non la liste

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  // Méthode déclenchée quand on clique sur le bouton "+"
  toggleUserList(): void {
    if (!this.showUsers) {
      // Si la liste n'est pas affichée, on récupère les utilisateurs
      this.authService.getAllUsers().subscribe(
        (data: any[]) => {
          this.users = data;
        },
        (error) => {
          console.error("Erreur lors de la récupération des utilisateurs", error);
        }
      );
    }
    // Inverser l'état d'affichage de la liste
    this.showUsers = !this.showUsers;
  }
}
