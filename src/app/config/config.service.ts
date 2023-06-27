import { Injectable } from "@angular/core";
import { IConfiguration } from "../core/models/config.interface";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  public configData: IConfiguration;

  constructor() {
    this.setConfigData();
  }

  setConfigData() {
    this.configData = {
      layout: {
        rtl: false, // options:  true & false
        variant: "light", // options:  light & dark
        theme_color: "yellow", // options:  white, black, purple, blue, cyan, green, orange
        logo_bg_color: "white", // options:  white, black, purple, blue, cyan, green, orange
        sidebar: {
          collapsed: false, // options:  true & false
          backgroundColor: "dark", // options:  light & dark
        },
      },
    };
  }
}
