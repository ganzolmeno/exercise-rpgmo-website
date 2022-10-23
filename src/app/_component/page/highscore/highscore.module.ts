import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighscoreComponent } from './highscore.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HighscoreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '**',component: HighscoreComponent}])
  ]
})
export class HighscoreModule { }
