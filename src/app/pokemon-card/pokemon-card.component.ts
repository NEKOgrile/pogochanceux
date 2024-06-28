import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon: any;
  @Input() type!: string; // Utilisation de l'opérateur de non-nullité pour indiquer que cette propriété sera initialisée plus tard.
  @Output() pokemonClicked = new EventEmitter<any>();
  @Input() displayMode: string = 'default'; // Ajoutez cette ligne

  onCardClick() {
    this.pokemonClicked.emit({ id: this.pokemon.id, type: this.type });
  }
}
