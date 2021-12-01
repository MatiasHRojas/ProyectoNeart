import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LogIn } from 'src/app/interfaces';
import { ConnectionService } from 'src/app/Servicios/connection.service';
import { UserService } from 'src/app/Servicios/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formulario:FormGroup;

  constructor(private ServicioUsuario:UserService, private ConnectionServ:ConnectionService, public Form:FormBuilder, private router:Router) { 
    this.formulario=Form.group({
      "username":["", Validators.required],
      "password":["", Validators.required]
    })
  }

  ngOnInit(): void {
    this.ServicioUsuario.GetUsuarios().subscribe(datos=>{
      for(let i=0; i<datos.length; i++){
        console.log(datos[i].username);
      }
    })
  }

  validarLogin(){
    let user:any = this.formulario.value.username;
    let pass:any = this.formulario.value.password;

    let login:LogIn = {
      username:user,
      password:pass
    }
    console.log(login);
    //
    this.ServicioUsuario.Authenticate(login).subscribe(datos=>{
      if(datos.loggedin){
        this.ConnectionServ.LogIn(datos);
        let nuevaSesion = {
          name:datos.name,
          id:datos.ident,
        }
        this.ServicioUsuario.CrearSesion(nuevaSesion).subscribe();
        console.log("Inicio de sesion correcto.");
        console.log("Usuario en linea: " + datos.name);
        console.log("ID: " + datos.ident);
        if(datos.type == 0){
          console.log("Tipo: Regular");
        }else{
          console.log("Tipo: Artist");
        }
        this.router.navigate(['/artist',datos.name]);
      }else{
        console.log("Error al iniciar sesion.");
      }
    });
    console.log("- submit -");
  }

}