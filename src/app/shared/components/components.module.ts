import {NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UploadComponent } from "./upload/upload.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { FilesUploadDirComponent } from './files-upload-dir/files-upload-dir.component';
import { MaterialModule } from "../material.module";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { NgImageFullscreenViewModule } from "ng-image-fullscreen-view";
import { BarCodeComponent } from './bar-code/bar-code.component';
@NgModule({
  declarations: [
    UploadComponent,
    FileUploadComponent,
    FilesUploadDirComponent,
    BarCodeComponent
    ],
    imports: [
      CommonModule,
      FormsModule,
      MaterialModule,
      PrimeNgModule,
      NgImageFullscreenViewModule
    ],
  exports: [
    UploadComponent,
    FilesUploadDirComponent,
    FileUploadComponent,
    BarCodeComponent
  ],
  providers: [
  ]
})
export class ComponentsModule {
}
