import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './media.component';
import { ScreenshotsBoxComponent } from './screenshots-box/screenshots-box.component';



@NgModule({
  declarations: [
    MediaComponent,
    ScreenshotsBoxComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '**', component: MediaComponent }])
  ],
})
export class MediaModule { }
