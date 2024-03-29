import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SharedModule } from "./shared/shared.module";
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
//import { UploadComponent } from './shared/components/upload/upload.component';
import { ToastrModule } from 'ngx-toastr';
import { PageLoaderComponent } from './layout/page-loader/page-loader.component';
import { ProtectRoutesInterceptor } from './core/interceptors/protect-routes.interceptor';
import { DisableControlDirective } from './core/directives/disable-control.directive';
import  localeEs from '@angular/common/locales/es-SV';
import { registerLocaleData } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
registerLocaleData(localeEs, 'es');
@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    PageLoaderComponent,
    DisableControlDirective,
    //UploadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    MatIconModule,
    CKEditorModule,
    ToastrModule.forRoot()
  ],
  entryComponents: [
   // UploadComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ProtectRoutesInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
