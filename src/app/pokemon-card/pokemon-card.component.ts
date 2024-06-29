import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon: any;
  @Input() type!: string;
  @Input() displayMode: string = 'default'; // Ajoutez cette ligne
  @Output() pokemonClicked = new EventEmitter<any>();
  

  constructor() {}

  onCardClick() {
    this.pokemonClicked.emit({ id: this.pokemon.id });
  }

  getHeaderClass(): string {
    if (this.pokemon.secondaryType != null) {
      return `${this.pokemon.primaryType.toLowerCase()}-header-${this.pokemon.secondaryType.toLowerCase()}-header`;
    } else if (this.pokemon.secondaryType == null) {
      return `${this.pokemon.primaryType.toLowerCase()}-header`;
    } else {
      return '';
    }
  }

  getCardBodyStyles() {
    let styles = {};

    if (this.pokemon.primaryType && this.pokemon.secondaryType) {
      styles = {
        'background': `linear-gradient(to bottom right, var(--${this.pokemon.primaryType}), var(--${this.pokemon.secondaryType}))`
      };
    } else if (this.pokemon.primaryType) {
      styles = {
        'background-color': `var(--${this.pokemon.primaryType})`
      };
    }

    return styles;
  }

  getBorderClass(): string {
    if (this.pokemon.primaryType && this.pokemon.secondaryType) {
      return `${this.pokemon.primaryType.toLowerCase()}-card ${this.pokemon.secondaryType.toLowerCase()}-card`;
    } else if (this.pokemon.primaryType) {
      return `${this.pokemon.primaryType.toLowerCase()}-card`;
    } else {
      return '';
    }
  }
  
}
