import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './_component/page/home/home.component';
import { HeaderComponent } from './_component/share/header/header.component';
import { MenuComponent } from './_component/share/menu/menu.component';
import { CopyrightLineComponent } from './_component/share/copyright-line/copyright-line.component';
import { LeftSideComponent } from './_component/share/left-side/left-side.component';
import { SocialMediaComponent } from './_component/share/social-media/social-media.component';
import { StatusLineComponent } from './_component/share/status-line/status-line.component';
import { GoTopComponent } from './_component/share/go-top/go-top.component';
import { LocalizePageComponent } from './_component/share/localize-page/localize-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    MenuComponent,
    CopyrightLineComponent,
    LeftSideComponent,
    SocialMediaComponent,
    StatusLineComponent,
    GoTopComponent,
    LocalizePageComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
