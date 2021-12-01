import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from 'src/app/Servicios/user.service';
import { Subscription } from 'rxjs';
import { ConnectionService } from 'src/app/Servicios/connection.service';

@Component({
  selector: 'app-artista',
  templateUrl: './artista.component.html',
  styleUrls: ['./artista.component.scss']
})

export class ArtistaComponent implements OnInit {

  agregarFotos:FormGroup;
  eliminarFotos:FormGroup;

  flag:number = -1;
  perfil:boolean = false; // true = permite editar
  tipoPerfil:number;
  usuarioRegular:any;
  activarPerfilRegular = false;

  submitProfileImg:boolean = false;
  editar:boolean = false;

  botonActivo: boolean = false;
  Id:any;
  Nombre:any;
  username:string = '';
  cantidad:number = 0 ;
  artista:any;

  posiciones:Array<number> = new Array();

  private loginRef:Subscription;
  private logoutRef:Subscription;
  session:any;
  
  constructor(private ruta:ActivatedRoute, private servicio:UserService, private ConnectionServ:ConnectionService, public Form:FormBuilder) {

    this.ruta.params.subscribe(datos=>{
      this.username=datos["username"];
    })

    //verificar login
    this.session = this.ConnectionServ.GetSession();
    this.tipoPerfil = this.session.type;
    if(this.session.type == 1){
      if(this.username === this.session.name){
        console.log(this.username);
        this.perfil = true;
      }
      console.log("Sesión de artista activa: " + this.session.name + "(ID: " + this.session.id + ")");
    }else{
      if(this.session.type == 0){
        if(this.username === this.session.name){
          console.log(this.username);
          this.activarPerfilRegular = true;
        } else {
          this.flag = -1;
        } 
        console.log("Sesión regular activa: " + this.session.name + "(ID: " + this.session.id + ")");
      }else{
        console.log("Sesión inactiva: " + this.session.name + "(ID: " + this.session.id + ")");
      }
      this.perfil = false;
    }
    //subscribe to login
    //in
    this.loginRef = this.ConnectionServ.login.subscribe(()=>{
      this.session = this.ConnectionServ.GetSession();
      if(this.session.type == 1){
        this.perfil = true;
        console.log("Sesión de artista activa: " + this.session.name + "(ID: " + this.session.id + ")");
      }else{
        this.perfil = false;
        console.log("Sesión regular activa: " + this.session.name + "(ID: " + this.session.id + ")");
      }
    })
    //out
    this.logoutRef = this.ConnectionServ.logout.subscribe(()=>{
      this.perfil = false;
      console.log("> Se ha cerrado la sesión en artista.");
    })
    //
    
    this.agregarFotos=Form.group({
      "file":["", Validators.required],
      "posicion":["", [Validators.required, Validators.max(9), Validators.min(0)]]
    })

    this.eliminarFotos=Form.group({
      "posEliminar":["", [Validators.required, Validators.max(9), Validators.min(0)]]
    })

    console.log(this.username);
  }

  ngOnInit(): void {

    this.scroll();

    this.servicio.GetUsuarios().subscribe(datos=>{
      
      for(let i=0; i<datos.length; i++){
        if(this.username === datos[i].username){
          if(datos[i].profile == 1){
            this.tipoPerfil = 1;
            this.Nombre = this.username;
            this.Id = datos[i].id;
            this.guardarPosiciones();
            console.log(this.posiciones);
            this.flag = 1;
          } else {
            if(this.username === this.session.name){
              this.flag = 0;
              this.usuarioRegular = datos[i];
            } else {
              this.flag = -1;
            }
          }
        }
      }
      console.log(this.flag);

      if(this.flag == -1){
        console.log("no existe");
      } else if(this.flag == 1) {
        console.log(this.Nombre + ' ' + this.Id);
        this.cargarFotos();
        this.botonActivo = false; 
      } else {
        console.log("usuario regulars")
      }
      
      this.servicio.GetArtistaById(this.Id).subscribe(datos=>{
        this.artista = datos[0];
        console.log(datos)
      })

      this.guardarPosiciones();
    })  

    //this.imageInfos=this.servicio.getFiles();
  }



  scroll(){
    window.scroll({
      top:0,
      behavior: 'smooth'
    });
  }

  editarImgPerfil(){
    let imagen:File;
    let archivo:any = document.getElementById("filePerfil");

    let x:any = archivo.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(x);

    reader.onload = (e: any) => {
      imagen = e.target.result;

      let datos={
        id: this.Id,
        posicion: 0,
        imagen: imagen
      }

      this.servicio.ActualizarImg(datos).subscribe((event: any)=>{
      });
      
      //this.recargar();
    };
  }

  /*
  quitarImgs(){
    this.guardarPosiciones();
    for(let i=0; i < this.posiciones.length; i++){
      let li:any = document.getElementById(`li${this.posiciones[i]}`);
      let img:any = document.getElementById(`idImg${this.posiciones[i]}`);
      let x:any = li.removeChild(img);

    }
  }
*/
  cargarFotos(){
    if (this.Id == 0) {
      console.log("no hay fotos");
      return;
    }

    this.servicio.GalleryImages(this.Id).subscribe(datos=>{

      let x:number = 0;
      console.log(datos.length);
      if (datos.length > 0){
        if(datos[0] != null){
          let img:any = document.getElementById("imgPerfil");
          if(datos[0].posicion == 0){ 
            img.src = datos[0].imagen;
            x = 1;
          } else {
            img.src = '../../../assets/imgperfil.png';
          }
        }
      } else {
        let img:any = document.getElementById("imgPerfil");
        img.src = '../../../assets/imgperfil.png';
      }
      
      for(let i=x; i < datos.length; i++){
        let li:any = document.getElementById(`li${datos[i].posicion}`);
        let img:any = document.createElement('img');

        img.src = datos[i].imagen;
        img.style.width = "190px";
        img.style.height = "190px";
        img.style.borderRadius = "15px";
        img.id = `idImg${i}`;
        li.appendChild(img);
      }
      
      this.cantidad = datos.length;
      console.log(this.cantidad);
    })
    
  }

  guardarPosiciones(){
    this.servicio.GalleryImages(this.Id).subscribe(datos=>{
      this.posiciones.length = 0;
      for(let i=0; i<datos.length; i++){
        if(datos[i].posicion != 0)
        this.posiciones.push(datos[i].posicion);
      }
    })
  }

  recargar(){
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  guardarCambios(){
    let nombre:any = document.getElementById("nombrePerfil");
    let desc:any = document.getElementById("descripcionPerfil");
    if(nombre.value && desc.value){
      let datos={
        id:this.Id,
        nombre:nombre.value,
        descripcion:desc.value
      }
      this.servicio.ActualizarArtista(datos).subscribe((event: any)=>{
      });
    }
  }

  eliminar(){
    let posEliminar:any = document.getElementById("posEliminar");
    this.servicio.EliminarImg(this.Id, posEliminar.value).subscribe((event: any)=>{
    });
    
  }

  eliminarImg(num:number){
    this.servicio.EliminarImg(this.Id, num).subscribe((event: any)=>{
    });
  }

  agregar(){

    this.posiciones.length = 0;
    this.guardarPosiciones();
    console.log(this.posiciones)
    
    let imagen:File;
    let archivo:any = document.getElementById("file");
    let posicion:any = document.getElementById("posicion");
    let pos:number = posicion.value;

    let x:any = archivo.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(x);

    let datos:any;
    reader.onload = (e: any) => {
      this.botonActivo = false;
      imagen = e.target.result;
      datos={
        id: this.Id,
        posicion: pos,
        imagen: imagen
      }

      this.guardarPosiciones();
      console.log(this.posiciones);
      
      this.servicio.EliminarImg(datos.id, datos.posicion).subscribe((event: any)=>{
        this.servicio.SaveImg(datos).subscribe((event: any)=>{
        });
      });
      
      //this.recargar();
    };
    
    }

/*
  selectArchivos(event: any): void { 
    this.selectedFiles = event.target.files;
    
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => { 
          this.Imagenes.push(e.target.result);
        };
        
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }

  SubirArchivos(): void {
    if (this.selectedFiles) {
      console.log(this.selectedFiles.length);
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  subir(idx: number, file: File): void {
    if (file) {
      const formData: FormData = new FormData();
      formData.append('file', file);
    }
  }

  upload(idx: number, file: File): void {
    console.log(idx);
    if (file) {
      this.servicio.upload(file).subscribe((event: any)=>{
      });
    }
  }

  uploadd(file: File): void {
    if (file) {
      this.servicio.upload(file).subscribe((event: any)=>{
      });
    }
  }


*/
}