import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chanceux',
  templateUrl: './chanceux.component.html',
  styleUrls: ['./chanceux.component.scss']
})
export class ChanceuxComponent implements OnInit {
  colClass: string = 'col-md-4'; // Default 3 cards per row
  displayMode: string = 'default'; // Default display mode
  pokemons = [
    { id: 1, name: 'Pikachu', type: 'Electric', imageUrl: 'assets/images/pikachu.png' },
    { id: 2, name: 'Charmander', type: 'Fire', imageUrl: 'assets/images/charmander.png' },
    { id: 3, name: 'Bulbasaur', type: 'Grass', imageUrl: 'assets/images/bulbasaur.png' },
    // Ajoutez plus de données Pokémon ici...
  ];

  constructor() {}

  ngOnInit(): void {}

  setColumns(count: number) {
    this.colClass = `col-md-${12 / count}`;
    this.displayMode = (count === 6 || count === 12) ? 'compact' : 'default';
  }

  onPokemonClicked(event: any) {
    console.log(`Pokemon ID ${event.id} de type ${event.type} cliqué`);
    // Logique pour ajouter à la base de données ou autre traitement
  }
}
