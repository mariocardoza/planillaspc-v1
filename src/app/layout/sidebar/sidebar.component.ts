import { Component, OnInit, ElementRef, Renderer2, Inject, HostListener } from '@angular/core';
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
  headerHeight = 60;
  public innerHeight: any;
  listMaxWidth: string;
  numeroPendientes: number = 0;
  menu: any[]= [
    {
      "codigoMenu": "empleados",
      "nombreMenu": "Mantenimiento de empleados",
      "urlMenu": "?",
      "ayudaMenu": "Permite administrar los empleados",
      "ordenMenu": 1,
      "codigoMenuSuperior": "empleados",
      "nivelMenu": 1,
      "sinSuperior": 0
  }
]
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
    this.initLeftSidebar();
  }

  rutaOp(opcion: any){
    return null;
  }

  initLeftSidebar() {
    const me = this;
    // Set menu height
    me.setMenuHeight();
    me.checkStatuForResize(true);
  }

  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("submenu-closed")) {
      this.renderer.addClass(this.document.body, "side-closed-hover");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    }
  }

  checkStatuForResize(firstTime) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, "ls-closed");
    } else {
      this.renderer.removeClass(this.document.body, "ls-closed");
    }
  }

  contarPendientes(){
    this.dashboardService.usersPending(this.token,this.usuario.CodigoRol,this.usuario.CodigoPagaduria,0,10).subscribe((res)=>{
      if(res.success){
        this.numeroPendientes = res.registros
      }
    })
  }

  @HostListener("window:resize", ["$event"])
  windowResizecall(event) {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener("document:mousedown", ["$event"])
  onGlobalClick(event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, "overlay-open");
    }
  }

  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + "";
    this.listMaxWidth = "500px";
  }

  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("side-closed-hover")) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }

}
