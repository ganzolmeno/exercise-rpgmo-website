import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HighscoreComponent } from './highscore.component';
import { BtnMenuComponent } from './btn-menu/btn-menu.component';
import { DataContainerComponent } from './data-container/data-container.component';
import 'src/lib/string-prototypes';

@NgModule({
  declarations: [
    HighscoreComponent,
    BtnMenuComponent,
    DataContainerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{path: '**',component: HighscoreComponent}]),
    FormsModule
  ]
})
export class HighscoreModule { }
