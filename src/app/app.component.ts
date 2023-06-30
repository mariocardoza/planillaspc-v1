import { Component } from '@angular/core';
import { PlatformLocation } from "@angular/common";
import { Event, Router, NavigationStart, NavigationEnd } from "@angular/router";
import { ToastService } from './shared/toast/toast.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'planillas-pc';
  currentUrl: string;
  constructor(
    public toastrService: ToastService,
    private spinner: NgxSpinnerService,
    public _router: Router,
    location: PlatformLocation,
    ){}

  showToaster(){
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.spinner.show();
        // location.onPopState(() => {
        //   window.location.reload();
        // });
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf("/") + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        this.spinner.hide();
      }
      window.scrollTo(0, 0);
    });
    this.toastrService.showSuccess("Hello", "I'm the toastr message.")
  }
}
