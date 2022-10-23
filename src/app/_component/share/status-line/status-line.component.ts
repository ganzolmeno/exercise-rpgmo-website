import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-status-line',
  templateUrl: './status-line.component.html',
  styleUrls: ['./status-line.component.scss'],
})
export class StatusLineComponent implements OnInit {

  lastOnline: number = 30;
  isDoubleXp = !0;
  private pageActive = !0;
  private blurTime = new Date().valueOf();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.lastOnline = localStorage['last_online'] * 1 || 30;

    setInterval(() => { this.updatePlaying(); }, 3e4),
      this.updatePlaying();
  }

  ngOnInit(): void {

  }

  @HostListener('window:focus', ['$event']) onFocused(event: any) {
    this.pageActive = !0;
    new Date().valueOf() - this.blurTime > 5e4 && this.updatePlaying();
  }
  @HostListener('window:blur', ['$event']) onBlur(event: any) {
    this.pageActive = !1;
    this.blurTime = new Date().valueOf();
  }

  private updatePlaying(): void {
return; //TODO: take off
    this.pageActive && this.http.get<onlineData>("https://rpg-de.mo.ee/online.json?t=" + Math.random())
      .subscribe({
        next: (data: onlineData) => {
          this.animatePlaying(this.lastOnline, data.online),
            this.lastOnline = data.online;
          localStorage['last_online'] = data.online;
          this.isDoubleXp = data.xp == 2;
        },
        error: err => {
          this.lastOnline = 30;
          localStorage['last_online'] = this.lastOnline;
          this.isDoubleXp = !1;
        }
      });
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

export interface onlineData {
  online: number,
  xp: number
}
