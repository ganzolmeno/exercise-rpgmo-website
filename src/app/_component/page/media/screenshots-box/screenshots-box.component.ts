import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Gallery, ImageItem, GalleryItem, GalleryConfig } from 'ng-gallery';
/*https://github.com/MurhafSousli/ngx-gallery*/

@Component({
  selector: 'app-screenshots-box',
  templateUrl: './screenshots-box.component.html',
  styleUrls: ['./screenshots-box.component.scss']
})
export class ScreenshotsBoxComponent implements OnInit {

  items: GalleryItem[] = [];

  readonly data = [
    {
      srcUrl: 'https://mo.mo.ee/img/screens/1.png',
      previewUrl: 'assets/img/screens/1_thumb.png'
    },
    {
      srcUrl: 'https://mo.mo.ee/img/screens/2.png',
      previewUrl: 'assets/img/screens/2_thumb.png'
    },
    {
      srcUrl: 'https://mo.mo.ee/img/screens/3.png',
      previewUrl: 'assets/img/screens/3_thumb.png'
    },
    {
      srcUrl: 'https://mo.mo.ee/img/screens/4.png',
      previewUrl: 'assets/img/screens/4_thumb.png'
    },
    {
      srcUrl: 'https://mo.mo.ee/img/screens/5.png',
      previewUrl: 'assets/img/screens/5_thumb.png'
    },
    {
      srcUrl: 'https://mo.mo.ee/img/screens/6.png',
      previewUrl: 'assets/img/screens/6_thumb.png'
    },
    {
      srcUrl: 'https://mo.mo.ee/img/screens/7.png',
      previewUrl: 'assets/img/screens/7_thumb.png'
    },
    {
      srcUrl: 'https://mo.mo.ee/img/screens/8.png',
      previewUrl: 'assets/img/screens/8_thumb.png'
    },
    {
      srcUrl: 'https://mo.mo.ee/img/screens/9.png',
      previewUrl: 'assets/img/screens/9_thumb.png'
    },
    {
      srcUrl: 'https://mo.mo.ee/img/screens/10.png',
      previewUrl: 'assets/img/screens/10_thumb.png'
    },

  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private gallery: Gallery) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.items = this.data.map(item =>
      new ImageItem({ src: item.srcUrl, thumb: item.previewUrl })
    );

    let config: GalleryConfig = {
      thumbWidth: 128,
      thumbHeight: 72,
      thumbView: "contain"
    }
    this.gallery.ref().setConfig(config);
    this.gallery.ref().load(this.items);
  }

}
