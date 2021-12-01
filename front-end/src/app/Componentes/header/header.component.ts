import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConnectionService } from 'src/app/Servicios/connection.service';
import { UserService } from 'src/app/Servicios/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  @ViewChild('home') home!: ElementRef;
  @ViewChild('artist') artist!: ElementRef;
  @ViewChild('news') news!: ElementRef;
  @ViewChild('team') team!: ElementRef;
  @ViewChild('about') about!: ElementRef;
  @ViewChild('login') login!: ElementRef;
  @ViewChild('register') register!: ElementRef;
  @ViewChild('profile') profile!: ElementRef;
  @ViewChild('off') off!: ElementRef;

  a:boolean=true;
  b:boolean=false;
  c:boolean=false;
  d:boolean=false;
  e:boolean=false;
  f:boolean=false;
  g:boolean=false;
  h:boolean=false;
  i:boolean=false;
  
  private loginRef:Subscription;
  private logoutRef:Subscription;

  logged:boolean=false;
  session:any;

  constructor(private renderer:Renderer2, private ServicioUsuario:UserService, private ConnectionServ:ConnectionService, private router:Router) {
    this.activarNavegacion();
    //leer estado actual del login
    this.session = this.ConnectionServ.GetSession();
    //suscribirse al estado login
    this.loginRef = this.ConnectionServ.login.subscribe(()=>{
      this.logged = true;
      this.session = this.ConnectionServ.GetSession();
      console.log("Sesión activa en el header: " + this.session.name + "(ID: " + this.session.id + ")");
    })
    //suscribirse al estado logouts
    this.logoutRef = this.ConnectionServ.logout.subscribe(()=>{
      this.logged = false;
      console.log("> Se ha cerrado la sesión.");
    })
  }

  ngOnInit(): void {
    
  }


  desactivarImg(){
    this.a=false; this.b=false; this.c=false; this.d=false; 
    this.e=false; this.f=false; this.g=false; this.h=false;
    this.i=false;
  }

  activarNavegacion(){
    setTimeout(() => {
      //event listener para moverse por la página
      //HOME
      this.renderer.listen(this.home.nativeElement,"click", () => {
        window.scroll({
          top:0,
          behavior: 'smooth'
        });
        this.desactivarImg();
        this.a=true;
      })
      //ARTIST
      this.renderer.listen(this.artist.nativeElement,"click", () => {
        window.scroll({
          top:660,
          behavior: 'smooth'
        });
        this.desactivarImg();
        this.b=true;
      })
      //NEWS
      this.renderer.listen(this.news.nativeElement,"click", () => {
        window.scroll({
          top:1350,
          behavior: 'smooth'
        });
        this.desactivarImg();
        this.c=true;
      })
      //TEAM
      this.renderer.listen(this.team.nativeElement,"click", () => {
        window.scroll({
          top:2065,
          behavior: 'smooth'
        });
        this.desactivarImg();
        this.d=true;
      })
      //ABOUT
      this.renderer.listen(this.about.nativeElement,"click", () => {
        window.scroll({
          top:5000,
          behavior: 'smooth'
        });
        this.desactivarImg();
        this.e=true;
      })
      if(!this.logged){
        this.renderer.listen(this.login.nativeElement,"click", () => {
          window.scroll({
            top:0,
            behavior:'smooth'
          });
          this.desactivarImg();
          this.f=true;
        })
        //REGISTER
        this.renderer.listen(this.register.nativeElement,"click", () => {
          window.scroll({
            top:0,
            behavior: 'smooth'
          });
          this.desactivarImg();
          this.g=true;
        })
      }
      if(this.logged){
        this.renderer.listen(this.profile.nativeElement,"click", () => {
          window.scroll({
            top:0,
            behavior: 'smooth'
          });
          this.desactivarImg();
          this.h=true;
        })
        this.renderer.listen(this.off.nativeElement,"click", () => {
          window.scroll({
            top:0,
            behavior: 'smooth'
          });
          this.desactivarImg();
          this.i=true;
        })
      }
 
    }, 200);

  }

  loggingOut(){
    window.scroll({
      top:0,
      behavior: 'smooth'
    });
    this.desactivarImg();
    this.i=true;
    this.ServicioUsuario.LogOut(this.session).subscribe();
    this.ConnectionServ.LogOut();
    console.log("Sesion cerrada.");
    this.router.navigate(['/']);
  }
  
  activarBotones(elemento:string){
    window.scroll({
      top:0,
      behavior: 'smooth'
    });
    this.desactivarImg();
    if(elemento == 'login'){
      this.f=true;
    }
    if(elemento == 'register'){
      this.g=true;
    }
    if(elemento == 'profile'){
        this.h=true;
    }
  }

}
