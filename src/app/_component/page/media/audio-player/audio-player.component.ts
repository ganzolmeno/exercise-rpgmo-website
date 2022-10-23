import { Component, OnInit } from '@angular/core';
import { PlyrComponent } from 'ngx-plyr';
/*https://www.npmjs.com/package/ngx-plyr*/

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
