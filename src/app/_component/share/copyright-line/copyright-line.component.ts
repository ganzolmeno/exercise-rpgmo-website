import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-copyright-line',
  templateUrl: './copyright-line.component.html',
  styleUrls: ['./copyright-line.component.scss']
})
export class CopyrightLineComponent implements AfterViewInit {

  @ViewChild('year') year!:ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    this.year.nativeElement.innerText = new Date().getFullYear().toString();
  }

}
