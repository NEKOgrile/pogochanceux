import { Component, Input, OnInit, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
  encapsulation: ViewEncapsulation.None
  
})
export class PokemonCardComponent implements OnInit{
  @Input() pokemon: any;
  @Input() type!: string;
  @Input() displayMode: string = 'default';
  @Input() isClicked: boolean = false;
  @Output() pokemonClicked = new EventEmitter<any>();

  darkMode: boolean = false; // Variable pour suivre l'état du mode sombre

  constructor() {}
  ngOnInit(): void {
    const darkMode = localStorage.getItem('darkMode');
    this.darkMode = darkMode === 'true'; // Convertir en boolean (true ou false)
    
  }




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
