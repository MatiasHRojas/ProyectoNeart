import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
//import { Usuario } from '../interfaces';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private servicio:HttpClient) { }

  /* -------- SESION -------- */

  Authenticate(datos:any):Observable<any>{
    return this.servicio.post(environment.servidor+"/Authenticate",datos);
  }

  LogOut(datos:any):Observable<any>{
    return this.servicio.post(environment.servidor+"/logout",datos);
  }
  
  CrearSesion(datos:any):Observable<any>{
    return this.servicio.post(environment.servidor+"/session",datos);
  } 

  /* --------   GET   -------- */

  GetUsuarios():Observable<any>{
    return this.servicio.get(environment.servidor+"/Usuarios");
  }

  GetUsername(id:number):Observable<any>{
    return this.servicio.get(environment.servidor + "/GetUsername/" + id);
  }

  GetIdArtistas():Observable<any>{
    return this.servicio.get(environment.servidor+"/IdArtistas");
  }

  GetArtistaById(id:number):Observable<any>{
    return this.servicio.get(environment.servidor+"/Artista/" + id);
  }

  GalleryImages(id:number):Observable<any>{
    return this.servicio.get(environment.servidor + "/GalleryImages/" + id)
  }

  GetUsuariosArtistas():Observable<any>{
    return this.servicio.get(environment.servidor+"/UsuariosArtistas");
  }

  GetArtistas():Observable<any>{
    return this.servicio.get(environment.servidor+"/Artistas");
  }

  GetNoticia(id:number):Observable<any>{
    return this.servicio.get(environment.servidor+"/Noticias/" + id);
  }

  GetNoticias():Observable<any>{
    return this.servicio.get(environment.servidor+"/Noticias");
  }

  GetEventos():Observable<any>{
    return this.servicio.get(environment.servidor+"/Eventos");
  }

  GetImgPerfil(id:number):Observable<any>{
    return this.servicio.get(environment.servidor+"/GetImgPerfil/" + id);
  }

  /* --------  PUT   -------- */

  ActualizarImg(datos:any):Observable<any>{
    return this.servicio.put(environment.servidor+"/ActualizarImg", datos);
  }

  ActualizarArtista(datos:any):Observable<any>{
    return this.servicio.put(environment.servidor+"/ActualizarArtista", datos);
  }

  /* --------  POST  -------- */

  AgregarUsuario(datos:any):Observable<any>{
    return this.servicio.post(environment.servidor+"/CrearUsuarios",datos);
  }

  AgregarArtista(datos:any):Observable<any>{
    return this.servicio.post(environment.servidor+"/CrearArtista",datos);
  }

  AgregarGaleria(datos:any):Observable<any>{
    return this.servicio.post(environment.servidor+"/CrearGaleria",datos);
  }

  SaveImg(datos:any):Observable<any>{
    return this.servicio.post(environment.servidor+"/SaveImg",datos);
  }

  /* -------- DELETE -------- */

  EliminarImg(id:number, posicion:number):Observable<any>{
    return this.servicio.delete(environment.servidor+"/EliminarImg/" + id + "/" + posicion);
  }
  
}