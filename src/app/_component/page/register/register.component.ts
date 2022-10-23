import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Inject, LOCALE_ID, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements AfterViewInit {

  @ViewChild("content") content!: ElementRef;

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

    this.http.get(`i18n/${this.locale}/register.html`, { responseType: 'text' }).subscribe({
      next: data => {
        this.content.nativeElement.innerHTML = data;
        this.route.fragment.subscribe((fragment) => {
          if (fragment)
            document.getElementById(fragment!)!.scrollIntoView({ behavior: "smooth" });
        });
      },
      error: _ => this.router.navigate([''])
    });
  }
}
