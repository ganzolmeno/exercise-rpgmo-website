import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-left-side',
  templateUrl: './left-side.component.html',
  styleUrls: ['./left-side.component.scss']
})
export class LeftSideComponent implements AfterViewInit {

  rotateImagesTotal = 18; // TODO: need to adjust.
  rotateImagesCurrent = 6;
  rotateImageVisible = 6;
  rotateImagePreload: Array<any> = [!0, !0, !0, !0, !0, !0];
  imagePositions = [1, 2, 3, 4, 5, 6];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.imagePositions = [1, 2, 3, 4, 5, 6].concat(
      this.shuffle(this.getRangeArray(this.rotateImageVisible + 1,this.rotateImagesTotal))
    );
    this.getRangeArray
    setInterval(() => { this.rotateImages() }, 7e3);
  }

  /** to > from */
  getRangeArray(from: number, to: number) {
    let result = [];
    for (let i = from; i <= to; i++) {
      result.push(i);
    }
    return result;
  }

  private rotateImages(): void {
    let t = this.rotateImagesCurrent - this.rotateImageVisible;
    t < 0 && (t += this.rotateImagesTotal);
    let e = document.querySelector(`.i${this.imagePositions[t]}`) as HTMLElement;
    let d = document.querySelector(`.i${this.imagePositions[t]} div`) as HTMLElement;
    d.classList.add('fade-out');
    t = this.rotateImagesCurrent
    e.className = "i" + this.imagePositions[t];
    setTimeout(() => { d.className = "i" + this.imagePositions[t] }, 1300);
    ++this.rotateImagesCurrent > this.rotateImagesTotal - 1 && (this.rotateImagesCurrent = 0);
    this.rotateImagePreload[this.rotateImagesCurrent] ||
      ((this.rotateImagePreload[this.rotateImagesCurrent] = new Image()),
        (this.rotateImagePreload[this.rotateImagesCurrent].src =
          "assets/img/promo/" + this.imagePositions[this.rotateImagesCurrent] + ".png"))
  }

  private shuffle(t: Array<number>): Array<number> {
    for (
      let e, n, i = t.length;
      i;
      e = Math.floor(Math.random() * i), n = t[--i], t[i] = t[e], t[e] = n
    );
    return t;
  }

}
