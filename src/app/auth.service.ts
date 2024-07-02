import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  // BehaviorSubject pour l'état d'authentification
  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Initialisation de l'état d'authentification au chargement du service
    this.isLoggedInSubject.next(this.isLoggedIn());
  }

  // Méthode pour s'abonner aux changements d'état d'authentification
  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('username', username);
          this.isLoggedInSubject.next(true); // Mettre à jour l'état d'authentification
        }
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('username');
      this.isLoggedInSubject.next(false); // Mettre à jour l'état d'authentification
    }
  }

  isLoggedIn(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem('username') !== null;
  }

  getUsername(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('username') : null;
  }

  getUserId(): any {
    if (typeof localStorage !== 'undefined') {
      return this.http.post(`${this.apiUrl}/select-id-user`, { user_name: localStorage.getItem('username') });
    } else {
      return null;
    }
  }

  addPokemonToCollection(userId: any, pokemonId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/select-pokemon`, { user_id: userId, pokemon_id: pokemonId });
  }



  getUserPokemons(userid : any): any {
    if (typeof localStorage !== 'undefined') {
      return this.http.post(`${this.apiUrl}/select-user-pokemon`, { user_id: userid });
    } else {
      return null;
    }
  }

  UpdatePokemonFromCollection(userId: any, pokemonId: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-user-pokemons`, { userId, pokemonId });
  }
} 
