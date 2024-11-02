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
  showFriendRequests: boolean = false; // Variable pour gérer l'affichage des demandes d'amis
  userId: number | null = null;      
  frienRequest: any[] = [];        // Tableau avec les demandes d'amis pour l'utilisateur connecté
  allUsers: any[] = [];            // Liste pour stocker toutes les infos des utilisateurs
  selectedUser: any | null = null; // Propriété pour stocker l'utilisateur sélectionné

  constructor(private authService: AuthService) {}

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
              // Charger les demandes d'amis après avoir reçu l'ID utilisateur
              this.GetRequest(this.userId);
              this.loadAllUserInfo();
            })
          )
          .subscribe();
      } else {
        console.log("L'ID est déjà dans une variable locale :", this.userId);
      }
    }  
  }

  addFriend(user: any): void {
    console.log(`Ajouter ${user.username} en ami`);
    // Ajoute ici la logique pour envoyer une demande d'amitié
  }
  
  blockUser(user: any): void {
    console.log(`Bloquer ${user.username}`);
    // Ajoute ici la logique pour bloquer l'utilisateur
  }
  
  // Méthode pour sélectionner un utilisateur et afficher les options "Ajouter" et "Bloquer"
  selectUser(user: any): void {
    this.selectedUser = this.selectedUser === user ? null : user;
    console.log("Utilisateur sélectionné:", this.selectedUser); // Vérifie que le clic fonctionne
  }
  


  acceptFridRequest(idUserWhoSendRequest: number): void {
    console.log("Demande d'acceptation avec l'ID:", idUserWhoSendRequest);
    
    if (this.userId === null) {
      console.error("Utilisateur non connecté !");
      return;
    } else {
      this.authService.acceptFriendRequest(this.userId, idUserWhoSendRequest).subscribe(
        response => {
          console.log('Demande acceptée avec succès', response);
  
          // Supprimer l'élément du tableau où friend_id correspond à idUserWhoSendRequest
          this.frienRequest = this.frienRequest.filter(request => request.friend_id !== idUserWhoSendRequest);
          console.log('Tableau mis à jour:', this.frienRequest);
        },
        error => {
          console.error("Erreur lors de l'acceptation de la demande", error);
        }
      );
    }
  }
  rejectFridRequest(idUserWhoSendRequest: number): void{
    if (this.userId === null) {
      console.error("Utilisateur non connecté !");
      return;
    } else {
      this.authService.rejectFriendRequest(this.userId, idUserWhoSendRequest).subscribe(
        response => {
          console.log('Demande refusé avec succès', response);
  
          // Supprimer l'élément du tableau où friend_id correspond à idUserWhoSendRequest
          this.frienRequest = this.frienRequest.filter(request => request.friend_id !== idUserWhoSendRequest);
          console.log('Tableau mis à jour:', this.frienRequest);
        },
        error => {
          console.error("Erreur lors du refus de la demande", error);
        }
      );
    }

  }
  

  // Méthode pour charger les utilisateurs depuis l'API
  loadUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data: any[]) => {
        this.users = data;
        this.filteredUsers = data;  // Initialise filteredUsers avec tous les utilisateurs dès le départ
      },
      (error : any) => {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    );
  }

  // Méthode pour récupérer les demandes d'amis
  GetRequest(user_id_get: number | null): void {
    if (!user_id_get) {
      console.error("Aucun utilisateur connecté !");
      return;
    }
  
    this.authService.getFriendRequests(user_id_get).subscribe(
      (data: any[]) => {
        console.log('Demandes d\'amitié reçues pour l\'id :', user_id_get, data);
        this.frienRequest = data; // Stocker les demandes d'amis
      },
      (error : any) => {
        console.error("Erreur lors de la récupération des demandes d'amitié", error);
      }
    );
  }

  // Méthode pour charger toutes les informations des utilisateurs
  loadAllUserInfo(): void {
    this.authService.getAllUserAndAllinfos().subscribe(
      (data: any[]) => {
        this.allUsers = data;  // Stocke toutes les infos dans une variable locale
        console.log('Tous les utilisateurs récupérés:');
      },
      (error: any) => {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    );
  }

  // Méthode pour trouver le nom d'un utilisateur par son ID
  GetNameUserById(IdNumberUserWhoSendRequest: number): string | undefined {
    const user = this.allUsers.find(u => u.id_user === IdNumberUserWhoSendRequest);
    return user ? user.username : 'Utilisateur inconnu';
  }

  // Méthode déclenchée quand on clique sur le bouton "+" (optionnel, pour alterner l'affichage)
  toggleUserList(): void {
    this.showUsers = !this.showUsers;  // Alterne l'affichage de la liste des utilisateurs
  }

  // Nouvelle méthode pour basculer l'affichage des demandes d'amis
  toggleFriendRequests(): void {
    this.showFriendRequests = !this.showFriendRequests; // Alterne l'affichage des demandes d'amis
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
  }
}

