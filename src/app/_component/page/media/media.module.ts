import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryModule } from  'ng-gallery';
import { LightboxModule } from  'ng-gallery/lightbox';

import { MediaComponent } from './media.component';
import { ScreenshotsBoxComponent } from './screenshots-box/screenshots-box.component';
import { MapsBoxComponent } from './maps-box/maps-box.component';



@NgModule({
  declarations: [
    MediaComponent,
    ScreenshotsBoxComponent,
    MapsBoxComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '**', component: MediaComponent }]),
    GalleryModule,
    LightboxModule
  ],
})
export class MediaModule { }
