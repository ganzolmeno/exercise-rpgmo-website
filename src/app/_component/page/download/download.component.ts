import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, LOCALE_ID, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html'
})
export class DownloadComponent implements AfterViewInit {

  @ViewChild("content") content!: ElementRef;

  ids = ['win','macos','linux','android','ios','steam'];
  order = [1, 2, 3, 4, 5, 6];

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.http.get(`i18n/${this.locale}/download.html`, { responseType: 'text' }).subscribe({
      next: data => {
        this.content.nativeElement.innerHTML = data;

        let userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];

        if (macosPlatforms.indexOf(platform) !== -1) {
          this.order = [2, 1, 3, 4, 5, 6];
        } else if (iosPlatforms.indexOf(platform) !== -1) {
          this.order = [5, 2, 3, 4, 1, 6];
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
          this.order = [1, 2, 3, 4, 5, 6];
        } else if (/Android/.test(userAgent)) {
          this.order = [3, 4, 5, 1, 2, 6];
        } else if (/Linux/.test(platform)) {
          this.order = [3, 2, 1, 4, 5, 6];
        }

        this.ids.forEach((id, i) => {
          document.getElementById(id)!.setAttribute('style', 'order:'+ this.order[i] + ';');
        });

      },
      error: _ => this.router.navigate([''])
    });
  }
}
