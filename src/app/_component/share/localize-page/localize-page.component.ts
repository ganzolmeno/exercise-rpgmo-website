import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ViewChild, OnDestroy, ElementRef, PLATFORM_ID } from '@angular/core';
import { LocaleService } from './../../../_service/locale.service';
import { LOCALE_ID, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'rpgmo-localize-page',
  templateUrl: './localize-page.component.html',
  styleUrls: ['./localize-page.component.scss']
})
export class LocalizePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild("content") content!: ElementRef;
  pageSubscription!: Subscription;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private localeService: LocaleService,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.pageSubscription = this.localeService.page.subscribe(
      page => {
        this.http.get(`i18n/${this.locale}/${page}.html`, { responseType: 'text' }).subscribe({
          next: data => {
            this.content.nativeElement.innerHTML = data;
          },
          error: _ => this.router.navigate([''])
        });
      }
    );
  }


  ngOnDestroy(): void {
    this.pageSubscription.unsubscribe();
  }

}
