import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs/operators'; // Importer tap depuis rxjs/operators

interface Pokemon {
  id: string;
  name: string;
  primaryType: string;
  secondaryType: string | null;
  imageUrl: string;
  
}

@Component({
  selector: 'app-chanceux',
  templateUrl: './chanceux.component.html',
  styleUrls: ['./chanceux.component.scss']
})
export class ChanceuxComponent implements OnInit {
  userId: number | null = null;
  colClass: string = 'col-md-4';
  displayMode: string = 'default';
  pokemons: Pokemon[] = [];
  clickedPokemonId: string | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPokemonData();
  }

  loadPokemonData() {
    this.http.get<any[]>('https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json')
      .subscribe((data: any[]) => {
        this.pokemons = data.map(pokemon => ({
          id: pokemon.dexNr.toString().padStart(3, '0'),
          name: pokemon.names.French,
          primaryType: pokemon.primaryType.names.French,
          secondaryType: pokemon.secondaryType ? pokemon.secondaryType.names.French : null,
          imageUrl: this.formatImageUrl(pokemon.dexNr.toString())
        }));

        console.log('Pokemons chargés :', this.pokemons);
      });
  }

  setColumns(count: number) {
    this.colClass = `col-md-${12 / count}`;
    this.displayMode = (count === 6) ? 'compact' : 'default';
    
  }

  onPokemonClicked(event: any): void {
    if (this.authService.isLoggedIn()) {
      console.log(`User is logged in. Pokemon ID ${event.id} clicked.`);
      this.clickedPokemonId = event.id;

      // Récupérer l'ID de l'utilisateur
      this.authService.getUserId().pipe(
        tap(response => console.log('Réponse du service getUserId :', response))
      ).subscribe(
        (response: any) => {
          this.userId = response.id_user; // Supposant que la réponse contient un champ `id_user`
          console.log('ID de l\'utilisateur = ', this.userId);

          // Ajouter le Pokémon à la collection de l'utilisateur connecté
          this.authService.addPokemonToCollection(this.userId, parseInt(event.id, 10))
            .subscribe(
              () => {
                console.log(`Pokemon ID ${event.id} ajouté à la collection de l'utilisateur.`);
                // Mettre à jour l'affichage si nécessaire
              },
              (error: HttpErrorResponse) => { // Spécifier le type HttpErrorResponse si nécessaire
                console.error('Erreur lors de l\'ajout du Pokémon :', error);
                // Gérer les erreurs ici
              }
            );
        },
        (error: HttpErrorResponse) => { // Spécifier le type HttpErrorResponse si nécessaire
          console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur :', error);
          // Gérer les erreurs ici
        }
      );

    } else {
      console.log(`User is not logged in. Pokemon ID ${event.id} clicked.`);
      this.showLoginPopup();
    }
  }


  
  private formatImageUrl(id: string): string {
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
    return `${baseUrl}${id}.png`;
  }

  private showLoginPopup() {
    // Implémentez votre logique pour afficher une popup de connexion
    alert('Please log in to select this Pokemon.');
  }
}
