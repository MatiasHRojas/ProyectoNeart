import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  name:String='';
  id:number=-1;
  type:number=-1;
  loggedin:boolean=false;

  private loginSourse = new Subject<void>();
  public login = this.loginSourse.asObservable();

  private logoutSourse = new Subject<void>();
  public logout = this.logoutSourse.asObservable();

  constructor() { }

  LogIn(datos:any){
    this.name = datos.name;
    this.id = datos.ident;
    this.type = datos.type;
    this.loggedin = datos.loggedin;
    this.loginSourse.next();
  }

  LogOut(){
    this.name = '';
    this.id = -1;
    this.type = -1;
    this.loggedin = false;
    this.logoutSourse.next();
  }

  GetSession(){
    return {
      name:this.name,
      id:this.id,
      type:this.type,
      loggedin:this.loggedin
    };
  }

}
