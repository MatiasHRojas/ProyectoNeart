import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { UserService } from 'src/app/Servicios/user.service';
import { Artista, Noticia, Team, Username } from 'src/app/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  formulario:FormGroup;

  @ViewChild('frase') frase!: ElementRef;

  //array nombres de usuario
  usernames:Array<string> = new Array();


  IdArtistas:Array<number> = new Array();
  NombreArtistas:Array<string> = new Array();

  //arreglo con la info de los artistas
  artistas:Array<Artista> = new Array();
  primerArtista:Array<Artista> = new Array();
  
  //array contenido noticias
  noticias:Array<Noticia> = new Array();

 //array contenido noticias destacadas
  noticiasDestacadas:Array<Noticia> = new Array();

  //arreglo con los colaboradores
  teamwork:Team[] = this.crearTeamwork();

  constructor(private renderer:Renderer2, private ServicioUsuario:UserService, public Form:FormBuilder, private router:Router) { 
    this.formulario=Form.group({});
    setTimeout(() => {
      this.agregarFraseHome();
    }, 100);

    

  }

  ngOnInit(): void {

    //let Sbutton:any = document.getElementById("Sbtn");
  
    //usuarios
    this.ServicioUsuario.GetUsuariosArtistas().subscribe(datos=>{
      this.usernames.length = 0;
      for(let i=0; i<datos.length; i++){
        this.usernames.push(datos[i].username);
      }
      console.log(this.usernames);
    })
    
    this.ServicioUsuario.GetArtistas().subscribe(art=>{
      for(let i=0; i<art.length ; i++){
        this.ServicioUsuario.GetUsername(art[i].id).subscribe(datos=>{
          console.log(datos[0].username);
          this.NombreArtistas.push(datos[0].username);
        })
      }

      this.ServicioUsuario.GetArtistas().subscribe(art=>{
        this.artistas.length = 0;
        
        if(art.length > 0){
          let img:string = "../../../assets/img-contenido/imgperfil.png";
          this.ServicioUsuario.GetImgPerfil(art[0].id).subscribe(datos=>{
            img = datos[0].imagen;
            console.log(this.NombreArtistas[0]);
            let artista:Artista ={
              id:       art[0].id,
              username: this.NombreArtistas[0],
              nombre:   art[0].nombre,
              descripcion:     art[0].descripcion,
              img:      img,
            };
            this.primerArtista.push(artista);
          })

          for(let i=1; i<art.length && i<=3; i++){
            this.ServicioUsuario.GetImgPerfil(art[i].id).subscribe(datos=>{
              img = datos[0].imagen;
              let artista:Artista ={
                id:       art[i].id,
                username: this.NombreArtistas[i],
                nombre:   art[i].nombre,
                descripcion:     art[i].descripcion,
                img:      img
              };
              this.artistas.push(artista);
            })
          }
        }
      })
    })

    //noticias
    this.ServicioUsuario.GetNoticias().subscribe(news=>{
      this.noticias.length = 0;
      for(let i=0; i<news.length; i++){
        let aux:boolean;
        if(news[i].destacada == 1)  aux = true;
        else  aux = false;
        
        let noticia:Noticia ={
          id:         news[i].id,
          titulo:     news[i].titulo,
          bajada:     news[i].bajada,
          contenido:  news[i].contenido,
          destacada:  aux,
          imgHome:    news[i].imgHome,
          imgNoticia: news[i].imgNoticia,
          imgBanner:  news[i].imgNoticia
        };

        this.noticias.push(noticia);

        if((aux) && this.noticiasDestacadas.length < 8) this.noticiasDestacadas.push(noticia);
      }
    })
    
  }

  addUsername(id:number){
    
  }

  buscarArtista(){
    let search:any = document.getElementById("typeahead-basic");
    console.log(this.usernames);
    console.log(search.value);
    for (let i = 0; i < this.usernames.length; i++) {
      if (search.value === this.usernames[i]) {
        console.log("find")
        this.router.navigate([`artist/${search.value}`]);
        break;
      }
    }
  }

  cambiarCursor(){}

  agregarFraseHome(){
    let texto = this.renderer.createText("\"Los artistas conceptuales son místicos más que racionalistas. Llegan a conclusiones a las que no llega la lógica\" - Sol LeWitt");
    this.renderer.appendChild(this.frase.nativeElement, texto);
  }

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 2 ? []
      : this.usernames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  crearTeamwork(){
    let lista:Team[] = [
      {
        nombre:"Ford Scavo",
        ocupacion:"Diseñador",
        foto:"../../../assets/img-contenido/tw_ford.jpg"
      },
      {
        nombre:"Anita Ritta",
        ocupacion:"Artista",
        foto:"../../../assets/img-contenido/tw_anita.jpg"
      },
      {
        nombre:"Samel Lalonde",
        ocupacion:"Diseñador",
        foto:"../../../assets/img-contenido/tw_samel.jpg"
      }
    ];

    return lista;
  }

  
}



  /* respaldo
  crearArtistas(){
    //en esta parte se puede leer desde una bd, pero mientras lo pongo así
    let lista:Artista[] = [
      {
        nombre:"Juana \"goma\" Gonzalez", 
        desc:"Una joven de 28 años apasionada por las artes plásticas con gran conocimiento y mucha creatividad. Sus gustos son raros al momento de crear algunas de sus locuras.",
        img:"../../../assets/img-contenido/a1_juana.png"
      },
      {
        nombre:"Alec \"Mago\" Durant", 
        desc:"Anciano de edad pero nunca del alma, soy amante de todo lo que sea considerado parte del diseño.",
        img:"../../../assets/img-contenido/a2_mago.png"
      },
      {
        nombre:"Sam \"samcasso\" Angulo", 
        desc:"Apacionado por las grandes sorpresas que pueden dar los espacios en blanco. Mi gran percepción de los lugares genera grandes obras.",
        img:"../../../assets/img-contenido/a3_sam.png"
      },
      {
        nombre:"Ana \"crespos\" Posso", 
        desc:"Hola, me llaman Ana pero pueden decirme crespos, mi forma de pensar es totalmente geometrica, podrás ver greandes estructuras.",
        img:"../../../assets/img-contenido/a4_ana.png"
      }
    ];

    return lista;
  }
  
  crearNoticias(){
    //esto tambien hay que dejarlo en la bd
    let lista:Noticia[] = [
      {
        titulo:"Noticia 1",
        bajada:"Bajada noticia 1",
        contenido:"Contenido de la noticia 1. Lorem ipsum y esas cosas.",
        destacada:true,
        imgHome:"../../../assets/img-noticias/n1_h.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia 2",
        bajada:"Bajada noticia 2",
        contenido:"Contenido de la noticia 2. Lorem ipsum y esas cosas.",
        destacada:true,
        imgHome:"../../../assets/img-noticias/n2_h.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia X1",
        bajada:"Bajada noticia X1",
        contenido:"Contenido de la noticia X1. Lorem ipsum y esas cosas.",
        destacada:false,
        imgHome:"../../../assets/img-noticias/0.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia 3",
        bajada:"Bajada noticia 3",
        contenido:"Contenido de la noticia 3. Lorem ipsum y esas cosas.",
        destacada:true,
        imgHome:"../../../assets/img-noticias/n3_h.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia X2",
        bajada:"Bajada noticia X2",
        contenido:"Contenido de la noticia X2. Lorem ipsum y esas cosas.",
        destacada:false,
        imgHome:"../../../assets/img-noticias/0.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia 4",
        bajada:"Bajada noticia 4",
        contenido:"Contenido de la noticia 4. Lorem ipsum y esas cosas.",
        destacada:true,
        imgHome:"../../../assets/img-noticias/n4_h.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      }
      ,
      {
        titulo:"Noticia 5",
        bajada:"Bajada noticia 5",
        contenido:"Contenido de la noticia 5. Lorem ipsum y esas cosas.",
        destacada:true,
        imgHome:"../../../assets/img-noticias/n5_h.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      }
      ,
      {
        titulo:"Noticia 6",
        bajada:"Bajada noticia 6",
        contenido:"Contenido de la noticia 6. Lorem ipsum y esas cosas.",
        destacada:true,
        imgHome:"../../../assets/img-noticias/n6_h.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      }
      ,
      {
        titulo:"Noticia 7",
        bajada:"Bajada noticia 7",
        contenido:"Contenido de la noticia 7. Lorem ipsum y esas cosas.",
        destacada:true,
        imgHome:"../../../assets/img-noticias/n7_h.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia X3",
        bajada:"Bajada noticia X3",
        contenido:"Contenido de la noticia X3. Lorem ipsum y esas cosas.",
        destacada:false,
        imgHome:"../../../assets/img-noticias/0.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia 8",
        bajada:"Bajada noticia 8",
        contenido:"Contenido de la noticia 8. Lorem ipsum y esas cosas.",
        destacada:true,
        imgHome:"../../../assets/img-noticias/n8_h.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia X4",
        bajada:"Bajada noticia X4",
        contenido:"Contenido de la noticia X4. Lorem ipsum y esas cosas.",
        destacada:false,
        imgHome:"../../../assets/img-noticias/0.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia X5",
        bajada:"Bajada noticia X5",
        contenido:"Contenido de la noticia X5. Lorem ipsum y esas cosas.",
        destacada:true,
        imgHome:"../../../assets/img-noticias/0.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      },
      {
        titulo:"Noticia X6",
        bajada:"Bajada noticia X6",
        contenido:"Contenido de la noticia X6. Lorem ipsum y esas cosas.",
        destacada:false,
        imgHome:"../../../assets/img-noticias/0.jpg",
        imgNoticia:"...",
        imgBanner:"..."
      }
      
    ]
    return lista;
  }

  crearNoticiasDestacadas(){
    //lee todas las noticias creadas buscando las que tengan "true" en su atributo "destacada"
    //guardara las primeras 8 que encuentre
    
    let lista:Array<Noticia> = new Array();
    let cont = 0;

    for(let noticia of this.noticias){
      if(noticia.destacada == true){
        lista.push(noticia);
        cont++;
        if(cont >= 8){
          break;
        }
      }
    }

    return lista;
  }

  */
  