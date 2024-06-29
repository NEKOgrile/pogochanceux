import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemon: any;
  @Output() pokemonClicked = new EventEmitter<any>();
  @Input() displayMode: string = 'default';

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
}
