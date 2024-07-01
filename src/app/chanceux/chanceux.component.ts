import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    console.log(`Pokemon ID ${event.id} de type ${event.primaryType} cliqué`);
  }

    // Fonction pour formater l'URL de l'image du Pokémon
    private formatImageUrl(id: number): string {
      const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
      // Ne pas ajouter de zéro devant le numéro de l'ID
      return `${baseUrl}${id}.png`;
    }

}
