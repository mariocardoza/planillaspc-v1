import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { MaterialModule } from "./material.module";
import { FeatherIconsModule } from "./components/feather-icons/feather-icons.module";
import { ComponentsModule } from "./components/components.module";
import {MatRadioModule} from "@angular/material/radio";

@NgModule({
  declarations: [
  ],
    imports: [
        CommonModule,
        FormsModule,
        FeatherIconsModule,
        ComponentsModule,
        ReactiveFormsModule,
        RouterModule,
        NgbModule,
        MaterialModule,
        MatRadioModule,
    ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    MaterialModule,
    FeatherIconsModule,
    ComponentsModule

  ],
  providers: [CurrencyPipe]
})
export class SharedModule {}
