import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Artista } from 'src/app/interfaces';
//import { Usuario } from 'src/app/interfaces';
import { UserService } from 'src/app/Servicios/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formulario:FormGroup;

  mails:Array<string> = new Array(); //mails registrados
  usernames:Array<string> = new Array(); //usernames registrados

  flagUser = true; //nombre de usuario disponible
  flagEmail = true; //email disponible
  success = false; //al guardar


  msj={
    e_username:"This username is already taken. Try a new one.",
    e_email:"This email is already registered, try to log in.",
    success:"Thank you, you have registered successfully."
  }
  
  tooltip={
    publico:"Descripción perfil públicooooo",
    artista:"Descripción perfil artistaaaaaaa"
  }

  constructor(private ServicioUsuario:UserService, public Form:FormBuilder, private router:Router) {
    this.formulario=Form.group({
      "username":["", Validators.required],
      "email":["", Validators.required],
      "password":["", Validators.required],
      "tipoPerfil":["", Validators.required]
    })
  }
  
  ngOnInit(): void {
    //crear el arreglo de usuarios registrados
    this.ServicioUsuario.GetUsuarios().subscribe(datos=>{
      for(let i=0; i<datos.length; i++){
        this.usernames.push(datos[i].username);
      }
    })

    //crear el arreglo de emails registrados
    this.ServicioUsuario.GetUsuarios().subscribe(datos=>{
      for(let i=0; i<datos.length; i++){
        this.mails.push(datos[i].email);
      }
    })

  }

  validarSubmit(){

    let username:any = this.formulario.value.username;
    let email:any = this.formulario.value.email;
    let pass:any = this.formulario.value.password;
    let perfil:number = this.formulario.value.tipoPerfil;

    if(!this.check_U(username)){
      //no existe el usuario en los registros
      if(!this.check_E(email)){
        //no existe el email en los registros
        //entonces, se guarda
        let newUser = ({
          username:username,
          email:email,
          password:pass,
          profile:perfil
        }); 
        
        console.log(newUser);
        this.ServicioUsuario.AgregarUsuario(newUser).subscribe(data=>{ 
          if(data == false){
            console.log("Fallo al registrarse.");
          }else{
              //se agrega a las listas
              this.usernames.push(username);
              this.mails.push(email);
              //se avisa
              this.success = true;
              if(perfil == 0){
                console.log("Registrado correctamente. Perfil Regular.");
                //crear perfil de usuario regular
              }else{
                console.log("Registrado correctamente. Perfil Artista.");
                //crear el perfil de artista
                this.addReferences(newUser);
              }
              this.router.navigate(['/login']);
          }

        });
      } else {
        //ya existe el correo
        this.flagEmail = false;
      }
    } else {
      //ya existe el usuario
      this.flagUser = false;
    }
  }

  addReferences(newUser:any){

    let id:number = -2;
    this.ServicioUsuario.GetUsuarios().subscribe(datos=>{
      for(let i=0; i < datos.length; i++){
        if(datos[i].username === newUser.username){
          id = datos[i].id;
        }
      }

      let newArtist:Artista={
        id : id,
        username : newUser.username,
        nombre : newUser.username,
        descripcion : "Nuevo Artista",
        img :"imgperfil.png"
      }
  
      console.log(newArtist);
  
      this.ServicioUsuario.AgregarArtista(newArtist).subscribe((event: any)=>{
      });
  
      let newGallery={
        id : newArtist.id,
        posicion : 0,
        imagen : "../../../assets/imgperfil.png"
      }
  
      this.ServicioUsuario.AgregarGaleria(newGallery).subscribe((event: any)=>{
      });
    });
    
  }

  check_E(email:string):boolean{
    let flag:boolean = false; //asume que no existe
    
    for(let i=0; i < this.mails.length; i++){
      if(email === this.mails[i]){
        flag = true; //lo encontró
        break;
      }
    }
    return flag;
  }

  check_U(username:string):boolean{
    let flag:boolean = false;
    
    for(let i=0; i < this.usernames.length; i++){
      if(username == this.usernames[i]){
        flag = true;
        break;
      }
    }
    return flag;
  }
}