import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { endpoint } from 'src/environments/endpoint';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/core/service/authentication.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-usuarios-pendientes',
  templateUrl: './usuarios-pendientes.component.html',
  styleUrls: ['./usuarios-pendientes.component.scss']
})
export class UsuariosPendientesComponent implements OnInit {
  http: HttpClient;
  constructor(http: HttpClient,private authenticationService: AuthenticationService,private _sanitizer: DomSanitizer) { }
  usuarios: any = [];
  
  ngOnInit(): void {
    this.authenticationService.users().subscribe((res) => {
      console.log(res)
      if (res.success) {
        this.usuarios = res.data
      } else {
        console.log(res)
        
      }
    })
  }

  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(image);
  }

}
