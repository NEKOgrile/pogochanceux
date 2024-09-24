import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';


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
  userId: number | null = null;
  frienRequest: any[] = [];

  constructor(private authService: AuthService) {}

  // Initialisation du composant
  //ngOnInit(): void {
  //  this.GetRequest()
  //}


  ngOnInit(): void {
    this.loadUsers();  // Charge les utilisateurs dès le démarrage

    if (this.authService.isLoggedIn()) {
      if (this.userId === null) {
        this.authService
          .getUserId()
          .pipe(
            tap((response: any) => {
              console.log('Réponse du service getUserId :', response);
              this.userId = response.id_user; // Mettre à jour this.userId avec la valeur reçue
              console.log("L'ID est pris par la fonction = ", this.userId);
              // Charger les Pokémon de l'utilisateur après avoir reçu l'ID utilisateur
              this.GetRequest(this.userId)
            })
            
          )
          .subscribe();
      } else {
        console.log("L'ID est déjà dans une variable locale :", this.userId);
      }
     
    }  
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


  GetRequest(user_id_get : number | null): void {
    this.authService.getUserId().subscribe(
      (userid: any) => {
        this.userId = userid;
        if (!this.userId) {
          console.error("Aucun utilisateur connecté !");
          return;
        }
  
        this.authService.getFriendRequests(user_id_get).subscribe(
          (data: any[]) => {
            console.log('Demandes d\'amitié reçues pour l id :' , user_id_get, data);
            this.frienRequest = data;
          },
          (error) => {
            console.error("Erreur lors de la récupération des demandes d'amitié", error);
          }
        );
      },
      (error : any) => {
        console.error("Erreur lors de la récupération de l'ID de l'utilisateur", error);
      }
    );
  }



GetUserSendRequest(tableau_id_user_send_request : any): void{

  
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
