import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { log } from 'console';

@Component({
  selector: 'app-chanceux',
  templateUrl: './chanceux.component.html',
  styleUrls: ['./chanceux.component.scss']
})
export class ChanceuxComponent implements OnInit {
  colClass: string = 'col-md-4'; // Default 3 cards per row
  displayMode: string = 'default'; // Default display mode
  pokemons: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPokemonData();
  }


  loadPokemonData() {
    this.http.get('https://raw.githubusercontent.com/pokealarm/pokealarm/dev/locales/fr.json')
      .subscribe((data: any) => {
        const pokemonData = data['pokemon'];
        const pokemonsArray = Object.keys(pokemonData).map(id => ({
          id: id,
          name: pokemonData[id],
          type: 'Unknown', // Vous pouvez définir le type plus tard si nécessaire
          imageUrl: `` // Suppose que les images sont nommées par ID
          
        }));

        // Afficher les IDs dans la console
        console.log('poekmno id', pokemonData['001'])
        console.log('Pokemons array:', pokemonsArray.map(p => p.id));
        this.pokemons = pokemonsArray;
      });
  }

  

  setColumns(count: number) {
    this.colClass = `col-md-${12 / count}`;
    this.displayMode = (count === 6 || count === 12) ? 'compact' : 'default';
  }

  onPokemonClicked(event: any) {
    console.log(`Pokemon ID ${event.id} de type ${event.type} cliqué`);
    // Logique pour ajouter à la base de données ou autre traitement
  }
}
