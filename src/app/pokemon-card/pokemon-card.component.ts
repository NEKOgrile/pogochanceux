import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon: any;
  @Input() type!: string;
  @Input() displayMode: string = 'default'; // Default display mode
  @Output() pokemonClicked = new EventEmitter<any>();

  onCardClick() {
    this.pokemonClicked.emit({ id: this.pokemon.id, type: this.type });
  }
}
