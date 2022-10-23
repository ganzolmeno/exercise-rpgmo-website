import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit, OnDestroy {

  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    let dynamicScript = document.createElement('script');
    dynamicScript.type = 'text/javascript';
    dynamicScript.async = true;
    dynamicScript.src = "https://apis.google.com/js/platform.js";
    dynamicScript.id = 'dynamic_yt';
    document.body.appendChild(dynamicScript);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.getElementById('dynamic_yt')?.remove();
    document.body.lastElementChild?.tagName == "INS" && document.body.lastElementChild?.remove();
    document.body.lastElementChild?.tagName == "DIV" && document.body.lastElementChild?.remove();
  }

}
