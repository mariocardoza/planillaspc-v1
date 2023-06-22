import { DOCUMENT } from "@angular/common";
import {
  Component,
  Inject,
  OnInit,
  Renderer2,
  AfterViewInit,
} from "@angular/core";
import { ConfigService } from "src/app/config/config.service";
import { Router } from "@angular/router";
import { ICredencial } from "src/app/core/models/credencial";
import { AuthenticationService } from "src/app/core/service/authentication.service";


const document: any = window.document;

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent
  implements OnInit, AfterViewInit
{
  public config: any = {};
  homePage: string;
  isNavbarCollapsed = true;
  flagvalue;
  countryName;
  langStoreValue: string;
  usuario: ICredencial;

  notifications: any[] = [
    {
      message: "Please check your mail",
      time: "14 mins ago",
      icon: "mail",
      color: "nfc-green",
      status: "msg-unread",
    },
    {
      message: "New Employee Added..",
      time: "22 mins ago",
      icon: "person_add",
      color: "nfc-blue",
      status: "msg-read",
    },
    {
      message: "Your leave is approved!! ",
      time: "3 hours ago",
      icon: "event_available",
      color: "nfc-orange",
      status: "msg-read",
    },
    {
      message: "Lets break for lunch...",
      time: "5 hours ago",
      icon: "lunch_dining",
      color: "nfc-blue",
      status: "msg-read",
    },
    {
      message: "Employee report generated",
      time: "14 mins ago",
      icon: "description",
      color: "nfc-green",
      status: "msg-read",
    },
    {
      message: "Please check your mail",
      time: "22 mins ago",
      icon: "mail",
      color: "nfc-red",
      status: "msg-read",
    },
    {
      message: "Salary credited...",
      time: "3 hours ago",
      icon: "paid",
      color: "nfc-purple",
      status: "msg-read",
    },
  ];

  constructor(
    @Inject(DOCUMENT) private documento: Document,
    private renderer: Renderer2,
    private router: Router,
    private authService: AuthenticationService,
    private configService: ConfigService
  ) {
    
  }

  ngOnInit() {
    this.config = this.configService.configData;
    this.usuario = JSON.parse(localStorage.getItem("PlanillaUser"));
    console.log('inicia signalr en el navbar');

    this.homePage = "dashboard";
  }

  ngAfterViewInit() {
    // set theme on startup
    if (localStorage.getItem("theme")) {
      this.renderer.removeClass(this.documento.body, this.config.layout.variant);
      this.renderer.addClass(this.documento.body, localStorage.getItem("theme"));
    } else {
      this.renderer.addClass(this.documento.body, this.config.layout.variant);
    }

    if (localStorage.getItem("menuOption")) {
      this.renderer.addClass(
        this.documento.body,
        localStorage.getItem("menuOption")
      );
    } else {
      this.renderer.addClass(
        this.documento.body,
        "menu_" + this.config.layout.sidebar.backgroundColor
      );
    }

    if (localStorage.getItem("choose_logoheader")) {
      this.renderer.addClass(
        this.documento.body,
        localStorage.getItem("choose_logoheader")
      );
    } else {
      this.renderer.addClass(
        this.documento.body,
        "logo-" + this.config.layout.logo_bg_color
      );
    }

    if (localStorage.getItem("sidebar_status")) {
      if (localStorage.getItem("sidebar_status") === "close") {
        this.renderer.addClass(this.documento.body, "side-closed");
        this.renderer.addClass(this.documento.body, "submenu-closed");
      } else {
        this.renderer.removeClass(this.documento.body, "side-closed");
        this.renderer.removeClass(this.documento.body, "submenu-closed");
      }
    } else {
      if (this.config.layout.sidebar.collapsed === true) {
        this.renderer.addClass(this.documento.body, "side-closed");
        this.renderer.addClass(this.documento.body, "submenu-closed");
      }
    }
    this.renderer.removeClass(this.documento.body, "logo-white");
    this.renderer.addClass(this.documento.body, "logo-black");
  }
  callFullscreen() {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
  }
  mobileMenuSidebarOpen(event: any, className: string) {
    const hasClass = event.target.classList.contains(className);
    if (hasClass) {
      this.renderer.removeClass(this.documento.body, className);
    } else {
      this.renderer.addClass(this.documento.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.documento.body.classList.contains("side-closed");
    if (hasClass) {
      this.renderer.removeClass(this.documento.body, "side-closed");
      this.renderer.removeClass(this.documento.body, "submenu-closed");
    } else {
      this.renderer.addClass(this.documento.body, "side-closed");
      this.renderer.addClass(this.documento.body, "submenu-closed");
    }
  }
  logout() {
    this.authService.logout();
  }
  restartMenu(): void{
  }
}
