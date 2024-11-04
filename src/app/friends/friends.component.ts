// *******************************************************************
//                      FriendsComponent - Organisation du Code
// *******************************************************************
//
// Cette partie contient les déclarations des propriétés du composant
// - filteredUsers: Liste filtrée des utilisateurs
// - searchTerm: Terme de recherche pour filtrer les utilisateurs
// - showUsers: Contrôle l'affichage de la liste des utilisateurs
// - showFriendRequests: Contrôle l'affichage des demandes d'amis
// - userId: ID de l'utilisateur connecté
// - friendRequests: Tableau contenant les demandes d'amis
// - allUsers: Liste de toutes les informations des utilisateurs
// - selectedUser: Utilisateur actuellement sélectionné
// - allFriendsOfUser: Liste des amis de l'utilisateur connecté
//
// *******************************************************************
//                        Méthodes du Cycle de Vie
// *******************************************************************
//
// ngOnInit(): Méthode déclenchée lors de l'initialisation du composant.
// Elle charge les utilisateurs, vérifie la connexion de l'utilisateur
// et récupère les informations nécessaires.
//
// *******************************************************************
//                          Méthodes d'Interaction
// *******************************************************************
//
// takeAllFriends(): Récupère la liste des amis acceptés de l'utilisateur.
// addFriend(user: any): Envoie une demande d'amitié à l'utilisateur ciblé.
// blockUser(user: any): Logique pour bloquer un utilisateur (à implémenter).
// selectUser(user: any): Gère la sélection d'un utilisateur pour des actions.
// acceptFriendRequest(idUserWhoSendRequest: number): Accepte une demande d'amitié.
// rejectFriendRequest(idUserWhoSendRequest: number): Refuse une demande d'amitié.
//
// *******************************************************************
//                        Méthodes de Chargement
// *******************************************************************
//
// loadUsers(): Récupère la liste de tous les utilisateurs.
// GetRequest(user_id_get: number | null): Récupère les demandes d'amis pour l'utilisateur connecté.
// loadAllUserInfo(): Charge toutes les informations des utilisateurs.
//
// *******************************************************************
//                     Méthodes d'Aide et de Filtrage
// *******************************************************************
//
// GetNameUserById(IdNumberUserWhoSendRequest: number): Trouve le nom d'un utilisateur par son ID.
// toggleUserList(): Bascule l'affichage de la liste des utilisateurs.
// toggleFriendRequests(): Bascule l'affichage des demandes d'amis.
// filterUsers(): Filtre la liste des utilisateurs en fonction du terme de recherche.
//
// *******************************************************************

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent implements OnInit {
  filteredUsers: any[] = []; // La liste filtrée des utilisateurs
  searchTerm: string = ''; // Terme de recherche pour filtrer les utilisateurs
  showUsers: boolean = false; // Variable pour gérer l'affichage de la liste des utilisateurs
  showFriendRequests: boolean = false; // Variable pour gérer l'affichage des demandes d'amis
  userId: number | null = null;
  frienRequest: any[] = []; // Tableau avec les demandes d'amis pour l'utilisateur connecté
  allUsers: any[] = []; // Liste pour stocker toutes les infos des utilisateurs
  selectedUser: any | null = null; // Propriété pour stocker l'utilisateur sélectionné
  allFriendOfUser: any[] = []; //List des amis de l utilisateur
  constructor(private authService: AuthService) {}







  // *******************************************************************
  //                           ngOnInit()
  // *******************************************************************
  // Description :
  // Cette méthode est exécutée lors de l'initialisation du composant.
  // Elle charge les utilisateurs et récupère les informations pertinentes
  // pour l'utilisateur connecté.
  // *******************************************************************
  // Fonctions appelées :
  // - loadUsers(): Charge tous les utilisateurs disponibles dès le démarrage.
  // - isLoggedIn(): Vérifie si l'utilisateur est connecté.
  // - getUserId(): Récupère l'ID de l'utilisateur connecté, si disponible.
  // - GetRequest(userId): Récupère les demandes d'amis pour l'utilisateur connecté.
  // - loadAllUserInfo(): Charge toutes les informations des utilisateurs.
  // - takeAllFriends(): Charge la liste des amis de l'utilisateur connecté.
  // *******************************************************************
  ngOnInit(): void {
    this.loadUsers(); // Charge les utilisateurs dès le démarrage
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
              //apelle de tout les fonction au lencelment de la page
              this.GetRequest(this.userId);
              this.loadAllUserInfo();
              this.takeAllFriends(); // Charger les amis ici également si userId n'est pas null
            })
          )
          .subscribe();
      } else {
        console.log("L'ID est déjà dans une variable locale :", this.userId);
      }
    }
  }

  // *******************************************************************
  //                           takeAllFriends()
  // *******************************************************************
  // Description :
  // Cette méthode récupère et affiche la liste des amis acceptés
  // pour l'utilisateur connecté en appelant le service approprié.
  //
  // Fonctions appelées :
  // - getAllFriendsOfUserLogin(userId): Récupère tous les amis de l'utilisateur
  //   connecté et les affiche dans la console.
  // *******************************************************************

  takeAllFriends(): void {
    console.log('id test = ', this.userId);
    this.authService.getAllFriendsOfUserLogin(this.userId).subscribe(
      (friends: any[]) => {
        console.log('Liste des amis acceptés :', friends);
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des amis :', error);
      }
    );
  }

  // *******************************************************************
  //                           addFriend(user)
  // *******************************************************************
  // Description :
  // Cette méthode permet d'ajouter un nouvel ami en envoyant une
  // demande d'amitié à l'utilisateur cible.
  //
  // Fonctions appelées :
  // - sendFriendRequest(userId, targetUserId): Envoie une demande
  //   d'amitié à l'utilisateur cible si l'utilisateur connecté est valide.
  // *******************************************************************
  addFriend(user: any): void {
    console.log(`Ajouter ${user.username} en ami`);

    if (this.userId === null) {
      console.error('Utilisateur non connecté !');
      return;
    }

    // Rechercher l'ID de l'utilisateur cible dans la liste allUsers
    const targetUser = this.allUsers.find((u) => u.username === user.username);

    if (!targetUser) {
      console.error(
        'Utilisateur cible non trouvé dans la liste des utilisateurs.'
      );
      return;
    }
    // Envoyer la demande d'ami avec l'ID de l'utilisateur cible
    this.authService
      .sendFriendRequest(this.userId, targetUser.id_user)
      .subscribe(
        (response) => {
          console.log('Réponse du service sendFriendRequest :', response);
        },
        (error) => {
          console.error("Erreur lors de l'envoi de la demande d'amitié", error);
        }
      );
  }



  // *******************************************************************
  //                           blockUser(user)
  // *******************************************************************
  // Description :
  // Cette méthode permet de bloquer un utilisateur donné. La logique pour
  // bloquer l'utilisateur devra être implémentée.
  //
  // Fonctions appelées :
  // - Aucune pour l'instant, car la logique de blocage n'est pas encore définie.
  // *******************************************************************

  blockUser(user: any): void {
    console.log(`Bloquer ${user.username}`);
    // Ajoute ici la logique pour bloquer l'utilisateur
  }

  

  // *******************************************************************
  //                           selectUser(user)
  // *******************************************************************
  // Description :
  // Cette méthode sélectionne un utilisateur pour afficher les options
  // "Ajouter" et "Bloquer" en alternant l'état de la sélection.
  //
  // Fonctions appelées :
  // - Aucune.
  // *******************************************************************
  // Méthode pour sélectionner un utilisateur et afficher les options "Ajouter" et "Bloquer"
  selectUser(user: any): void {
    this.selectedUser = this.selectedUser === user ? null : user;
    console.log('Utilisateur sélectionné:', this.selectedUser); // Vérifie que le clic fonctionne
  }

  // *******************************************************************
  //                           acceptFridRequest(idUserWhoSendRequest)
  // *******************************************************************
  // Description :
  // Cette méthode permet d'accepter une demande d'ami en appelant
  // le service d'acceptation de demande d'ami.
  //
  // Fonctions appelées :
  // - acceptFriendRequest(userId, idUserWhoSendRequest): Accepte la
  //   demande d'amitié pour l'utilisateur connecté et met à jour le tableau
  //   des demandes d'amis.
  // *******************************************************************
  acceptFridRequest(idUserWhoSendRequest: number): void {
    console.log("Demande d'acceptation avec l'ID:", idUserWhoSendRequest);

    if (this.userId === null) {
      console.error('Utilisateur non connecté !');
      return;
    } else {
      this.authService
        .acceptFriendRequest(this.userId, idUserWhoSendRequest)
        .subscribe(
          (response) => {
            console.log('Demande acceptée avec succès', response);

            // Supprimer l'élément du tableau où friend_id correspond à idUserWhoSendRequest
            this.frienRequest = this.frienRequest.filter(
              (request) => request.friend_id !== idUserWhoSendRequest
            );
            console.log('Tableau mis à jour:', this.frienRequest);
          },
          (error) => {
            console.error("Erreur lors de l'acceptation de la demande", error);
          }
        );
    }
  }

  // *******************************************************************
  //                           rejectFridRequest(idUserWhoSendRequest)
  // *******************************************************************
  // Description :
  // Cette méthode permet de refuser une demande d'ami en appelant
  // le service de refus de demande d'ami.
  //
  // Fonctions appelées :
  // - rejectFriendRequest(userId, idUserWhoSendRequest): Refuse la
  //   demande d'amitié pour l'utilisateur connecté et met à jour le tableau
  //   des demandes d'amis.
  // *******************************************************************
  rejectFridRequest(idUserWhoSendRequest: number): void {
    if (this.userId === null) {
      console.error('Utilisateur non connecté !');
      return;
    } else {
      this.authService
        .rejectFriendRequest(this.userId, idUserWhoSendRequest)
        .subscribe(
          (response) => {
            console.log('Demande refusé avec succès', response);

            // Supprimer l'élément du tableau où friend_id correspond à idUserWhoSendRequest
            this.frienRequest = this.frienRequest.filter(
              (request) => request.friend_id !== idUserWhoSendRequest
            );
            console.log('Tableau mis à jour:', this.frienRequest);
          },
          (error) => {
            console.error('Erreur lors du refus de la demande', error);
          }
        );
    }
  }

  // *******************************************************************
  //                           loadUsers()
  // *******************************************************************
  // Description :
  // Cette méthode charge la liste des utilisateurs depuis l'API et
  // met à jour les listes d'utilisateurs filtrés et complets.
  //
  // Fonctions appelées :
  // - getAllUsers(): Récupère tous les utilisateurs disponibles dans
  //   l'application.
  // *******************************************************************
  // Méthode pour charger les utilisateurs depuis l'API
  loadUsers(): void {
    this.authService.getAllUsers().subscribe(
      (data: any[]) => {
        this.filteredUsers = data; // Initialise filteredUsers avec tous les utilisateurs dès le départ
        this.allUsers = data;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  // *******************************************************************
  //                           GetRequest(user_id_get)
  // *******************************************************************
  // Description :
  // Cette méthode récupère les demandes d'amis pour un utilisateur donné
  // en appelant le service approprié.
  //
  // Fonctions appelées :
  // - getFriendRequests(user_id_get): Récupère les demandes d'amis pour
  //   l'utilisateur connecté.
  // *******************************************************************
  // Méthode pour récupérer les demandes d'amis
  GetRequest(user_id_get: number | null): void {
    if (!user_id_get) {
      console.error('Aucun utilisateur connecté !');
      return;
    }

    this.authService.getFriendRequests(user_id_get).subscribe(
      (data: any[]) => {
        console.log("Demandes d'amitié reçues pour l'id :", user_id_get, data);
        this.frienRequest = data; // Stocker les demandes d'amis
      },
      (error: any) => {
        console.error(
          "Erreur lors de la récupération des demandes d'amitié",
          error
        );
      }
    );
  }

  // *******************************************************************
  //                           loadAllUserInfo()
  // *******************************************************************
  // Description :
  // Cette méthode charge toutes les informations des utilisateurs depuis
  // l'API et les stocke dans une variable locale.
  //
  // Fonctions appelées :
  // - getAllUserAndAllinfos(): Récupère toutes les informations disponibles
  //   sur tous les utilisateurs.
  // *******************************************************************
  // Méthode pour charger toutes les informations des utilisateurs
  loadAllUserInfo(): void {
    this.authService.getAllUserAndAllinfos().subscribe(
      (data: any[]) => {
        this.allUsers = data; // Stocke toutes les infos dans une variable locale
        console.log('Tous les utilisateurs récupérés:');
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    );
  }

  // *******************************************************************
  //                           GetNameUserById(IdNumberUserWhoSendRequest)
  // *******************************************************************
  // Description :
  // Cette méthode permet de trouver le nom d'un utilisateur en fonction
  // de son ID et retourne un nom ou un message indiquant que l'utilisateur
  // est inconnu.
  //
  // Fonctions appelées :
  // - Aucune.
  // *******************************************************************
  // Méthode pour trouver le nom d'un utilisateur par son ID
  GetNameUserById(IdNumberUserWhoSendRequest: number): string | undefined {
    const user = this.allUsers.find(
      (u) => u.id_user === IdNumberUserWhoSendRequest
    );
    return user ? user.username : 'Utilisateur inconnu';
  }

  // *******************************************************************
  //                           toggleUserList()
  // *******************************************************************
  // Description :
  // Cette méthode alterne l'affichage de la liste des utilisateurs lorsque
  // l'utilisateur clique sur le bouton "+".
  //
  // Fonctions appelées :
  // - Aucune.
  // *******************************************************************
  // Méthode déclenchée quand on clique sur le bouton "+" (optionnel, pour alterner l'affichage)
  toggleUserList(): void {
    this.showUsers = !this.showUsers; // Alterne l'affichage de la liste des utilisateurs
  }
  // *******************************************************************
  //                           toggleFriendRequests()
  // *******************************************************************
  // Description :
  // Cette méthode alterne l'affichage des demandes d'amis lorsqu'elle est
  // appelée.
  //
  // Fonctions appelées :
  // - Aucune.
  // *******************************************************************
  // Nouvelle méthode pour basculer l'affichage des demandes d'amis
  toggleFriendRequests(): void {
    this.showFriendRequests = !this.showFriendRequests; // Alterne l'affichage des demandes d'amis
  }
  // *******************************************************************
  //                           filterUsers()
  // *******************************************************************
  // Description :
  // Cette méthode filtre la liste des utilisateurs en fonction du terme
  // de recherche fourni par l'utilisateur.
  //
  // Fonctions appelées :
  // - Aucune.
  // *******************************************************************
  // Méthode pour filtrer la liste des utilisateurs
  filterUsers(): void {
    if (this.searchTerm.trim()) {
      this.filteredUsers = this.allUsers.filter((user) =>
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = this.allUsers; // Affiche tous les utilisateurs si la barre de recherche est vide
    }
  }
}
