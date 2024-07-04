import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { tap } from 'rxjs/operators';

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
  styleUrls: ['./chanceux.component.scss'],
})
export class ChanceuxComponent implements OnInit {
  userId: number | null = null;
  colClass: string = 'col-md-4';
  displayMode: string = 'default';
  pokemons: Pokemon[] = [];
  clickedPokemonId: string | null = null;
  userPokemonIds: string[] = []; // Changed to string[]

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {


    if (this.authService.isLoggedIn()) {
      if (this.userId === null) {
        this.authService.getUserId().pipe(
          tap((response: any) => {
            console.log('Réponse du service getUserId :', response);
            this.userId = response.id_user; // Mettre à jour this.userId avec la valeur reçue
            console.log('L\'ID est pris par la fonction = ', this.userId);
          }),
        ).subscribe();
      } else {
        console.log("L'ID est déjà dans une variable locale :", this.userId);
      }
    }
  

    this.loadPokemonData();

    if (this.authService.isLoggedIn()) {
      this.authService
        .getUserId()
        .pipe(
          tap((response) =>
            console.log('Réponse du service getUserId :', response)
          )
        )
        .subscribe(
          (response: any) => {
            this.userId = response.id_user; // Utilisation de response.id_user pour récupérer l'ID utilisateur

            this.authService.getUserPokemons(this.userId).subscribe(
              (data: any) => {
                this.userPokemonIds = data.pokemon_ids.map((id: number) =>
                  id.toString().padStart(3, '0')
                ); // Mettre à jour les IDs des Pokémon et les formater comme des chaînes avec zéros de remplissage

                this.applyLuckyClassToPokemons(); // Appliquer la classe CSS aux Pokémon chanceux
              },
              (error: HttpErrorResponse) => {
                console.error(
                  "Erreur lors de la récupération des Pokémon de l'utilisateur :",
                  error
                );
              }
            );
          },
          (error: HttpErrorResponse) => {
            console.error(
              "Erreur lors de la récupération de l'ID de l'utilisateur :",
              error
            );
          }
        );
    }
  }

  loadPokemonData() {
    this.http
      .get<any[]>(
        'https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json'
      )
      .subscribe((data: any[]) => {
        this.pokemons = data.map((pokemon) => ({
          id: pokemon.dexNr.toString().padStart(3, '0'),
          name: pokemon.names.French,
          primaryType: pokemon.primaryType.names.French,
          secondaryType: pokemon.secondaryType
            ? pokemon.secondaryType.names.French
            : null,
          imageUrl: this.formatImageUrl(pokemon.dexNr.toString()),
        }));

        console.log('Pokemons chargés :', this.pokemons);
        this.applyLuckyClassToPokemons();
      });
  }

  setColumns(count: number) {
    this.colClass = `col-md-${12 / count}`;
    this.displayMode = count === 6 ? 'compact' : 'default';
  }
  

  onPokemonClicked(event: any): void {
    if (this.authService.isLoggedIn()) {
      console.log(`User is logged in. Pokemon ID ${event.id} clicked.`);
      this.clickedPokemonId = event.id;
  
      if (!this.userId) {
        console.error("L'ID de l'utilisateur n'est pas défini.");
        return;
      }
  
      const pokemonId = event.id;
  
      if (this.userPokemonIds.includes(pokemonId)) {
        // Si le Pokémon est déjà chanceux, le retirer
        console.log(this.userPokemonIds);
        this.userPokemonIds = this.userPokemonIds.filter(
          (id) => id !== pokemonId
        );
        console.log(this.userPokemonIds);
        const updatedUserPokemonIdsText = this.userPokemonIds
          .map((id) => parseInt(id, 10))
          .join(',');
        this.authService
          .UpdatePokemonFromCollection(this.userId, updatedUserPokemonIdsText)
          .subscribe(
            (response: any) => {
              console.log(
                `Pokemon ID ${event.id} retiré de la collection de l'utilisateur.`
              );
              this.userPokemonIds = this.userPokemonIds.filter(
                (id) => id !== pokemonId
              );
              this.removeLuckyClassFromPokemon(pokemonId);
            },
            (error: HttpErrorResponse) => {
              console.error(
                "Erreur lors du retrait du Pokémon :",
                error
              );
            }
          );
      } else {
        // Sinon, l'ajouter comme chanceux
        this.authService
          .addPokemonToCollection(this.userId, parseInt(pokemonId, 10))
          .subscribe(
            (response: any) => {
              console.log(
                `Pokemon ID ${event.id} ajouté à la collection de l'utilisateur.`
              );
              this.userPokemonIds.push(pokemonId);
              this.applyLuckyClassToPokemon(pokemonId);
            },
            (error: HttpErrorResponse) => {
              console.error("Erreur lors de l'ajout du Pokémon :", error);
            }
          );
      }
    } else {
      console.log(`User is not logged in. Pokemon ID ${event.id} clicked.`);
      this.showLoginPopup();
    }
  }
  

  applyLuckyClassToPokemons(): void {
    this.userPokemonIds.forEach((pokemonId) => {
      const idNumber = parseInt(pokemonId, 10); // Convertir en nombre
      this.applyLuckyClassToPokemon(idNumber);
    });
  }
  

  applyLuckyClassToPokemon(pokemonId: number): void {
    const pokemonElement = document.getElementById(`pokemon-${pokemonId.toString()}`);
    if (pokemonElement) {
      pokemonElement.classList.add('lucky-pokemon');
    }
  }
  
  removeLuckyClassFromPokemon(pokemonId: number): void {
    const pokemonElement = document.getElementById(`pokemon-${pokemonId.toString()}`);
    if (pokemonElement) {
      pokemonElement.classList.remove('lucky-pokemon');
    }
  }
  
  private formatImageUrl(id: string): string {
    const baseUrl =
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
    return `${baseUrl}${parseInt(id, 10)}.png`; // Changed to use numeric ID
  }

  private showLoginPopup() {
    alert('Please log in to select this Pokemon.');
  }

  parseId(id: any): number {
    return parseInt(id, 10);
  }
}
