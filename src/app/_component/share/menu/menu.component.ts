import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  isOpen = true;
  last_check: number = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    if (!isPlatformBrowser(this.platformId)) return;
    this.checkView();

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart && window.innerWidth <= 1000) {
        this.isOpen = false;
      }
    });
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  checkView(): void {
    if (window.innerWidth > 1000 && this.last_check <= 1000) this.isOpen = true;
    if (window.innerWidth <= 1000 && (this.last_check > 1000 || !this.last_check)) this.isOpen = false;
    this.last_check = window.innerWidth;
  }

  @HostListener('window:resize', ['$event']) onResize(event: any) {
    this.checkView();
  }

}
