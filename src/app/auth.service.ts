import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.isLoggedInSubject.next(this.isLoggedIn());
  }

  isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('username', username);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('username');
      this.isLoggedInSubject.next(false);
    }
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && localStorage.getItem('username') !== null;
  }

  getUsername(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('username') : null;
  }

  getUserId(): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      return this.http.post(`${this.apiUrl}/select-id-user`, { user_name: localStorage.getItem('username') });
    } else {
      return null;
    }
  }

  addPokemonToCollection(userId: any, pokemonId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/select-pokemon`, { user_id: userId, pokemon_id: pokemonId });
  }

  getUserPokemons(userid: any): any {
    if (typeof window !== 'undefined' && window.localStorage) {
      return this.http.post(`${this.apiUrl}/select-user-pokemon`, { user_id: userid });
    } else {
      return null;
    }
  }

  UpdatePokemonFromCollection(userId: any, pokemonId: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/update-user-pokemons`, { userId, pokemonId });
  }
  searchUsers(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/search`, { params: { username } });
  }

  getFriendRequests(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/friends/requests/${userId}`);
  }

  sendFriendRequest(userId: string, friendId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/request`, { userId, friendId });
  }

  acceptFriendRequest(userId: string, friendId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/accept`, { userId, friendId });
  }

  rejectFriendRequest(userId: string, friendId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/friends/reject`, { userId, friendId });
  }
  

}
