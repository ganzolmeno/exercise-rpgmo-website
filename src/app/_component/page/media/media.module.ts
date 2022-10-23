import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaComponent } from './media.component';



@NgModule({
  declarations: [
    MediaComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '**', component: MediaComponent }])
  ],
})
export class MediaModule { }
