import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UploadService {

  constructor(private servicio: HttpClient) { }

  upload(file: File): Observable<any> {

    let HttpUploadOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
      })
    };
    
    const formData: FormData = new FormData();

    formData.append('File', file);
    console.log(formData);

    return this.servicio.post( environment.servidor + "/upload", formData, HttpUploadOptions);
  }

  getFiles(): Observable<any> {
    return this.servicio.get( environment.servidor + "/files");
  }
}
