import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, OnDestroy } from '@angular/core';
import { LOCALE_ID, Inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  @ViewChild("content") content!: ElementRef;

  private pageActive = !0;
  private current = 0;
  private background_position_target = [0, 0];
  private requestId = -1;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  @HostListener('window:focus', ['$event']) onFocused(event: any) {
    this.pageActive = !0;
  }
  @HostListener('window:blur', ['$event']) onBlur(event: any) {
    this.pageActive = !1;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.http.get(`i18n/${this.locale}/welcome.html`, { responseType: 'text' }).subscribe({
      next: data => {
        this.content.nativeElement.innerHTML = data;
        this.showSpec();
        this.animateImages();
      },
      error: _ => this.router.navigate([''])
    });
  }

  private showSpec(): void {
    if (/Android/.test(window.navigator.userAgent)) {
      this.document.getElementById('android')!.style.display = 'block';
    } else if (
      ['iPhone', 'iPad', 'iPod'].indexOf(window.navigator.platform) !== -1
    ) {
      this.document.getElementById('ios')!.style.display = 'block';
    }
  }

  private animateImages(): void {
    this.requestId = window.requestAnimationFrame(() => {
      this.animateImages();
    });
    if (!this.pageActive) {
      return;
    }
    var targets = [
      [
        [102, 23],
        [193, 79],
        [72, 102],
        [5, 24],
      ],
      [
        [102, 41],
        [1, 62],
        [193, 14],
        [179, 99],
      ],
      [
        [0, 0],
        [90, 5],
        [56, 101],
        [198, 100],
      ],
      [
        [13, 4],
        [124, 3],
        [198, 52],
        [114, 100],
      ],
      [
        [112, 41],
        [0, 39],
        [200, 100],
        [60, 100],
      ],
      [
        [14, 4],
        [126, 55],
        [200, 100],
        [200, 0],
        [57, 100],
      ],
    ];
    let elems = document.querySelectorAll('.message_box.story div');
    let elem = elems[this.current] as HTMLElement;
    let current_background: Array<any> = elem.style['backgroundPosition']
      .replace(/-/g, '')
      .replace(/px/g, '')
      .replace(/%/g, '')
      .split(' ');
    current_background[0] = parseInt(current_background[0]);
    current_background[1] = parseInt(current_background[1]);
    current_background[0] = this.tween(
      current_background[0],
      this.background_position_target[0]
    );
    current_background[1] = this.tween(
      current_background[1],
      this.background_position_target[1]
    );
    if (
      Math.abs(current_background[0] - this.background_position_target[0]) <
      2 &&
      Math.abs(current_background[1] - this.background_position_target[1]) < 2
    ) {
      this.current += 1;
      this.current = this.current % 6;
      this.background_position_target =
        targets[this.current][
        Math.floor(Math.random() * targets[this.current].length)
        ];
    }
    elem.style['backgroundPosition'] =
      '-' + current_background[0] + 'px -' + current_background[1] + 'px';
  }

  private tween(current: number, target: number) {
    if (current < target) {
      return (current += 1);
    } else if (current == target) {
      return current;
    } else {
      return (current -= 1);
    }
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.cancelAnimationFrame(this.requestId);
  }
}
