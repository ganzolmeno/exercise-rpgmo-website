import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'exercise-rpgmo-website';

  constructor(private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        if (params['lang']) {
          localStorage['lang'] = params['lang'];
        }
      }
      );
  }
}
