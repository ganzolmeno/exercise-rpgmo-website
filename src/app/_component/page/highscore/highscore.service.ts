import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { delay, isNumber, tenMinuteCache } from 'src/lib/helper';

@Injectable({
  providedIn: 'root',
})
export class HighscoreService {
  readonly highscore_url = 'https://rpg-de2.mo.ee/';
  readonly charjs_url = 'https://data.mo.ee/';
  readonly dict = { noData: $localize`:@@No data.:No data.` };

  requestState: BehaviorSubject<number> = new BehaviorSubject(
    REQUEST_STATE.NONE
  );
  snapShot: string[] = [];
  playerScores: any = {};
  outputData: any[] = [];

  brMode = 's';
  brStat = 'w';

  optionNodeTree: any = {};
  readonly nodeGeneric = {
    ΦΦtype: 'option',
    ΦΦdefault: 'page',
    ΦΦnext: !0,
    page: { ΦΦdefault: 0, ΦΦtype: 'number' },
    rank: { ΦΦdefault: 0, ΦΦtype: 'number' },
  };

  skills = [
    'total',
    'total_xp',
    'accuracy',
    'strength',
    'defense',
    'health',
    'magic',
    'alchemy',
    'woodcutting',
    'farming',
    'fishing',
    'cooking',
    'jewelry',
    'carpentry',
    'forging',
    'mining',
    'breeding',
    'fletching',
    'archery',
    'wizardry',
    'fungiculture',
    'party',
    'skill_quest',
    'kill_quest',
    'cathedral',
    'scavenger_hunt',
  ];

  challenges = [
    'party',
    'skill_quest',
    'kill_quest',
    'cathedral',
    'scavenger_hunt',
    'battle_royale',
  ];

  constructor(private location: Location, private http: HttpClient) {
    this.optionNodeTree['ΦΦtype'] = 'option';
    this.optionNodeTree['ΦΦnext'] = !0;
    this.skills.forEach((v) => {
      this.optionNodeTree[v] = this.nodeGeneric;
    });
    this.optionNodeTree['battle_royale'] = {
      ΦΦtype: 'option',
      ΦΦdefault: 'br_s_w',
      ΦΦnext: !0,
      br_s_w: this.nodeGeneric,
      br_s_k: this.nodeGeneric,
      br_s_p: this.nodeGeneric,
      br_s_d: this.nodeGeneric,
      br_d_w: this.nodeGeneric,
      br_d_k: this.nodeGeneric,
      br_d_p: this.nodeGeneric,
      br_d_d: this.nodeGeneric,
      br_t_w: this.nodeGeneric,
      br_t_k: this.nodeGeneric,
      br_t_p: this.nodeGeneric,
      br_t_d: this.nodeGeneric,
    };
    this.optionNodeTree['player'] = { ΦΦtype: 'name' };
    this.skills.push('battle_royale');
  }

  init() {
    this.requestState.next(REQUEST_STATE.NONE);
    this.outputData = [];
    this.snapShot = [];
  }

  parseUrl(arr: any[], isRelpace = !1): void {
    if (arr.length == 0) {
      this.init();
      return;
    }
    let tmp = this.optionNodeTree;
    let i = 0;
    let next = !0;
    let checked: any[] = [];

    while (next) {
      let type = tmp['ΦΦtype'];
      next = tmp['ΦΦnext'];

      if (type == 'number' && isNumber(arr[i])) {
        checked.push(parseInt(arr[i]));
      } else if (type == 'option' && tmp[arr[i]]) {
        checked.push(arr[i]);
      } else if (type == 'name' && arr.length > 1) {
        arr[i] = arr[i].usernamify();
        arr[i] != '' ? checked.push(arr[i]) : 0;

        if (arr[i + 1]) {
          arr[i + 1] = arr[i + 1].usernamify();
          arr[i + 1] != '' && arr[i + 1] != arr[i]
            ? checked.push(arr[i + 1])
            : 0;
        }
      } else if (tmp['ΦΦdefault'] != undefined) {
        arr[i] = tmp['ΦΦdefault'];
        checked.push(tmp['ΦΦdefault']);
      } else {
        checked = [];
        next = !1;
      }
      i++;
      if (next) {
        let p = checked[checked.length - 1];
        tmp = tmp[p == 'rank' ? 'page' : p];
      }
    }
    this.snapShot = checked;
    this.setUrl(checked, isRelpace);
    this.requestData(checked);
  }

  setUrl(arr: any[], isRelpace = !1): void {
    if (!arr.length) {
      this.init();
    }
    let url = '/highscore';
    arr.forEach((v) => {
      url += '/' + encodeURIComponent(v);
    });
    isRelpace ? this.location.replaceState(url) : this.location.go(url);
  }

  async requestData(arr: any[]): Promise<void> {
    if (!arr.length) return;
    let fin = [arr[0]];
    if (arr[0] == 'player') {
      fin = arr;
    } else if (arr[0] == 'battle_royale') {
      fin = [arr[1]];
    }
    let i = arr[0] == 'battle_royale' ? 2 : 1;
    if (arr[0] != 'player') {
      fin.push(arr[i + 1]);
      if (arr[i] == 'rank') {
        fin[1] = Math.floor((arr[i + 1] - 1) / 500);
      }
    }

    this.requestState.next(REQUEST_STATE.LOADING);

    await delay(1000);

    if (this.snapShot[0] == 'player') {
      fin.shift();
      this.getPlayerData(fin);
    } else {
      this.getSkillListData(fin);
    }
  }

  getPlayerData(names: string[]) {
    if (names.length == 0) {
      this.requestState.next(REQUEST_STATE.ERROR);
      return;
    }
    this.outputData = [];
    for (let i = 0; i < names.length; i++) {
      if (this.playerScores[names[i]]) {
        this.outputData.push(names[i]);
      } else {
        this.outputData.push(!1);
        this.loadPlayer(names, i);
      }
    }
  }

  loadPlayer(names: string[], idx: number) {
    let name = names[idx];
    let url =
      this.highscore_url +
      'playerskills?n=' +
      encodeURIComponent(name) +
      '&t=' +
      tenMinuteCache();

    this.http.get(url).subscribe({
      next: (data: any) => {
        this.playerScores[name] = this.formatPlayerData(data);
        this.outputData[idx] = name;

        let bool = true;
        this.outputData.forEach(v => bool = bool && v);
        if (bool)
          this.requestState.next(REQUEST_STATE.COMPELETE);
      },
      error: (err: HttpErrorResponse) => {
        this.outputData = [err.statusText];
        this.requestState.next(REQUEST_STATE.ERROR);
      },
    });
  }

  formatPlayerData(arr: any) {
    let result: any = {};
    this.skills.forEach((skill) => {
      result[skill] = {};
      arr.forEach((data: any) => {
        if (data['board'] == skill) {
          result[skill] = {
            score: data['score'],
            position: data['position'],
            last_score: data['last_score'],
            last_position: data['last_position'],
          };
        }
      });
    });
    return result;
  }

  getSkillListData(arr: any) {

    let url = this.highscore_url + "highscores?b=" + arr[0] + "&p=" + arr[1] + "&t=" + tenMinuteCache();
    this.http.get(url)
      .subscribe({
        next: (data: any) => {
          if (data.length == 0) {
            this.requestState.next(REQUEST_STATE.ERROR);
            this.outputData = [this.dict.noData];
          } else {
            this.outputData = [data];
            this.requestState.next(REQUEST_STATE.COMPELETE);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.requestState.next(REQUEST_STATE.ERROR);
          this.outputData = [err.statusText];
        }
      })
  }
}

export enum REQUEST_STATE {
  NONE,
  LOADING,
  COMPELETE,
  ERROR,
}

/**
 * 'o' : origin,
 * 't' : translate
 */
interface TranslateData {
  o: string;
  t: string;
}

export const SKILL_LIST: TranslateData[] = [
  {
    o: 'total',
    t: $localize`:@@Total:Total`,
  },
  {
    o: 'total_xp',
    t: $localize`:@@Total xp:Total xp`,
  },
  {
    o: 'accuracy',
    t: $localize`:@@Accuracy:Accuracy`,
  },
  {
    o: 'strength',
    t: $localize`:@@Strength:Strength`,
  },
  {
    o: 'defense',
    t: $localize`:@@Defense:Defense`,
  },
  {
    o: 'health',
    t: $localize`:@@Health:Health`,
  },
  {
    o: 'magic',
    t: $localize`:@@Magic:Magic`,
  },
  {
    o: 'alchemy',
    t: $localize`:@@Alchemy:Alchemy`,
  },
  {
    o: 'woodcutting',
    t: $localize`:@@Woodcutting:Woodcutting`,
  },
  {
    o: 'farming',
    t: $localize`:@@Farming:Farming`,
  },
  {
    o: 'fishing',
    t: $localize`:@@Fishing:Fishing`,
  },
  {
    o: 'cooking',
    t: $localize`:@@Cooking:Cooking`,
  },
  {
    o: 'jewelry',
    t: $localize`:@@Jewelry:Jewelry`,
  },
  {
    o: 'carpentry',
    t: $localize`:@@Carpentry:Carpentry`,
  },
  {
    o: 'forging',
    t: $localize`:@@Forging:Forging`,
  },
  {
    o: 'mining',
    t: $localize`:@@Mining:Mining`,
  },
  {
    o: 'breeding',
    t: $localize`:@@Breeding:Breeding`,
  },
  {
    o: 'fletching',
    t: $localize`:@@Fletching:Fletching`,
  },
  {
    o: 'archery',
    t: $localize`:@@Archery:Archery`,
  },
  {
    o: 'wizardry',
    t: $localize`:@@Wizardry:Wizardry`,
  },
  {
    o: 'fungiculture',
    t: $localize`:@@Fungiculture:Fungiculture`,
  },
  {
    o: 'party',
    t: $localize`:@@Party:Party`,
  },
  {
    o: 'skill_quest',
    t: $localize`:@@Skill quests:Skill quests`,
  },
  {
    o: 'kill_quest',
    t: $localize`:@@Kill quests:Kill quests`,
  },
  {
    o: 'cathedral',
    t: $localize`:@@Cathedral:Cathedral`,
  },
  {
    o: 'scavenger_hunt',
    t: $localize`:@@Scavenger hunt:Scavenger hunt`,
  },
  {
    o: 'battle_royale',
    t: $localize`:@@Battle royale:Battle royale`,
  },
];
