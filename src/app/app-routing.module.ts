import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChanceuxComponent } from './chanceux/chanceux.component';
import { ShinyComponent } from './shiny/shiny.component';
import { ObscureComponent } from './obscure/obscure.component';
import { AuthGuard } from './services/auth.guard';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { FriendsComponent } from './friends/friends.component';
import { OptionsComponent } from './options/options.component';

const routes: Routes = [
  { path: 'profile', component: ProfileEditComponent, children: [
    { path: 'edit', component: ProfileEditComponent },
    { path: 'friends', component: FriendsComponent },
    { path: 'options', component: OptionsComponent },
    { path: '', redirectTo: 'edit', pathMatch: 'full' }
]},
  { path: 'home', component: HomeComponent  }, //canActivate: [AuthGuard]
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chanceux', component: ChanceuxComponent },
  { path: 'shiny', component: ShinyComponent },
  { path: 'obscure', component: ObscureComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
