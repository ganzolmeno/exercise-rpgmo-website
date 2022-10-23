import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HighscoreComponent } from './highscore.component';
import { BtnMenuComponent } from './btn-menu/btn-menu.component';

@NgModule({
  declarations: [
    HighscoreComponent,
    BtnMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '**',component: HighscoreComponent}]),
    FormsModule
  ]
})
export class HighscoreModule { }
