import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { StatusLineService } from './status-line.service';

@Component({
  selector: 'app-status-line',
  templateUrl: './status-line.component.html',
  styleUrls: ['./status-line.component.scss'],
})
export class StatusLineComponent implements AfterViewInit {

  @ViewChild("xp") xp!: ElementRef;
  lastOnline: number = 30;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private statusLineService: StatusLineService
  ) { }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.statusLineService.lastOnline.subscribe(num => {
      this.animatePlaying(this.lastOnline, num);
    })

    this.statusLineService.isDoubleXp.subscribe(bool => {
      this.animate2x(bool);
    })

  }

  private animate2x(bool: boolean) {
    if (bool) {
      this.xp.nativeElement.hidden = false;
      this.xp.nativeElement.classList = 'current_xp xp_display';
    } else {
      this.xp.nativeElement.classList = 'current_xp xp_hidden';
      setTimeout(_ => { this.xp.nativeElement.hidden = true; }, 200);
    }
  }

  private animatePlaying(start: number, end: number) {

    let duration = 1500;
    if (start === end) return;
    let range = end - start;
    let current = start * 1;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));
    let timer = setInterval(() => {
      current += increment;
      this.lastOnline = current;
      if (current == end) {
        clearInterval(timer);
      }
    }, stepTime);
  }
}
