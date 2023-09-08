import {NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UploadComponent } from "./upload/upload.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { FilesUploadDirComponent } from './files-upload-dir/files-upload-dir.component';
import { MaterialModule } from "../material.module";
import { PrimeNgModule } from "../prime-ng/prime-ng.module";
import { NgImageFullscreenViewModule } from "ng-image-fullscreen-view";
@NgModule({
  declarations: [
    UploadComponent,
    FileUploadComponent,
    FilesUploadDirComponent
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
    FileUploadComponent
  ],
  providers: [
  ]
})
export class ComponentsModule {
}
