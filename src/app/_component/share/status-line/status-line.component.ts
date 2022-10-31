import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef, LOCALE_ID } from '@angular/core';
import { StatusLineService } from './status-line.service';

@Component({
  selector: 'app-status-line',
  templateUrl: './status-line.component.html',
  styleUrls: ['./status-line.component.scss'],
})
export class StatusLineComponent implements AfterViewInit {

  @ViewChild("lang_select") select!: ElementRef;
  @ViewChild("xp") xp!: ElementRef;
  lastOnline: number = 30;
  langMapping = [
    { code: 'en', name: "EN" },
    { code: 'zh', name: "简" },
    { code: 'zh-tw', name: "繁" }
  ];
  lang = this.locale;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private statusLineService: StatusLineService,
    @Inject(LOCALE_ID) public locale: string
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

  langChange(code:string){
    this.lang = code;
    location.href = `${location.origin}/copy/${this.lang}/#/?setlang=${this.lang}`;//TODO: path change
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
