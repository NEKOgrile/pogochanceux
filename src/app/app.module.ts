import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { ChanceuxComponent } from './chanceux/chanceux.component';
import { ShinyComponent } from './shiny/shiny.component';
import { ObscureComponent } from './obscure/obscure.component';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { FriendsComponent } from './friends/friends.component';
import { OptionsComponent } from './options/options.component';
import { ProfileComponent } from './profile/profile.component';
import { MatTabsModule } from '@angular/material/tabs'; // Importez le module MatTabsModule


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    ChanceuxComponent,
    ShinyComponent,
    ObscureComponent,
    PokemonCardComponent,
    ProfileEditComponent,
    FriendsComponent,
    OptionsComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatTabsModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
