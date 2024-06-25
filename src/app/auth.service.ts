import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('username', username);
        }
      })
    );
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('username');
    }
  }

  isLoggedIn(): boolean {
    return typeof localStorage !== 'undefined' && localStorage.getItem('username') !== null;
  }

  getUsername(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('username') : null;
  }
}
