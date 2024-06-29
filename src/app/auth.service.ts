import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

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
}
