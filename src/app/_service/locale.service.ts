import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, filter, map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  readonly titleSuffix = $localize`:title-suffix:RPG MO - Web Browser Game`;
  page = new BehaviorSubject<string | undefined>(undefined);

  constructor(
    private metaService: Meta,
    private router: Router,
    private titleservice: Title
  ) { }

  init(): void {
    this.initMetaTags();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          while (route!.firstChild) {
            route = route.firstChild;
          }

          let result: RouteData = {
            title: route.snapshot.data['title'],
            desc: route.snapshot.data['desc']
          }
          this.page.next(route!.snapshot.data['page'])

          return result;
        })
      )
      .subscribe((route: RouteData) => {
        this.setLocalRouteData(route.title);
        this.metaService.updateTag({ name: 'description', content: route.desc ? route.desc : $localize`:meta-description:An addictive multiplayer game where you slay monsters and increase levels in 19 different skills. Come and invite your friends too, it is fun! Free to play!` })
      });
  }

  initMetaTags() {
    this.metaService.addTags([
      { name: 'description', content: $localize`:meta-description:An addictive multiplayer game where you slay monsters and increase levels in 19 different skills. Come and invite your friends too, it is fun! Free to play!` },
      { name: 'keywords', content: $localize`:meta-keywords:rpg, mmorpg, online, mo, dungeon, runescape, ultima, retro, magic, old-school, html5, free, f2p, pvp, guilds, gamepad, enchanting, 2d, adventure, agriculture, base-building, crafting, exploration, fishing, free to play, indie, isometric, massively multiplayer, multiplayer, open world, pixel graphics, relaxing, retro, sandbox, fletching, archery, woodcutting, alchemy, farming, breeding, mining, jewelry, cooking, fighting, wizardry, fungiculture` },
      { property: 'og:title', content: $localize`:meta-og.title:RPG MO - Web Browser Game` },
      { property: 'og:description', content: $localize`:meta-og.description:A simple yet addictive multiplayer game where you can fight monsters and increase levels in 19 different skills. Come and invite your friends too, it is fun! Free to play!` }
    ]);
  }

  setLocalRouteData(title: string): void {
    let temp = title ? `${title} - ${this.titleSuffix}` : this.titleSuffix;
    this.titleservice.setTitle(temp);
    this.metaService.updateTag({ property: 'og:title', content: temp });
  }
}

export interface RouteData {
  title: string,
  desc: string
}
