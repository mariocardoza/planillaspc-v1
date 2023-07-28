import { Component, OnInit, ElementRef, Renderer2, Inject } from '@angular/core';
import { ICredencial } from 'src/app/core/models/credencial';
import { DOCUMENT } from "@angular/common";
import { DashboardService } from 'src/app/core/service/dashboard.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  usuario: ICredencial;
  token: string;
  listMaxHeight: string;
  listMaxWidth: string;
  numeroPendientes: number = 0;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public elementRef: ElementRef,
    private renderer: Renderer2,
    private dashboardService: DashboardService
  ) { 
    this.usuario = JSON.parse(localStorage.getItem('PlanillaUser'));
    if(this.usuario != null){
      this.token = this.usuario.Token;
    }
  }

  ngOnInit(): void {
    this.contarPendientes()
  }

  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("submenu-closed")) {
      this.renderer.addClass(this.document.body, "side-closed-hover");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    }
  }

  contarPendientes(){
    this.dashboardService.usersPending(this.token,0,10).subscribe((res)=>{
      if(res.success){
        this.numeroPendientes = res.registros
      }
    })
  }

  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("side-closed-hover")) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }

}
