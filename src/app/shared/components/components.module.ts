import {NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UploadComponent } from "./upload/upload.component";
@NgModule({
  declarations: [
    UploadComponent,
    ],
    imports: [
      CommonModule,
      FormsModule
    ],
  exports: [
    UploadComponent,
    
  ],
  providers: [
  ]
})
export class ComponentsModule {
}
