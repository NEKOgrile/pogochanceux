import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  constructor(private router: Router) {}

  onTabChange(event: any): void {
    switch (event.index) {
      case 0:
        this.router.navigate(['profile/edit']);
        break;
      case 1:
        this.router.navigate(['profile/friends']);
        break;
      case 2:
        this.router.navigate(['profile/options']);
        break;
      default:
        this.router.navigate(['profile/edit']);
        break;
    }
  }
}
