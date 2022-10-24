import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HighscoreService } from './highscore.service';

@Component({
  selector: 'app-highscore',
  templateUrl: './highscore.component.html',
  styleUrls: ['./highscore.component.scss']
})
export class HighscoreComponent implements OnInit, OnDestroy {

  navigationSubscription?: Subscription;

  constructor(private route: ActivatedRoute, public highscoreService: HighscoreService, private router: Router) { }

  ngOnInit(): void {
    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        this.parseUrl();
      }
    });
    this.parseUrl();
  }

  parseUrl(): void {
    let result: any[] = [];
    this.route.snapshot.url.forEach(v => {
      result.push(decodeURI(v.path.toLocaleLowerCase()));
    });
    this.highscoreService.parseUrl(result, !0);
  }

  ngOnDestroy() {
    this.navigationSubscription?.unsubscribe();
  }

}
