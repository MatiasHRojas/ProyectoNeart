import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/Servicios/user.service';

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss']
})
export class NoticiaComponent implements OnInit {

  ID:number = -1;
  id:number = 0;
  noticia:any;
  Noticias:Array<any> = new Array();

  constructor(private ruta:ActivatedRoute, private servicio:UserService) {
    this.ruta.params.subscribe(datos=>{
      this.id = datos["id"];
    })
    console.log(this.id);
  }

  ngOnInit(): void {

    this.scroll();

    this.servicio.GetNoticia(this.id).subscribe(news=>{
      if(news[0] != null){
        this.noticia = news[0];
        this.ID = news[0].id;
        console.log(this.noticia.titulo);
      } else {
        console.log("noticia no existe");
      }
    })

    this.servicio.GetNoticias().subscribe(noticias=>{
      for(let i=0; i < noticias.length; i++){
        if(noticias[i].id != this.ID){
          this.Noticias.push(noticias[i]);
        }
      }
    })


  }

  recargar(){
    setTimeout(() => {
      location.reload();
    }, 500);
  }

  scroll(){
    window.scroll({
      top:0,
      behavior: 'smooth'
    });
  }



}
