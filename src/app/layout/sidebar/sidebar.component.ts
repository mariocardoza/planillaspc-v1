import { Component, OnInit, ElementRef, Renderer2, Inject } from '@angular/core';
import { ICredencial } from 'src/app/core/models/credencial';
import { DOCUMENT } from "@angular/common";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  usuario: ICredencial;
  listMaxHeight: string;
  listMaxWidth: string;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public elementRef: ElementRef,
    private renderer: Renderer2,
  ) { 
    this.usuario = JSON.parse(localStorage.getItem('PlanillaUser'));
  }

  ngOnInit(): void {
  }

  mouseHover(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("submenu-closed")) {
      this.renderer.addClass(this.document.body, "side-closed-hover");
      this.renderer.removeClass(this.document.body, "submenu-closed");
    }
  }

  mouseOut(e) {
    const body = this.elementRef.nativeElement.closest("body");
    if (body.classList.contains("side-closed-hover")) {
      this.renderer.removeClass(this.document.body, "side-closed-hover");
      this.renderer.addClass(this.document.body, "submenu-closed");
    }
  }

}
