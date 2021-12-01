import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistaComponent } from './Componentes/artista/artista.component';
import { HomeComponent } from './Componentes/home/home.component';

import { LoginComponent } from './Componentes/login/login.component';
import { NoticiaComponent } from './Componentes/noticia/noticia.component';
import { RegisterComponent } from './Componentes/register/register.component';

const routes: Routes = [
  {path:"",component:HomeComponent},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"artist/:username",component:ArtistaComponent},
  {path:"news/:id",component:NoticiaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
