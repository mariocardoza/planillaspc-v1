import {NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UploadComponent } from "./upload/upload.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
@NgModule({
  declarations: [
    UploadComponent,
    FileUploadComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      PrimeNgModule
    ],
  exports: [
    UploadComponent,
    FileUploadComponent
  ],
  providers: [
  ]
})
export class ComponentsModule {
}
