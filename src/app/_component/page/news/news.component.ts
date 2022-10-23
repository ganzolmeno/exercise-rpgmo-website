import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tenMinuteCache } from 'src/lib/helper';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html'
})
export class NewsComponent implements AfterViewInit {

  readonly forums_url = 'https://forums.mo.ee/viewtopic.php?f=14&t=';

  @ViewChild("content") content!: ElementRef;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let result = '';

    this.http.get<newsData[]>("assets/js/news.json?t=" + tenMinuteCache())
      .subscribe({
        next: (data: newsData[]) => {
          let newsdatas: newsData[] = JSON.parse(JSON.stringify(data));
          newsdatas.forEach((news, idx) => {
            result = `
            <div class="message_box col">
              <span class="box_author">${news.date}</span>
              <div class="header">
                <img src="${'assets/img/news/' + (idx % 5 + 1) + '.png'}"
                  style="position:absolute;left: -31px; top: -26px;"
                  class="reflection_news">
                <a href="${this.forums_url + news.topic_id}">${news.title}</a>
              </div>

              <div class="box_content">${news.description} <a href="${this.forums_url + news.topic_id}">
                ${this.forums_url + news.topic_id}</a>
              </div>
            </div>`;
            this.content.nativeElement.innerHTML += result
          })
        }
      })
  }

}

export interface newsData {
  title: string,
  date: string,
  topic_id: string,
  description: string
}
