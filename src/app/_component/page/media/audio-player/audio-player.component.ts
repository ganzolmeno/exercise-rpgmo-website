import { isPlatformBrowser } from '@angular/common';
import { Component, ViewChild, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { PlyrComponent } from 'ngx-plyr';
import * as Plyr from 'plyr';
/*https://www.npmjs.com/package/ngx-plyr*/

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements AfterViewInit {

  @ViewChild(PlyrComponent) plyr?: PlyrComponent;
  player?: Plyr;

  readonly audioDatas: AudioData[] = [
    {
      title: 'Dorpat',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level0.mp3',
      cover: 'assets/img/maps/map0.png'
    },
    {
      title: 'Dungeon I',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level1.mp3',
      cover: 'assets/img/maps/map1.png'
    },
    {
      title: 'Narwa',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level2.mp3',
      cover: 'assets/img/maps/map2.png'
    },
    {
      title: 'Whiland',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level3.mp3',
      cover: 'assets/img/maps/map3.png'
    },
    {
      title: 'Reval',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level4.mp3',
      cover: 'assets/img/maps/map4.png'
    },
    {
      title: 'Rakblood',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level5.mp3',
      cover: 'assets/img/maps/map5.png'
    },
    {
      title: 'Blood River',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level6.mp3',
      cover: 'assets/img/maps/map6.png'
    },
    {
      title: 'Hell',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level7.mp3',
      cover: 'assets/img/maps/map7.png'
    },
    {
      title: 'Clouds',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level8.mp3',
      cover: 'assets/img/maps/map8.png'
    },
    {
      title: 'Heaven',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level9.mp3',
      cover: 'assets/img/maps/map9.png'
    },
    {
      title: 'Cesis',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level10.mp3',
      cover: 'assets/img/maps/map10.png'
    },
    {
      title: 'Walco',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level11.mp3',
      cover: 'assets/img/maps/map11.png'
    },
    {
      title: 'Tutorial Island / Player Island',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level12.mp3',
      cover: 'assets/img/maps/map12.png'
    },
    {
      title: 'Pernau',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level13.mp3',
      cover: 'assets/img/maps/map13.png'
    },
    {
      title: 'Fellin',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level14.mp3',
      cover: 'assets/img/maps/map14.png'
    },
    {
      title: "Dragon's Lair",
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level15.mp3',
      cover: 'assets/img/maps/map15.png'
    },
    {
      title: "No Man's Land",
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level16.mp3',
      cover: 'assets/img/maps/map16.png'
    },
    {
      title: 'Ancient Dungeon',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level17.mp3',
      cover: 'assets/img/maps/map17.png'
    },
    {
      title: 'Lost Woods',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level18.mp3',
      cover: 'assets/img/maps/map18.png'
    },
    {
      title: 'Minigames',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level19.mp3',
      cover: 'assets/img/maps/map19.png'
    },
    {
      title: "Broceliande Forest",
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level20.mp3',
      cover: 'assets/img/maps/map20.png'
    },
    {
      title: "Devil's Triangle",
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level21.mp3',
      cover: 'assets/img/maps/map21.png'
    },
    {
      title: 'Cathedral',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level22.mp3',
      cover: 'assets/img/maps/map22.png'
    },
    {
      title: 'Illusion Guild',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level23.mp3',
      cover: 'assets/img/maps/map23.png'
    },
    {
      title: "Every Man's Land",
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level24.mp3',
      cover: 'assets/img/maps/map24.png'
    },
    {
      title: 'Moche I',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level25.mp3',
      cover: 'assets/img/maps/map25.png'
    },
    {
      title: 'Wittensten',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level26.mp3',
      cover: 'assets/img/maps/map26.png'
    },
    {
      title: 'Dungeon III',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level28.mp3',
      cover: 'assets/img/maps/map28.png'
    },
    {
      title: 'Witches I',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level35.mp3',
      cover: 'assets/img/maps/map35.png'
    },
    {
      title: 'Star of Knowledge',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level37.mp3',
      cover: 'assets/img/maps/map37.png'
    },
    {
      title: 'Party Quest',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level100.mp3',
      cover: 'assets/img/maps/party_quest.png'
    },
    {
      title: 'Guild',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level120.mp3',
      cover: 'assets/img/maps/guild.png'
    },
    {
      title: 'Tavern',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level40.mp3',
      cover: 'assets/img/maps/map40.png'
    },
    {
      title: 'Lost Relic',
      type: 'audio/mp3',
      src: 'https://music.mo.ee/level41.mp3',
      cover: 'assets/img/maps/map41.png'
    }
  ];

  audioSources: Plyr.Source[] = [];
  currentTrack = 0;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ){}

  audioSet(num: number, play = true) {
    this.audioSources = [
      {
        type: this.audioDatas[num].type,
        src: this.audioDatas[num].src
      }
    ];

    this.currentTrack = num;
    if (play) {
      let tmp = setInterval(_ => {
        this.player?.play();
        this.player?.playing ? clearInterval(tmp) : 0;
      }, 500)
    }
  }

  ngAfterViewInit() {
    this.audioSet(0, !1);
  }
}

export interface AudioData {
  title: string,
  type: string,
  src: string,
  cover: string
}
