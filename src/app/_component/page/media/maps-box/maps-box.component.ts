import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-maps-box',
  templateUrl: './maps-box.component.html',
  styleUrls: ['./maps-box.component.scss']
})
export class MapsBoxComponent implements AfterViewInit {

  readonly map_names = "Dorpat;Dungeon I;Narwa;Whiland;Reval;Rakblood;Blood River;Hell;Clouds;Heaven;Cesis;Walco;Tutorial Island;Pernau;Fellin;Dragon's Lair;No Man's Land;Ancient Dungeon;Lost Woods;Minigames;Broceliande Forest;Devil's Triangle;Cathedral;Illusion Guild;Every Man's Land;Moche I;Wittensten;Dungeon II;Dungeon III;Dungeon IV;Moche II;Void I;Nature Tower;Ice Tower;Fire Tower;Witches I;Witches II;Star Of Knowledge;Core Of Knowledge;No Man's Dungeon;Tavern;Lost Relic;Purgatory;Atlantis".split(";");

  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let e = document.getElementById('map_box') as HTMLElement;

    this.map_names.forEach((v, i) => {
      let link = document.createElement('a');
      link.href = `assets/maps/map${i}.png`; //TODO
      link.target = '_blank';
      let img = document.createElement('img');
      img.src = `assets/img/maps/map${i}.png`;
      img.title = v;
      img.alt = v;
      link.appendChild(img);
      e.appendChild(link);
    })

  }

}
