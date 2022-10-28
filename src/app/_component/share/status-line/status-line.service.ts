import { environment } from './../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HostListener, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusLineService {

  lastOnline = new Subject<number>();
  isDoubleXp = new Subject<boolean>();
  private pageActive = !0;
  private blurTime = new Date().valueOf();

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient,
  ) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.lastOnline.next(localStorage['last_online'] * 1 || 30);
    this.isDoubleXp.next(!1)

    setInterval(() => { this.updatePlaying(); }, 3e4),
      this.updatePlaying();
  }

  private updatePlaying(): void {
    if(!environment.production) return;
    this.pageActive && this.http.get<onlineData>("https://rpg-de.mo.ee/online.json?t=" + Math.random())
      .subscribe({
        next: (data: onlineData) => {
          localStorage['last_online'] = data.online
          this.lastOnline.next(data.online);
          this.isDoubleXp.next(data.xp == 2);
        },
        error: err => {
          this.isDoubleXp.next(!0);
        }
      });
  }

  @HostListener('window:focus', ['$event']) onFocused(event: any) {
    this.pageActive = !0;
    new Date().valueOf() - this.blurTime > 5e4 && this.updatePlaying();
  }
  @HostListener('window:blur', ['$event']) onBlur(event: any) {
    this.pageActive = !1;
    this.blurTime = new Date().valueOf();
  }
}

export interface onlineData {
  online: number,
  xp: number
}
