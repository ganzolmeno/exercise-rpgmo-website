import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-data-container',
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.scss']
})
export class DataContainerComponent implements OnInit {

  @ViewChild("container") container!: ElementRef;

  readonly dict = {
    noInTop:$localize`:@@Not in top:Not in top`,
    level:$localize`:@@Level:Level`,
    xp:$localize`:@@XP (Millions):XP (Millions)`,
    point:$localize`:@@Points:Points`,
  };


  constructor() { }

  ngOnInit(): void {
  }

}
