import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

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
    console.log(this.displayMode);
  }

  onPokemonClicked(event: any) {
    if (this.authService.isLoggedIn()) {
      console.log(`User is logged in. Pokemon ID ${event.id} clicked.`);
      this.clickedPokemonId = event.id;
    } else {
      console.log(`User is not logged in. Pokemon ID ${event.id} clicked.`);
      this.showLoginPopup();
    }
  }

  showLoginPopup() {
    alert("Please log in to interact with Pokémon.");
  }

  private formatImageUrl(id: number): string {
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
    return `${baseUrl}${id}.png`;
  }
}
