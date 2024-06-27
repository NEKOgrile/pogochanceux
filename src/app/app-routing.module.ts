import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChanceuxComponent } from './chanceux/chanceux.component';
import { ShinyComponent } from './shiny/shiny.component';
import { ObscureComponent } from './obscure/obscure.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
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
