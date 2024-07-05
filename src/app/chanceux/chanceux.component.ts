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
  filteredPokemons: Pokemon[] = [];
  clickedPokemonId: string | null = null;
  userPokemonIds: string[] = [];
  searchQuery: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      if (this.userId === null) {
        this.authService.getUserId().pipe(
          tap((response: any) => {
            this.userId = response.id_user;
          }),
        ).subscribe();
      }
    }
    this.loadPokemonData();
    if (this.authService.isLoggedIn()) {
      this.authService.getUserId().pipe(
        tap((response) => console.log('Réponse du service getUserId :', response))
      ).subscribe(
        (response: any) => {
          this.userId = response.id_user;
          this.authService.getUserPokemons(this.userId).subscribe(
            (data: any) => {
              this.userPokemonIds = data.pokemon_ids.map((id: number) =>
                id.toString().padStart(3, '0')
              );
              this.applyLuckyClassToPokemons();
            },
            (error: HttpErrorResponse) => {
              console.error("Erreur lors de la récupération des Pokémon de l'utilisateur :", error);
            }
          );
        },
        (error: HttpErrorResponse) => {
          console.error("Erreur lors de la récupération de l'ID de l'utilisateur :", error);
        }
      );
    }
  }

  loadPokemonData() {
    this.http.get<any[]>(
      'https://pokemon-go-api.github.io/pokemon-go-api/api/pokedex.json'
    ).subscribe((data: any[]) => {
      this.pokemons = data.map((pokemon) => ({
        id: pokemon.dexNr.toString().padStart(3, '0'),
        name: pokemon.names.French,
        primaryType: pokemon.primaryType.names.French,
        secondaryType: pokemon.secondaryType
          ? pokemon.secondaryType.names.French
          : null,
        imageUrl: this.formatImageUrl(pokemon.dexNr.toString()),
      }));
      this.filteredPokemons = this.pokemons;
      this.applyLuckyClassToPokemons();
    });
  }

  setColumns(count: number) {
    this.colClass = `col-md-${12 / count}`;
    this.displayMode = count === 6 ? 'compact' : 'default';
  }

  onPokemonClicked(event: any): void {
    if (this.authService.isLoggedIn()) {
      this.clickedPokemonId = event.id;
      if (!this.userId) {
        console.error("L'ID de l'utilisateur n'est pas défini.");
        return;
      }
      const pokemonId = event.id;
      if (this.userPokemonIds.includes(pokemonId)) {
        this.userPokemonIds = this.userPokemonIds.filter((id) => id !== pokemonId);
        const updatedUserPokemonIdsText = this.userPokemonIds
          .map((id) => parseInt(id, 10))
          .join(',');
        this.authService.UpdatePokemonFromCollection(this.userId, updatedUserPokemonIdsText).subscribe(
          (response: any) => {
            this.userPokemonIds = this.userPokemonIds.filter((id) => id !== pokemonId);
            this.removeLuckyClassFromPokemon(pokemonId);
          },
          (error: HttpErrorResponse) => {
            console.error("Erreur lors du retrait du Pokémon :", error);
          }
        );
      } else {
        this.authService.addPokemonToCollection(this.userId, parseInt(pokemonId, 10)).subscribe(
          (response: any) => {
            this.userPokemonIds.push(pokemonId);
            this.applyLuckyClassToPokemon(pokemonId);
          },
          (error: HttpErrorResponse) => {
            console.error("Erreur lors de l'ajout du Pokémon :", error);
          }
        );
      }
    } else {
      this.showLoginPopup();
    }
  }

  applyLuckyClassToPokemons(): void {
    this.userPokemonIds.forEach((pokemonId) => {
      const idNumber = parseInt(pokemonId, 10);
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
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
    return `${baseUrl}${parseInt(id, 10)}.png`;
  }

  private showLoginPopup() {
    alert('Please log in to select this Pokemon.');
  }

  parseId(id: any): number {
    return parseInt(id, 10);
  }

  filterPokemons() {
    if (!this.searchQuery) {
      this.filteredPokemons = this.pokemons;
      return;
    }

    const ids = this.searchQuery.split(',').map(id => id.trim().padStart(3, '0'));
    this.filteredPokemons = this.pokemons.filter(pokemon => ids.includes(pokemon.id));
  }
}
