import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = ''; // Ajout de la propriété errorMessage

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    const user = { username: this.username, password: this.password };
    this.http.post('http://localhost:3000/api/register', user).subscribe(
      (response: any) => {
        // Redirection vers la page d'accueil après un enregistrement réussi
        this.router.navigate(['/home']);
      },
      (error: any) => {
        this.errorMessage = error.error.message;
      }
    );
  }
}
