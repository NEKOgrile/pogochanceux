import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss'
})
export class FriendsComponent implements OnInit { 
  users: any[] = [];              // La liste complète des utilisateurs
  filteredUsers: any[] = [];       // La liste filtrée des utilisateurs
  searchTerm: string = '';         // Terme de recherche pour filtrer les utilisateurs
  showUsers: boolean = false;      // Variable pour gérer l'affichage de la liste des utilisateurs

  constructor(private authService: AuthService) {}

  // Initialisation du composant
  ngOnInit(): void {
    this.loadUsers();  // Charge les utilisateurs dès le démarrage
  }

  // Méthode pour charger les utilisateurs depuis l'API
  loadUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data: any[]) => {
        this.users = data;
        this.filteredUsers = data;  // Initialise filteredUsers avec tous les utilisateurs dès le départ
      },
      (error) => {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    );
  }

  // Méthode déclenchée quand on clique sur le bouton "+" (optionnel, pour alterner l'affichage)
  toggleUserList(): void {
    this.showUsers = !this.showUsers;  // Alterne l'affichage de la liste des utilisateurs
  }

  // Méthode pour filtrer la liste des utilisateurs
  filterUsers(): void {
    if (this.searchTerm.trim()) {
      this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = this.users;  // Affiche tous les utilisateurs si la barre de recherche est vide
    }
}}
