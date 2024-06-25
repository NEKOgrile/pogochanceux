import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe(response => {
      console.log('User logged in successfully', response);
      this.router.navigate(['/home']);  // Redirige vers la page d'accueil
    }, error => {
      console.error('Error logging in user', error);
    });
  }
}
