import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Pokemon {
  id: string;
  name: string;
  type: string; // Vous pouvez définir le type correct ici
  imageUrl: string; // URL de l'image du Pokémon
}

@Component({
  selector: 'app-chanceux',
  templateUrl: './chanceux.component.html',
  styleUrls: ['./chanceux.component.scss']
})
export class ChanceuxComponent implements OnInit {
  colClass: string = 'col-md-4'; // Par défaut, 3 cartes par ligne
  displayMode: string = 'default'; // Mode d'affichage par défaut
  pokemons: Pokemon[] = [];

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.loadPokemonData();
  }

  async loadPokemonData() {
    try {
      const data: any = await this.http.get('https://raw.githubusercontent.com/pokealarm/pokealarm/dev/locales/fr.json').toPromise();
      const pokemonData = data['pokemon'];
      const pokemonsArray: Pokemon[] = Object.keys(pokemonData).map(id => ({
        id: id,
        name: pokemonData[id],
        type: 'Unknown', // Vous pouvez définir le type plus tard si nécessaire
        imageUrl: this.formatImageUrl(parseInt(id)) // Formater l'URL de l'image
      }));

      // Trier pokemonsArray par ID en utilisant une fonction de comparaison numérique
      pokemonsArray.sort((a, b) => this.compareIds(a.id, b.id));

      console.log('Pokemons array:', pokemonsArray.map(p => p.id));
      this.pokemons = pokemonsArray;
    } catch (error) {
      console.error('Erreur lors du chargement des données Pokémon:', error);
      // Gestion des erreurs, par exemple afficher un message à l'utilisateur
    }
  }

  // Fonction pour comparer les IDs (tri numérique)
  private compareIds(idA: string, idB: string): number {
    const numA = parseInt(idA, 10);
    const numB = parseInt(idB, 10);

    // Si les deux IDs sont des nombres, les comparer numériquement
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }

    // Sinon, comparer les IDs comme des chaînes
    return idA.localeCompare(idB);
  }

  // Fonction pour formater l'URL de l'image du Pokémon
  private formatImageUrl(id: number): string {
    const baseUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';
    // Ne pas ajouter de zéro devant le numéro de l'ID
    return `${baseUrl}${id}.png`;
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
