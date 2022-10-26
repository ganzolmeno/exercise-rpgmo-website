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
    this.outputData = [];
    this.snapShot = [];
    this.requestState.next(REQUEST_STATE.NONE);
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
    this.requestState.next(REQUEST_STATE.LOADING);
    this.snapShot = checked.map(v => v);;

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
    /* let url = '';

     if (arr[0] == 'player') {
       url = this.highscore_url + "playerskills?n=" + encodeURIComponent(fin[1]) + "&t=" + tenMinuteCache();
     } else {
       url = this.highscore_url + "highscores?b=" + fin[0] + "&p=" + fin[1] + "&t=" + tenMinuteCache();
     }*/

    //['Level' , 'XP (Millions)', 'Points']

    /*this.selectedOption_text = $localize`:@@Level:Level`;
    if (this.selectedOption == "total_xp") {
      this.selectedOption_text = $localize`:@@XP (Millions):XP (Millions)`;
    }
    else if (["party", "scavenger_hunt", "skill_quest", "kill_quest", "battle_royale"].indexOf(this.selectedOption) != -1 || /br_/.test(this.selectedOption)) {
      this.selectedOption_text = $localize`:@@Points:Points`;
    }*/

    await delay(500);

    /*
        i = arr[0] == 'battle_royale' ? 2 : 1;
        this.rank = arr[0] != 'player' && arr[i] == "rank" ? arr[i + 1] : -1;
    */
    if (this.snapShot[0] == 'player') {
      fin.shift();
      this.getPlayerData(fin);
    } else {
      this.getSkillListData(fin);
    }
  }

  getPlayerData(names: string[]) {
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
    //TODO:
    let is_cros_error = true;
    if (is_cros_error) {
      this.outputData = [simudata];
      this.requestState.next(REQUEST_STATE.COMPELETE);
      return;
    }

    let url = this.highscore_url + "highscores?b=" + arr[0] + "&p=" + arr[1] + "&t=" + tenMinuteCache();
    this.http.get(url)
      .subscribe({
        next: (data: any) => {
          if (data.length == 0) {
            this.outputData = [this.dict.noData];
            this.requestState.next(REQUEST_STATE.ERROR);
          } else {
            this.outputData = [data];
            this.requestState.next(REQUEST_STATE.COMPELETE);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.outputData = [err.statusText];
          this.requestState.next(REQUEST_STATE.ERROR);

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

export const simudata = [
  {
    "player": "qna",
    "board": "total_xp",
    "score": 103939,
    "position": 1,
    "last_score": 102672,
    "last_position": 1
  },
  {
    "player": "leperkhan",
    "board": "total_xp",
    "score": 95194,
    "position": 2,
    "last_score": 93405,
    "last_position": 2
  },
  {
    "player": "rapota",
    "board": "total_xp",
    "score": 76285,
    "position": 3,
    "last_score": 73936,
    "last_position": 3
  },
  {
    "player": "alizee jacotey",
    "board": "total_xp",
    "score": 72939,
    "position": 4,
    "last_score": 71882,
    "last_position": 4
  },
  {
    "player": "biumengb",
    "board": "total_xp",
    "score": 71044,
    "position": 5,
    "last_score": 69968,
    "last_position": 5
  },
  {
    "player": "woodchips",
    "board": "total_xp",
    "score": 66472,
    "position": 6,
    "last_score": 65280,
    "last_position": 6
  },
  {
    "player": "gumby",
    "board": "total_xp",
    "score": 63336,
    "position": 7,
    "last_score": 62241,
    "last_position": 7
  },
  {
    "player": "azathoth555",
    "board": "total_xp",
    "score": 61084,
    "position": 8,
    "last_score": 60086,
    "last_position": 8
  },
  {
    "player": "guoguoba",
    "board": "total_xp",
    "score": 59191,
    "position": 9,
    "last_score": 59141,
    "last_position": 9
  },
  {
    "player": "ynfernity",
    "board": "total_xp",
    "score": 57571,
    "position": 10,
    "last_score": 56628,
    "last_position": 10
  },
  {
    "player": "aipower",
    "board": "total_xp",
    "score": 55850,
    "position": 11,
    "last_score": 53630,
    "last_position": 11
  },
  {
    "player": "zeyr",
    "board": "total_xp",
    "score": 53473,
    "position": 12,
    "last_score": 52353,
    "last_position": 12
  },
  {
    "player": "iamrich",
    "board": "total_xp",
    "score": 51605,
    "position": 13,
    "last_score": 51035,
    "last_position": 13
  },
  {
    "player": "xaa",
    "board": "total_xp",
    "score": 50650,
    "position": 14,
    "last_score": 50650,
    "last_position": 14
  },
  {
    "player": "paintchips",
    "board": "total_xp",
    "score": 49886,
    "position": 15,
    "last_score": 48938,
    "last_position": 15
  },
  {
    "player": "darwyn03",
    "board": "total_xp",
    "score": 48655,
    "position": 16,
    "last_score": 47843,
    "last_position": 16
  },
  {
    "player": "youhaveavirus",
    "board": "total_xp",
    "score": 48298,
    "position": 17,
    "last_score": 47127,
    "last_position": 17
  },
  {
    "player": "anatomicus",
    "board": "total_xp",
    "score": 46126,
    "position": 18,
    "last_score": 44547,
    "last_position": 18
  },
  {
    "player": "unlucky_point",
    "board": "total_xp",
    "score": 42675,
    "position": 19,
    "last_score": 41128,
    "last_position": 19
  },
  {
    "player": "hellguard",
    "board": "total_xp",
    "score": 40625,
    "position": 20,
    "last_score": 40008,
    "last_position": 21
  },
  {
    "player": "disenchanted",
    "board": "total_xp",
    "score": 40607,
    "position": 21,
    "last_score": 40066,
    "last_position": 20
  },
  {
    "player": "wolf0927",
    "board": "total_xp",
    "score": 40451,
    "position": 22,
    "last_score": 39278,
    "last_position": 22
  },
  {
    "player": "nyf",
    "board": "total_xp",
    "score": 38857,
    "position": 23,
    "last_score": 37792,
    "last_position": 23
  },
  {
    "player": "william5713",
    "board": "total_xp",
    "score": 37974,
    "position": 24,
    "last_score": 36618,
    "last_position": 24
  },
  {
    "player": "xor",
    "board": "total_xp",
    "score": 37459,
    "position": 25,
    "last_score": 36004,
    "last_position": 25
  },
  {
    "player": "wawawa123",
    "board": "total_xp",
    "score": 36255,
    "position": 26,
    "last_score": 35262,
    "last_position": 26
  },
  {
    "player": "burger hat",
    "board": "total_xp",
    "score": 34711,
    "position": 27,
    "last_score": 33545,
    "last_position": 27
  },
  {
    "player": "efreet martyr",
    "board": "total_xp",
    "score": 33724,
    "position": 28,
    "last_score": 32533,
    "last_position": 31
  },
  {
    "player": "ox dravward",
    "board": "total_xp",
    "score": 33684,
    "position": 29,
    "last_score": 32195,
    "last_position": 33
  },
  {
    "player": "kromel",
    "board": "total_xp",
    "score": 33625,
    "position": 30,
    "last_score": 32857,
    "last_position": 28
  },
  {
    "player": "tricky vicki",
    "board": "total_xp",
    "score": 33625,
    "position": 31,
    "last_score": 32706,
    "last_position": 30
  },
  {
    "player": "fragerjap",
    "board": "total_xp",
    "score": 33408,
    "position": 32,
    "last_score": 31866,
    "last_position": 34
  },
  {
    "player": "bbbbbv",
    "board": "total_xp",
    "score": 33008,
    "position": 33,
    "last_score": 32366,
    "last_position": 32
  },
  {
    "player": "gezi",
    "board": "total_xp",
    "score": 32796,
    "position": 34,
    "last_score": 32796,
    "last_position": 29
  },
  {
    "player": "titan666dbh",
    "board": "total_xp",
    "score": 31938,
    "position": 35,
    "last_score": 31537,
    "last_position": 35
  },
  {
    "player": "jkmec",
    "board": "total_xp",
    "score": 31721,
    "position": 36,
    "last_score": 31317,
    "last_position": 36
  },
  {
    "player": "jzxcfpox",
    "board": "total_xp",
    "score": 31658,
    "position": 37,
    "last_score": 30478,
    "last_position": 37
  },
  {
    "player": "meyouwa",
    "board": "total_xp",
    "score": 31533,
    "position": 38,
    "last_score": 29540,
    "last_position": 38
  },
  {
    "player": "fever",
    "board": "total_xp",
    "score": 29628,
    "position": 39,
    "last_score": 29373,
    "last_position": 39
  },
  {
    "player": "4zaikuni",
    "board": "total_xp",
    "score": 29459,
    "position": 40,
    "last_score": 27582,
    "last_position": 43
  },
  {
    "player": "akurah",
    "board": "total_xp",
    "score": 28557,
    "position": 41,
    "last_score": 27704,
    "last_position": 42
  },
  {
    "player": "zentari",
    "board": "total_xp",
    "score": 28411,
    "position": 42,
    "last_score": 28079,
    "last_position": 40
  },
  {
    "player": "kala_bon",
    "board": "total_xp",
    "score": 28214,
    "position": 43,
    "last_score": 27911,
    "last_position": 41
  },
  {
    "player": "gritorei",
    "board": "total_xp",
    "score": 27516,
    "position": 44,
    "last_score": 27482,
    "last_position": 44
  },
  {
    "player": "west_poison",
    "board": "total_xp",
    "score": 27449,
    "position": 45,
    "last_score": 27449,
    "last_position": 45
  },
  {
    "player": "docdevil",
    "board": "total_xp",
    "score": 27411,
    "position": 46,
    "last_score": 26559,
    "last_position": 46
  },
  {
    "player": "kkoma",
    "board": "total_xp",
    "score": 26365,
    "position": 47,
    "last_score": 26327,
    "last_position": 47
  },
  {
    "player": "neiho",
    "board": "total_xp",
    "score": 26290,
    "position": 48,
    "last_score": 26290,
    "last_position": 48
  },
  {
    "player": "berkril",
    "board": "total_xp",
    "score": 25249,
    "position": 49,
    "last_score": 25010,
    "last_position": 50
  },
  {
    "player": "enkarax",
    "board": "total_xp",
    "score": 25043,
    "position": 50,
    "last_score": 25017,
    "last_position": 49
  },
  {
    "player": "flixel",
    "board": "total_xp",
    "score": 24913,
    "position": 51,
    "last_score": 24822,
    "last_position": 51
  },
  {
    "player": "yukishiro",
    "board": "total_xp",
    "score": 24620,
    "position": 52,
    "last_score": 23455,
    "last_position": 55
  },
  {
    "player": "ava001",
    "board": "total_xp",
    "score": 24477,
    "position": 53,
    "last_score": 23667,
    "last_position": 53
  },
  {
    "player": "mastercrates",
    "board": "total_xp",
    "score": 24256,
    "position": 54,
    "last_score": 23636,
    "last_position": 54
  },
  {
    "player": "dhjy",
    "board": "total_xp",
    "score": 23881,
    "position": 55,
    "last_score": 23881,
    "last_position": 52
  },
  {
    "player": "xiufanke",
    "board": "total_xp",
    "score": 23415,
    "position": 56,
    "last_score": 23257,
    "last_position": 56
  },
  {
    "player": "drachimberg",
    "board": "total_xp",
    "score": 23403,
    "position": 57,
    "last_score": 22148,
    "last_position": 61
  },
  {
    "player": "frankk",
    "board": "total_xp",
    "score": 23153,
    "position": 58,
    "last_score": 23153,
    "last_position": 57
  },
  {
    "player": "laosijidaidaiwo",
    "board": "total_xp",
    "score": 22994,
    "position": 59,
    "last_score": 22994,
    "last_position": 58
  },
  {
    "player": "landok",
    "board": "total_xp",
    "score": 22576,
    "position": 60,
    "last_score": 22233,
    "last_position": 60
  },
  {
    "player": "rtho",
    "board": "total_xp",
    "score": 22313,
    "position": 61,
    "last_score": 22256,
    "last_position": 59
  },
  {
    "player": "gory dayz",
    "board": "total_xp",
    "score": 22016,
    "position": 62,
    "last_score": 21583,
    "last_position": 62
  },
  {
    "player": "darthan",
    "board": "total_xp",
    "score": 21761,
    "position": 63,
    "last_score": 21525,
    "last_position": 63
  },
  {
    "player": "bed relt",
    "board": "total_xp",
    "score": 21279,
    "position": 64,
    "last_score": 21279,
    "last_position": 64
  },
  {
    "player": "askeron",
    "board": "total_xp",
    "score": 21203,
    "position": 65,
    "last_score": 21175,
    "last_position": 65
  },
  {
    "player": "pedant",
    "board": "total_xp",
    "score": 21166,
    "position": 66,
    "last_score": 21166,
    "last_position": 66
  },
  {
    "player": "(-_o)",
    "board": "total_xp",
    "score": 20904,
    "position": 67,
    "last_score": 20148,
    "last_position": 71
  },
  {
    "player": "jeantty",
    "board": "total_xp",
    "score": 20834,
    "position": 68,
    "last_score": 20572,
    "last_position": 68
  },
  {
    "player": "simbaba",
    "board": "total_xp",
    "score": 20687,
    "position": 69,
    "last_score": 20687,
    "last_position": 67
  },
  {
    "player": "borogou",
    "board": "total_xp",
    "score": 20427,
    "position": 70,
    "last_score": 20427,
    "last_position": 69
  },
  {
    "player": "kyosa",
    "board": "total_xp",
    "score": 20357,
    "position": 71,
    "last_score": 20357,
    "last_position": 70
  },
  {
    "player": "mantric",
    "board": "total_xp",
    "score": 20285,
    "position": 72,
    "last_score": 19693,
    "last_position": 74
  },
  {
    "player": "celeste",
    "board": "total_xp",
    "score": 20263,
    "position": 73,
    "last_score": 19869,
    "last_position": 72
  },
  {
    "player": "ada",
    "board": "total_xp",
    "score": 20259,
    "position": 74,
    "last_score": 19066,
    "last_position": 79
  },
  {
    "player": "therudman",
    "board": "total_xp",
    "score": 20086,
    "position": 75,
    "last_score": 19360,
    "last_position": 75
  },
  {
    "player": "bubbleecho",
    "board": "total_xp",
    "score": 20015,
    "position": 76,
    "last_score": 19113,
    "last_position": 77
  },
  {
    "player": "wlmag",
    "board": "total_xp",
    "score": 19977,
    "position": 77,
    "last_score": 19285,
    "last_position": 76
  },
  {
    "player": "roll826",
    "board": "total_xp",
    "score": 19937,
    "position": 78,
    "last_score": 19720,
    "last_position": 73
  },
  {
    "player": "malmby",
    "board": "total_xp",
    "score": 19695,
    "position": 79,
    "last_score": 18886,
    "last_position": 82
  },
  {
    "player": "ikkily",
    "board": "total_xp",
    "score": 19572,
    "position": 80,
    "last_score": 18680,
    "last_position": 83
  },
  {
    "player": "ufoguy",
    "board": "total_xp",
    "score": 19393,
    "position": 81,
    "last_score": 18232,
    "last_position": 91
  },
  {
    "player": "sanitarium",
    "board": "total_xp",
    "score": 19216,
    "position": 82,
    "last_score": 18968,
    "last_position": 80
  },
  {
    "player": "hyhy",
    "board": "total_xp",
    "score": 19070,
    "position": 83,
    "last_score": 19070,
    "last_position": 78
  },
  {
    "player": "rekki asuasa",
    "board": "total_xp",
    "score": 19053,
    "position": 84,
    "last_score": 18311,
    "last_position": 89
  },
  {
    "player": "gudd",
    "board": "total_xp",
    "score": 18979,
    "position": 85,
    "last_score": 18602,
    "last_position": 84
  },
  {
    "player": "kattelox",
    "board": "total_xp",
    "score": 18942,
    "position": 86,
    "last_score": 18913,
    "last_position": 81
  },
  {
    "player": "hell_master",
    "board": "total_xp",
    "score": 18847,
    "position": 87,
    "last_score": 18476,
    "last_position": 85
  },
  {
    "player": "zefelippe",
    "board": "total_xp",
    "score": 18681,
    "position": 88,
    "last_score": 18260,
    "last_position": 90
  },
  {
    "player": "lxc796",
    "board": "total_xp",
    "score": 18659,
    "position": 89,
    "last_score": 17676,
    "last_position": 95
  },
  {
    "player": "travis444",
    "board": "total_xp",
    "score": 18612,
    "position": 90,
    "last_score": 18325,
    "last_position": 88
  },
  {
    "player": "daimon4ik",
    "board": "total_xp",
    "score": 18552,
    "position": 91,
    "last_score": 18326,
    "last_position": 87
  },
  {
    "player": "liandria",
    "board": "total_xp",
    "score": 18413,
    "position": 92,
    "last_score": 17817,
    "last_position": 93
  },
  {
    "player": "davecfatal",
    "board": "total_xp",
    "score": 18328,
    "position": 93,
    "last_score": 18328,
    "last_position": 86
  },
  {
    "player": "teiyi",
    "board": "total_xp",
    "score": 18174,
    "position": 94,
    "last_score": 18142,
    "last_position": 92
  },
  {
    "player": "shiwen64",
    "board": "total_xp",
    "score": 18140,
    "position": 95,
    "last_score": 17186,
    "last_position": 99
  },
  {
    "player": "jaxon366",
    "board": "total_xp",
    "score": 17729,
    "position": 96,
    "last_score": 17729,
    "last_position": 94
  },
  {
    "player": "myaf",
    "board": "total_xp",
    "score": 17629,
    "position": 97,
    "last_score": 17068,
    "last_position": 100
  },
  {
    "player": "mrsiggs",
    "board": "total_xp",
    "score": 17626,
    "position": 98,
    "last_score": 16495,
    "last_position": 101
  },
  {
    "player": "ore deleter",
    "board": "total_xp",
    "score": 17515,
    "position": 99,
    "last_score": 17515,
    "last_position": 96
  },
  {
    "player": "kid",
    "board": "total_xp",
    "score": 17477,
    "position": 100,
    "last_score": 17476,
    "last_position": 97
  },
  {
    "player": "level_5",
    "board": "total_xp",
    "score": 17295,
    "position": 101,
    "last_score": 17295,
    "last_position": 98
  },
  {
    "player": "blade",
    "board": "total_xp",
    "score": 16726,
    "position": 102,
    "last_score": 16173,
    "last_position": 104
  },
  {
    "player": "daikun1",
    "board": "total_xp",
    "score": 16525,
    "position": 103,
    "last_score": 16064,
    "last_position": 105
  },
  {
    "player": "wldsj",
    "board": "total_xp",
    "score": 16467,
    "position": 104,
    "last_score": 15806,
    "last_position": 109
  },
  {
    "player": "sssworld",
    "board": "total_xp",
    "score": 16417,
    "position": 105,
    "last_score": 16405,
    "last_position": 102
  },
  {
    "player": "biuuu",
    "board": "total_xp",
    "score": 16368,
    "position": 106,
    "last_score": 16358,
    "last_position": 103
  },
  {
    "player": "jackie11one",
    "board": "total_xp",
    "score": 16351,
    "position": 107,
    "last_score": 15112,
    "last_position": 115
  },
  {
    "player": "stseller",
    "board": "total_xp",
    "score": 16225,
    "position": 108,
    "last_score": 15813,
    "last_position": 108
  },
  {
    "player": "lord ultor",
    "board": "total_xp",
    "score": 16082,
    "position": 109,
    "last_score": 15404,
    "last_position": 113
  },
  {
    "player": "active volcano",
    "board": "total_xp",
    "score": 16072,
    "position": 110,
    "last_score": 15609,
    "last_position": 112
  },
  {
    "player": "bobdylan",
    "board": "total_xp",
    "score": 16035,
    "position": 111,
    "last_score": 16028,
    "last_position": 106
  },
  {
    "player": "chaotic_evil",
    "board": "total_xp",
    "score": 16022,
    "position": 112,
    "last_score": 15270,
    "last_position": 114
  },
  {
    "player": "santa",
    "board": "total_xp",
    "score": 15969,
    "position": 113,
    "last_score": 15969,
    "last_position": 107
  },
  {
    "player": "dkl",
    "board": "total_xp",
    "score": 15965,
    "position": 114,
    "last_score": 15726,
    "last_position": 110
  },
  {
    "player": "rydann",
    "board": "total_xp",
    "score": 15654,
    "position": 115,
    "last_score": 15654,
    "last_position": 111
  },
  {
    "player": "fef",
    "board": "total_xp",
    "score": 15424,
    "position": 116,
    "last_score": 14331,
    "last_position": 120
  },
  {
    "player": "todd69",
    "board": "total_xp",
    "score": 15093,
    "position": 117,
    "last_score": 14515,
    "last_position": 117
  },
  {
    "player": "mulletor",
    "board": "total_xp",
    "score": 14835,
    "position": 118,
    "last_score": 14745,
    "last_position": 116
  },
  {
    "player": "dathar",
    "board": "total_xp",
    "score": 14598,
    "position": 119,
    "last_score": 14462,
    "last_position": 118
  },
  {
    "player": "kenneth",
    "board": "total_xp",
    "score": 14435,
    "position": 120,
    "last_score": 13565,
    "last_position": 126
  },
  {
    "player": "youhaveaquestion",
    "board": "total_xp",
    "score": 14424,
    "position": 121,
    "last_score": 12859,
    "last_position": 134
  },
  {
    "player": "night fever",
    "board": "total_xp",
    "score": 14398,
    "position": 122,
    "last_score": 14281,
    "last_position": 121
  },
  {
    "player": "deilann",
    "board": "total_xp",
    "score": 14336,
    "position": 123,
    "last_score": 14336,
    "last_position": 119
  },
  {
    "player": "sibzolitruchy",
    "board": "total_xp",
    "score": 14273,
    "position": 124,
    "last_score": 13313,
    "last_position": 129
  },
  {
    "player": "pallmall",
    "board": "total_xp",
    "score": 14193,
    "position": 125,
    "last_score": 14193,
    "last_position": 122
  },
  {
    "player": "peke",
    "board": "total_xp",
    "score": 13950,
    "position": 126,
    "last_score": 13950,
    "last_position": 123
  },
  {
    "player": "eo8h1",
    "board": "total_xp",
    "score": 13942,
    "position": 127,
    "last_score": 13942,
    "last_position": 124
  },
  {
    "player": "-freddie-",
    "board": "total_xp",
    "score": 13827,
    "position": 128,
    "last_score": 13539,
    "last_position": 127
  },
  {
    "player": "zac",
    "board": "total_xp",
    "score": 13679,
    "position": 129,
    "last_score": 13679,
    "last_position": 125
  },
  {
    "player": "xxxalei",
    "board": "total_xp",
    "score": 13510,
    "position": 130,
    "last_score": 13510,
    "last_position": 128
  },
  {
    "player": "hsiao",
    "board": "total_xp",
    "score": 13465,
    "position": 131,
    "last_score": 12316,
    "last_position": 145
  },
  {
    "player": "stoiki2000",
    "board": "total_xp",
    "score": 13424,
    "position": 132,
    "last_score": 13287,
    "last_position": 130
  },
  {
    "player": "pavyts",
    "board": "total_xp",
    "score": 13221,
    "position": 133,
    "last_score": 13221,
    "last_position": 131
  },
  {
    "player": "0-1-1-2-3-5-8-13",
    "board": "total_xp",
    "score": 13014,
    "position": 134,
    "last_score": 12666,
    "last_position": 137
  },
  {
    "player": "jcks",
    "board": "total_xp",
    "score": 12994,
    "position": 135,
    "last_score": 12994,
    "last_position": 132
  },
  {
    "player": "morning star",
    "board": "total_xp",
    "score": 12900,
    "position": 136,
    "last_score": 12023,
    "last_position": 148
  },
  {
    "player": "hakkehakke",
    "board": "total_xp",
    "score": 12882,
    "position": 137,
    "last_score": 12553,
    "last_position": 140
  },
  {
    "player": "hirntod",
    "board": "total_xp",
    "score": 12868,
    "position": 138,
    "last_score": 12654,
    "last_position": 138
  },
  {
    "player": "matti",
    "board": "total_xp",
    "score": 12861,
    "position": 139,
    "last_score": 12861,
    "last_position": 133
  },
  {
    "player": "j7937060",
    "board": "total_xp",
    "score": 12790,
    "position": 140,
    "last_score": 12790,
    "last_position": 135
  },
  {
    "player": "sycmoz",
    "board": "total_xp",
    "score": 12774,
    "position": 141,
    "last_score": 12422,
    "last_position": 143
  },
  {
    "player": "hilton994",
    "board": "total_xp",
    "score": 12736,
    "position": 142,
    "last_score": 12736,
    "last_position": 136
  },
  {
    "player": "neomidis",
    "board": "total_xp",
    "score": 12642,
    "position": 143,
    "last_score": 12641,
    "last_position": 139
  },
  {
    "player": "goonza.93",
    "board": "total_xp",
    "score": 12636,
    "position": 144,
    "last_score": 11918,
    "last_position": 151
  },
  {
    "player": "spaex",
    "board": "total_xp",
    "score": 12594,
    "position": 145,
    "last_score": 11942,
    "last_position": 150
  },
  {
    "player": "fnordor",
    "board": "total_xp",
    "score": 12561,
    "position": 146,
    "last_score": 11684,
    "last_position": 157
  },
  {
    "player": "sxy1046",
    "board": "total_xp",
    "score": 12552,
    "position": 147,
    "last_score": 11586,
    "last_position": 160
  },
  {
    "player": "plankton",
    "board": "total_xp",
    "score": 12550,
    "position": 148,
    "last_score": 12547,
    "last_position": 141
  },
  {
    "player": "gabrielps",
    "board": "total_xp",
    "score": 12524,
    "position": 149,
    "last_score": 12047,
    "last_position": 147
  },
  {
    "player": "sad414",
    "board": "total_xp",
    "score": 12495,
    "position": 150,
    "last_score": 12495,
    "last_position": 142
  },
  {
    "player": "morfo47",
    "board": "total_xp",
    "score": 12421,
    "position": 151,
    "last_score": 12372,
    "last_position": 144
  },
  {
    "player": "wlarc",
    "board": "total_xp",
    "score": 12216,
    "position": 152,
    "last_score": 11647,
    "last_position": 158
  },
  {
    "player": "saints_rivers",
    "board": "total_xp",
    "score": 12213,
    "position": 153,
    "last_score": 11784,
    "last_position": 153
  },
  {
    "player": "munster1990",
    "board": "total_xp",
    "score": 12207,
    "position": 154,
    "last_score": 11842,
    "last_position": 152
  },
  {
    "player": "mlgb",
    "board": "total_xp",
    "score": 12202,
    "position": 155,
    "last_score": 12202,
    "last_position": 146
  },
  {
    "player": "dino",
    "board": "total_xp",
    "score": 12156,
    "position": 156,
    "last_score": 11117,
    "last_position": 170
  },
  {
    "player": "broliys",
    "board": "total_xp",
    "score": 12138,
    "position": 157,
    "last_score": 11956,
    "last_position": 149
  },
  {
    "player": "rtx3090",
    "board": "total_xp",
    "score": 12027,
    "position": 158,
    "last_score": 11448,
    "last_position": 162
  },
  {
    "player": "fist",
    "board": "total_xp",
    "score": 11834,
    "position": 159,
    "last_score": 11149,
    "last_position": 169
  },
  {
    "player": "guguagugua",
    "board": "total_xp",
    "score": 11783,
    "position": 160,
    "last_score": 11509,
    "last_position": 161
  },
  {
    "player": "soulcrusherdt",
    "board": "total_xp",
    "score": 11763,
    "position": 161,
    "last_score": 11763,
    "last_position": 154
  },
  {
    "player": "woodxi",
    "board": "total_xp",
    "score": 11704,
    "position": 162,
    "last_score": 11704,
    "last_position": 155
  },
  {
    "player": "elban_the_elder",
    "board": "total_xp",
    "score": 11695,
    "position": 163,
    "last_score": 11430,
    "last_position": 164
  },
  {
    "player": "rob anybody",
    "board": "total_xp",
    "score": 11691,
    "position": 164,
    "last_score": 11690,
    "last_position": 156
  },
  {
    "player": "baruna",
    "board": "total_xp",
    "score": 11633,
    "position": 165,
    "last_score": 11620,
    "last_position": 159
  },
  {
    "player": "szh2019ws",
    "board": "total_xp",
    "score": 11606,
    "position": 166,
    "last_score": 11431,
    "last_position": 163
  },
  {
    "player": "donpacificognito",
    "board": "total_xp",
    "score": 11582,
    "position": 167,
    "last_score": 11349,
    "last_position": 165
  },
  {
    "player": "pja",
    "board": "total_xp",
    "score": 11523,
    "position": 168,
    "last_score": 11207,
    "last_position": 166
  },
  {
    "player": "man-of-iron",
    "board": "total_xp",
    "score": 11414,
    "position": 169,
    "last_score": 10731,
    "last_position": 179
  },
  {
    "player": "sacramentum",
    "board": "total_xp",
    "score": 11312,
    "position": 170,
    "last_score": 10812,
    "last_position": 177
  },
  {
    "player": "azeboug",
    "board": "total_xp",
    "score": 11238,
    "position": 171,
    "last_score": 10630,
    "last_position": 184
  },
  {
    "player": "ool",
    "board": "total_xp",
    "score": 11184,
    "position": 172,
    "last_score": 11184,
    "last_position": 167
  },
  {
    "player": "mr.otz",
    "board": "total_xp",
    "score": 11154,
    "position": 173,
    "last_score": 11154,
    "last_position": 168
  },
  {
    "player": "cbnm",
    "board": "total_xp",
    "score": 11152,
    "position": 174,
    "last_score": 10690,
    "last_position": 183
  },
  {
    "player": "shuzi",
    "board": "total_xp",
    "score": 10991,
    "position": 175,
    "last_score": 9906,
    "last_position": 200
  },
  {
    "player": "blu",
    "board": "total_xp",
    "score": 10989,
    "position": 176,
    "last_score": 10806,
    "last_position": 178
  },
  {
    "player": "kuni",
    "board": "total_xp",
    "score": 10985,
    "position": 177,
    "last_score": 10985,
    "last_position": 171
  },
  {
    "player": "lime00",
    "board": "total_xp",
    "score": 10976,
    "position": 178,
    "last_score": 10976,
    "last_position": 172
  },
  {
    "player": "dzevis",
    "board": "total_xp",
    "score": 10970,
    "position": 179,
    "last_score": 10473,
    "last_position": 187
  },
  {
    "player": "zodd0034",
    "board": "total_xp",
    "score": 10959,
    "position": 180,
    "last_score": 10959,
    "last_position": 173
  },
  {
    "player": "mosan",
    "board": "total_xp",
    "score": 10949,
    "position": 181,
    "last_score": 10949,
    "last_position": 174
  },
  {
    "player": "kkcity",
    "board": "total_xp",
    "score": 10924,
    "position": 182,
    "last_score": 10692,
    "last_position": 182
  },
  {
    "player": "dirkas",
    "board": "total_xp",
    "score": 10920,
    "position": 183,
    "last_score": 10869,
    "last_position": 176
  },
  {
    "player": "njdangerous1",
    "board": "total_xp",
    "score": 10897,
    "position": 184,
    "last_score": 10897,
    "last_position": 175
  },
  {
    "player": "y2k000000",
    "board": "total_xp",
    "score": 10769,
    "position": 185,
    "last_score": 9715,
    "last_position": 207
  },
  {
    "player": "flytitan",
    "board": "total_xp",
    "score": 10704,
    "position": 186,
    "last_score": 10704,
    "last_position": 180
  },
  {
    "player": "1139",
    "board": "total_xp",
    "score": 10694,
    "position": 187,
    "last_score": 10694,
    "last_position": 181
  },
  {
    "player": "island main",
    "board": "total_xp",
    "score": 10503,
    "position": 188,
    "last_score": 10503,
    "last_position": 185
  },
  {
    "player": "ugvboy",
    "board": "total_xp",
    "score": 10476,
    "position": 189,
    "last_score": 10476,
    "last_position": 186
  },
  {
    "player": "gozt",
    "board": "total_xp",
    "score": 10404,
    "position": 190,
    "last_score": 10260,
    "last_position": 190
  },
  {
    "player": "rattler",
    "board": "total_xp",
    "score": 10404,
    "position": 191,
    "last_score": 9762,
    "last_position": 206
  },
  {
    "player": "_clochard_",
    "board": "total_xp",
    "score": 10375,
    "position": 192,
    "last_score": 10375,
    "last_position": 188
  },
  {
    "player": "0100039403",
    "board": "total_xp",
    "score": 10367,
    "position": 193,
    "last_score": 10035,
    "last_position": 198
  },
  {
    "player": "delyrium",
    "board": "total_xp",
    "score": 10335,
    "position": 194,
    "last_score": 9812,
    "last_position": 205
  },
  {
    "player": "tjkzjzx",
    "board": "total_xp",
    "score": 10325,
    "position": 195,
    "last_score": 10325,
    "last_position": 189
  },
  {
    "player": "asa0408",
    "board": "total_xp",
    "score": 10317,
    "position": 196,
    "last_score": 10206,
    "last_position": 194
  },
  {
    "player": "cmforgame",
    "board": "total_xp",
    "score": 10245,
    "position": 197,
    "last_score": 10245,
    "last_position": 191
  },
  {
    "player": "rafonis",
    "board": "total_xp",
    "score": 10229,
    "position": 198,
    "last_score": 10229,
    "last_position": 192
  },
  {
    "player": "xuemin",
    "board": "total_xp",
    "score": 10227,
    "position": 199,
    "last_score": 10227,
    "last_position": 193
  },
  {
    "player": "knew",
    "board": "total_xp",
    "score": 10177,
    "position": 200,
    "last_score": 10177,
    "last_position": 195
  },
  {
    "player": "391",
    "board": "total_xp",
    "score": 10132,
    "position": 201,
    "last_score": 10132,
    "last_position": 196
  },
  {
    "player": "grumpette365",
    "board": "total_xp",
    "score": 10108,
    "position": 202,
    "last_score": 10078,
    "last_position": 197
  },
  {
    "player": "pharazon",
    "board": "total_xp",
    "score": 10049,
    "position": 203,
    "last_score": null,
    "last_position": null
  },
  {
    "player": "heheunknown",
    "board": "total_xp",
    "score": 10025,
    "position": 204,
    "last_score": 9456,
    "last_position": 210
  },
  {
    "player": "kkiolk",
    "board": "total_xp",
    "score": 9998,
    "position": 205,
    "last_score": 9974,
    "last_position": 199
  },
  {
    "player": "rawr",
    "board": "total_xp",
    "score": 9959,
    "position": 206,
    "last_score": 9138,
    "last_position": 220
  },
  {
    "player": "tizequieal",
    "board": "total_xp",
    "score": 9902,
    "position": 207,
    "last_score": 9902,
    "last_position": 201
  },
  {
    "player": "bloodymoon",
    "board": "total_xp",
    "score": 9882,
    "position": 208,
    "last_score": 9844,
    "last_position": 204
  },
  {
    "player": "solerus",
    "board": "total_xp",
    "score": 9880,
    "position": 209,
    "last_score": 9869,
    "last_position": 203
  },
  {
    "player": "zhoubohang",
    "board": "total_xp",
    "score": 9877,
    "position": 210,
    "last_score": 9877,
    "last_position": 202
  },
  {
    "player": "lucid dreamz",
    "board": "total_xp",
    "score": 9853,
    "position": 211,
    "last_score": 9514,
    "last_position": 209
  },
  {
    "player": "abdur",
    "board": "total_xp",
    "score": 9818,
    "position": 212,
    "last_score": 9296,
    "last_position": 215
  },
  {
    "player": "world tree",
    "board": "total_xp",
    "score": 9581,
    "position": 213,
    "last_score": 9580,
    "last_position": 208
  },
  {
    "player": "survion",
    "board": "total_xp",
    "score": 9490,
    "position": 214,
    "last_score": 8579,
    "last_position": 236
  },
  {
    "player": "keakdaox",
    "board": "total_xp",
    "score": 9481,
    "position": 215,
    "last_score": 9445,
    "last_position": 211
  },
  {
    "player": "gichtinge",
    "board": "total_xp",
    "score": 9468,
    "position": 216,
    "last_score": 9174,
    "last_position": 219
  },
  {
    "player": "earthdragon",
    "board": "total_xp",
    "score": 9431,
    "position": 217,
    "last_score": 9284,
    "last_position": 216
  },
  {
    "player": "leveler",
    "board": "total_xp",
    "score": 9408,
    "position": 218,
    "last_score": 9408,
    "last_position": 212
  },
  {
    "player": "merkad",
    "board": "total_xp",
    "score": 9398,
    "position": 219,
    "last_score": 9319,
    "last_position": 213
  },
  {
    "player": "tekxzero",
    "board": "total_xp",
    "score": 9378,
    "position": 220,
    "last_score": 8738,
    "last_position": 229
  },
  {
    "player": "gizde",
    "board": "total_xp",
    "score": 9307,
    "position": 221,
    "last_score": 9221,
    "last_position": 218
  },
  {
    "player": "expup",
    "board": "total_xp",
    "score": 9301,
    "position": 222,
    "last_score": 9301,
    "last_position": 214
  },
  {
    "player": "fisherman fred",
    "board": "total_xp",
    "score": 9230,
    "position": 223,
    "last_score": 9230,
    "last_position": 217
  },
  {
    "player": "melkas",
    "board": "total_xp",
    "score": 9158,
    "position": 224,
    "last_score": 8553,
    "last_position": 239
  },
  {
    "player": "sirgoldon",
    "board": "total_xp",
    "score": 9096,
    "position": 225,
    "last_score": 8729,
    "last_position": 230
  },
  {
    "player": "fhik",
    "board": "total_xp",
    "score": 9090,
    "position": 226,
    "last_score": 9090,
    "last_position": 221
  },
  {
    "player": "269",
    "board": "total_xp",
    "score": 9035,
    "position": 227,
    "last_score": 8754,
    "last_position": 228
  },
  {
    "player": "spevan",
    "board": "total_xp",
    "score": 9035,
    "position": 228,
    "last_score": 8729,
    "last_position": 231
  },
  {
    "player": "wk699503",
    "board": "total_xp",
    "score": 9033,
    "position": 229,
    "last_score": 8410,
    "last_position": 244
  },
  {
    "player": "cauvongcvc",
    "board": "total_xp",
    "score": 9032,
    "position": 230,
    "last_score": 8263,
    "last_position": 249
  },
  {
    "player": "heykak",
    "board": "total_xp",
    "score": 9016,
    "position": 231,
    "last_score": 8334,
    "last_position": 246
  },
  {
    "player": "knight vladymyr",
    "board": "total_xp",
    "score": 9009,
    "position": 232,
    "last_score": 9009,
    "last_position": 222
  },
  {
    "player": "maskedecho",
    "board": "total_xp",
    "score": 8999,
    "position": 233,
    "last_score": 8519,
    "last_position": 240
  },
  {
    "player": "kamaara",
    "board": "total_xp",
    "score": 8949,
    "position": 234,
    "last_score": 8949,
    "last_position": 223
  },
  {
    "player": "aptx4869",
    "board": "total_xp",
    "score": 8938,
    "position": 235,
    "last_score": 8938,
    "last_position": 224
  },
  {
    "player": "********",
    "board": "total_xp",
    "score": 8937,
    "position": 236,
    "last_score": 8845,
    "last_position": 226
  },
  {
    "player": "morizius",
    "board": "total_xp",
    "score": 8908,
    "position": 237,
    "last_score": 8679,
    "last_position": 234
  },
  {
    "player": "suson979",
    "board": "total_xp",
    "score": 8897,
    "position": 238,
    "last_score": 8888,
    "last_position": 225
  },
  {
    "player": "dustin",
    "board": "total_xp",
    "score": 8896,
    "position": 239,
    "last_score": 8704,
    "last_position": 233
  },
  {
    "player": "stelio contos",
    "board": "total_xp",
    "score": 8844,
    "position": 240,
    "last_score": 7862,
    "last_position": 269
  },
  {
    "player": "oujinhao",
    "board": "total_xp",
    "score": 8785,
    "position": 241,
    "last_score": 8128,
    "last_position": 255
  },
  {
    "player": "mao9201",
    "board": "total_xp",
    "score": 8781,
    "position": 242,
    "last_score": 8781,
    "last_position": 227
  },
  {
    "player": "dededio17",
    "board": "total_xp",
    "score": 8778,
    "position": 243,
    "last_score": 8217,
    "last_position": 252
  },
  {
    "player": "alfaice",
    "board": "total_xp",
    "score": 8736,
    "position": 244,
    "last_score": 7806,
    "last_position": 271
  },
  {
    "player": "virir",
    "board": "total_xp",
    "score": 8722,
    "position": 245,
    "last_score": 8654,
    "last_position": 235
  },
  {
    "player": "aflek",
    "board": "total_xp",
    "score": 8714,
    "position": 246,
    "last_score": 8714,
    "last_position": 232
  },
  {
    "player": "j22y",
    "board": "total_xp",
    "score": 8641,
    "position": 247,
    "last_score": 7895,
    "last_position": 265
  },
  {
    "player": "dirt digger",
    "board": "total_xp",
    "score": 8636,
    "position": 248,
    "last_score": 8569,
    "last_position": 237
  },
  {
    "player": "sagradanoche",
    "board": "total_xp",
    "score": 8621,
    "position": 249,
    "last_score": 7186,
    "last_position": 302
  },
  {
    "player": "hotknight",
    "board": "total_xp",
    "score": 8601,
    "position": 250,
    "last_score": 8111,
    "last_position": 256
  },
  {
    "player": "athe beast 666",
    "board": "total_xp",
    "score": 8554,
    "position": 251,
    "last_score": 8554,
    "last_position": 238
  },
  {
    "player": "ryuuguu rena",
    "board": "total_xp",
    "score": 8474,
    "position": 252,
    "last_score": 7414,
    "last_position": 289
  },
  {
    "player": "lemmewinks",
    "board": "total_xp",
    "score": 8472,
    "position": 253,
    "last_score": 8472,
    "last_position": 241
  },
  {
    "player": "ethelle",
    "board": "total_xp",
    "score": 8455,
    "position": 254,
    "last_score": 8451,
    "last_position": 242
  },
  {
    "player": "william1021",
    "board": "total_xp",
    "score": 8433,
    "position": 255,
    "last_score": 8433,
    "last_position": 243
  },
  {
    "player": "y30015669",
    "board": "total_xp",
    "score": 8413,
    "position": 256,
    "last_score": 8356,
    "last_position": 245
  },
  {
    "player": "sd20368806",
    "board": "total_xp",
    "score": 8395,
    "position": 257,
    "last_score": 8322,
    "last_position": 248
  },
  {
    "player": "quirco",
    "board": "total_xp",
    "score": 8369,
    "position": 258,
    "last_score": 7657,
    "last_position": 279
  },
  {
    "player": "nain puissant",
    "board": "total_xp",
    "score": 8354,
    "position": 259,
    "last_score": 7872,
    "last_position": 267
  },
  {
    "player": "shirs",
    "board": "total_xp",
    "score": 8325,
    "position": 260,
    "last_score": 8325,
    "last_position": 247
  },
  {
    "player": "as57789",
    "board": "total_xp",
    "score": 8260,
    "position": 261,
    "last_score": 8260,
    "last_position": 250
  },
  {
    "player": "vanamoinen",
    "board": "total_xp",
    "score": 8252,
    "position": 262,
    "last_score": 8240,
    "last_position": 251
  },
  {
    "player": "hamjam",
    "board": "total_xp",
    "score": 8230,
    "position": 263,
    "last_score": 7789,
    "last_position": 272
  },
  {
    "player": "smokeydapanda",
    "board": "total_xp",
    "score": 8220,
    "position": 264,
    "last_score": 8169,
    "last_position": 253
  },
  {
    "player": "monicafish",
    "board": "total_xp",
    "score": 8219,
    "position": 265,
    "last_score": 8036,
    "last_position": 259
  },
  {
    "player": "akheker",
    "board": "total_xp",
    "score": 8168,
    "position": 266,
    "last_score": 8018,
    "last_position": 260
  },
  {
    "player": "whiteshark",
    "board": "total_xp",
    "score": 8158,
    "position": 267,
    "last_score": 8158,
    "last_position": 254
  },
  {
    "player": "edric1996",
    "board": "total_xp",
    "score": 8121,
    "position": 268,
    "last_score": 8002,
    "last_position": 261
  },
  {
    "player": "foxxes",
    "board": "total_xp",
    "score": 8117,
    "position": 269,
    "last_score": 8100,
    "last_position": 258
  },
  {
    "player": "futureismine",
    "board": "total_xp",
    "score": 8111,
    "position": 270,
    "last_score": 8104,
    "last_position": 257
  },
  {
    "player": "-viking-",
    "board": "total_xp",
    "score": 8082,
    "position": 271,
    "last_score": 7750,
    "last_position": 274
  },
  {
    "player": "geansebastian",
    "board": "total_xp",
    "score": 8003,
    "position": 272,
    "last_score": 7902,
    "last_position": 264
  },
  {
    "player": "stzuh",
    "board": "total_xp",
    "score": 7999,
    "position": 273,
    "last_score": 7999,
    "last_position": 262
  },
  {
    "player": "raaay",
    "board": "total_xp",
    "score": 7950,
    "position": 274,
    "last_score": 7488,
    "last_position": 285
  },
  {
    "player": "a_men",
    "board": "total_xp",
    "score": 7939,
    "position": 275,
    "last_score": 7661,
    "last_position": 277
  },
  {
    "player": "reim",
    "board": "total_xp",
    "score": 7916,
    "position": 276,
    "last_score": 7916,
    "last_position": 263
  },
  {
    "player": "eddau",
    "board": "total_xp",
    "score": 7896,
    "position": 277,
    "last_score": 7828,
    "last_position": 270
  },
  {
    "player": "0ink",
    "board": "total_xp",
    "score": 7889,
    "position": 278,
    "last_score": 7889,
    "last_position": 266
  },
  {
    "player": "fairwind",
    "board": "total_xp",
    "score": 7868,
    "position": 279,
    "last_score": 7354,
    "last_position": 293
  },
  {
    "player": "hamscout",
    "board": "total_xp",
    "score": 7862,
    "position": 280,
    "last_score": 7862,
    "last_position": 268
  },
  {
    "player": "voltoyle",
    "board": "total_xp",
    "score": 7762,
    "position": 281,
    "last_score": 7762,
    "last_position": 273
  },
  {
    "player": "giddeon",
    "board": "total_xp",
    "score": 7746,
    "position": 282,
    "last_score": 7436,
    "last_position": 288
  },
  {
    "player": "neekz",
    "board": "total_xp",
    "score": 7730,
    "position": 283,
    "last_score": 7474,
    "last_position": 286
  },
  {
    "player": "schpl",
    "board": "total_xp",
    "score": 7718,
    "position": 284,
    "last_score": 7718,
    "last_position": 275
  },
  {
    "player": "petermax",
    "board": "total_xp",
    "score": 7709,
    "position": 285,
    "last_score": 7709,
    "last_position": 276
  },
  {
    "player": "dustywraith",
    "board": "total_xp",
    "score": 7672,
    "position": 286,
    "last_score": 7652,
    "last_position": 280
  },
  {
    "player": "a poor xiaohudie",
    "board": "total_xp",
    "score": 7657,
    "position": 287,
    "last_score": 7657,
    "last_position": 278
  },
  {
    "player": "chenci",
    "board": "total_xp",
    "score": 7656,
    "position": 288,
    "last_score": 7651,
    "last_position": 281
  },
  {
    "player": "ov3rx",
    "board": "total_xp",
    "score": 7597,
    "position": 289,
    "last_score": 7230,
    "last_position": 299
  },
  {
    "player": "syphon",
    "board": "total_xp",
    "score": 7594,
    "position": 290,
    "last_score": 7351,
    "last_position": 294
  },
  {
    "player": "ecnlee",
    "board": "total_xp",
    "score": 7588,
    "position": 291,
    "last_score": 7588,
    "last_position": 282
  },
  {
    "player": "clubo666",
    "board": "total_xp",
    "score": 7514,
    "position": 292,
    "last_score": 7490,
    "last_position": 284
  },
  {
    "player": "xintiao",
    "board": "total_xp",
    "score": 7506,
    "position": 293,
    "last_score": 7506,
    "last_position": 283
  },
  {
    "player": "rhythm",
    "board": "total_xp",
    "score": 7490,
    "position": 294,
    "last_score": 7370,
    "last_position": 290
  },
  {
    "player": "aaa159",
    "board": "total_xp",
    "score": 7473,
    "position": 295,
    "last_score": 6868,
    "last_position": 322
  },
  {
    "player": "mike",
    "board": "total_xp",
    "score": 7459,
    "position": 296,
    "last_score": 7459,
    "last_position": 287
  },
  {
    "player": "brutamontes",
    "board": "total_xp",
    "score": 7456,
    "position": 297,
    "last_score": 7205,
    "last_position": 300
  },
  {
    "player": "misterashesin",
    "board": "total_xp",
    "score": 7438,
    "position": 298,
    "last_score": 7177,
    "last_position": 303
  },
  {
    "player": "lightwarrior78",
    "board": "total_xp",
    "score": 7432,
    "position": 299,
    "last_score": 7045,
    "last_position": 312
  },
  {
    "player": "shopkeeper (npc)",
    "board": "total_xp",
    "score": 7421,
    "position": 300,
    "last_score": 7340,
    "last_position": 295
  },
  {
    "player": "u77-fate",
    "board": "total_xp",
    "score": 7363,
    "position": 301,
    "last_score": 7363,
    "last_position": 291
  },
  {
    "player": "rawbirt",
    "board": "total_xp",
    "score": 7362,
    "position": 302,
    "last_score": 7362,
    "last_position": 292
  },
  {
    "player": "kalmage",
    "board": "total_xp",
    "score": 7329,
    "position": 303,
    "last_score": 7329,
    "last_position": 296
  },
  {
    "player": "galactus",
    "board": "total_xp",
    "score": 7317,
    "position": 304,
    "last_score": 7317,
    "last_position": 297
  },
  {
    "player": "aphrodite",
    "board": "total_xp",
    "score": 7283,
    "position": 305,
    "last_score": 7149,
    "last_position": 306
  },
  {
    "player": "ddraig",
    "board": "total_xp",
    "score": 7280,
    "position": 306,
    "last_score": 7279,
    "last_position": 298
  },
  {
    "player": "kaaleppibormann",
    "board": "total_xp",
    "score": 7246,
    "position": 307,
    "last_score": 7123,
    "last_position": 308
  },
  {
    "player": "matthew3935",
    "board": "total_xp",
    "score": 7203,
    "position": 308,
    "last_score": 7203,
    "last_position": 301
  },
  {
    "player": "z e n i t h",
    "board": "total_xp",
    "score": 7189,
    "position": 309,
    "last_score": 7091,
    "last_position": 309
  },
  {
    "player": "macavele",
    "board": "total_xp",
    "score": 7176,
    "position": 310,
    "last_score": 7019,
    "last_position": 313
  },
  {
    "player": "jjota",
    "board": "total_xp",
    "score": 7170,
    "position": 311,
    "last_score": 7170,
    "last_position": 304
  },
  {
    "player": "dr007",
    "board": "total_xp",
    "score": 7152,
    "position": 312,
    "last_score": 7152,
    "last_position": 305
  },
  {
    "player": "sapiens",
    "board": "total_xp",
    "score": 7149,
    "position": 313,
    "last_score": 7148,
    "last_position": 307
  },
  {
    "player": "sparksofrage",
    "board": "total_xp",
    "score": 7142,
    "position": 314,
    "last_score": 6919,
    "last_position": 320
  },
  {
    "player": "khunpann",
    "board": "total_xp",
    "score": 7128,
    "position": 315,
    "last_score": 6167,
    "last_position": 364
  },
  {
    "player": "litexa",
    "board": "total_xp",
    "score": 7125,
    "position": 316,
    "last_score": 6940,
    "last_position": 317
  },
  {
    "player": "crazymo",
    "board": "total_xp",
    "score": 7111,
    "position": 317,
    "last_score": 6744,
    "last_position": 330
  },
  {
    "player": "a987",
    "board": "total_xp",
    "score": 7070,
    "position": 318,
    "last_score": 7070,
    "last_position": 310
  },
  {
    "player": "sarah quill",
    "board": "total_xp",
    "score": 7064,
    "position": 319,
    "last_score": 7064,
    "last_position": 311
  },
  {
    "player": "propater",
    "board": "total_xp",
    "score": 7032,
    "position": 320,
    "last_score": 6438,
    "last_position": 346
  },
  {
    "player": "whereiam1",
    "board": "total_xp",
    "score": 7030,
    "position": 321,
    "last_score": 6350,
    "last_position": 355
  },
  {
    "player": "waaaaa13",
    "board": "total_xp",
    "score": 7021,
    "position": 322,
    "last_score": 6546,
    "last_position": 339
  },
  {
    "player": "kayer",
    "board": "total_xp",
    "score": 7002,
    "position": 323,
    "last_score": 7002,
    "last_position": 314
  },
  {
    "player": "nxnhsj",
    "board": "total_xp",
    "score": 6996,
    "position": 324,
    "last_score": 6481,
    "last_position": 345
  },
  {
    "player": "inflameous",
    "board": "total_xp",
    "score": 6980,
    "position": 325,
    "last_score": 6980,
    "last_position": 315
  },
  {
    "player": "haploz",
    "board": "total_xp",
    "score": 6965,
    "position": 326,
    "last_score": 6965,
    "last_position": 316
  },
  {
    "player": "crowatian",
    "board": "total_xp",
    "score": 6958,
    "position": 327,
    "last_score": 6536,
    "last_position": 341
  },
  {
    "player": "midart1986",
    "board": "total_xp",
    "score": 6921,
    "position": 328,
    "last_score": 6921,
    "last_position": 318
  },
  {
    "player": "spaceon",
    "board": "total_xp",
    "score": 6921,
    "position": 329,
    "last_score": 6921,
    "last_position": 319
  },
  {
    "player": "jalical",
    "board": "total_xp",
    "score": 6915,
    "position": 330,
    "last_score": 6915,
    "last_position": 321
  },
  {
    "player": "truaslaique",
    "board": "total_xp",
    "score": 6859,
    "position": 331,
    "last_score": 6859,
    "last_position": 323
  },
  {
    "player": "edwardliu",
    "board": "total_xp",
    "score": 6830,
    "position": 332,
    "last_score": 6830,
    "last_position": 324
  },
  {
    "player": "kalista",
    "board": "total_xp",
    "score": 6787,
    "position": 333,
    "last_score": 6778,
    "last_position": 325
  },
  {
    "player": "puglife",
    "board": "total_xp",
    "score": 6766,
    "position": 334,
    "last_score": 6766,
    "last_position": 326
  },
  {
    "player": "m1krebs",
    "board": "total_xp",
    "score": 6765,
    "position": 335,
    "last_score": 6755,
    "last_position": 328
  },
  {
    "player": "kioki",
    "board": "total_xp",
    "score": 6756,
    "position": 336,
    "last_score": 6755,
    "last_position": 327
  },
  {
    "player": "ypyzhiming",
    "board": "total_xp",
    "score": 6751,
    "position": 337,
    "last_score": 6751,
    "last_position": 329
  },
  {
    "player": "waynelaw",
    "board": "total_xp",
    "score": 6718,
    "position": 338,
    "last_score": 6718,
    "last_position": 331
  },
  {
    "player": "rebelmoon",
    "board": "total_xp",
    "score": 6712,
    "position": 339,
    "last_score": 6712,
    "last_position": 332
  },
  {
    "player": "swamp",
    "board": "total_xp",
    "score": 6678,
    "position": 340,
    "last_score": 6604,
    "last_position": 336
  },
  {
    "player": "mr. smells bad",
    "board": "total_xp",
    "score": 6677,
    "position": 341,
    "last_score": 6677,
    "last_position": 333
  },
  {
    "player": "gritogod",
    "board": "total_xp",
    "score": 6673,
    "position": 342,
    "last_score": 6673,
    "last_position": 334
  },
  {
    "player": "!zx",
    "board": "total_xp",
    "score": 6662,
    "position": 343,
    "last_score": 6662,
    "last_position": 335
  },
  {
    "player": "!midas",
    "board": "total_xp",
    "score": 6656,
    "position": 344,
    "last_score": 6287,
    "last_position": 358
  },
  {
    "player": "drizzt",
    "board": "total_xp",
    "score": 6574,
    "position": 345,
    "last_score": 6574,
    "last_position": 337
  },
  {
    "player": "banderollo",
    "board": "total_xp",
    "score": 6547,
    "position": 346,
    "last_score": 6547,
    "last_position": 338
  },
  {
    "player": "endprophet",
    "board": "total_xp",
    "score": 6539,
    "position": 347,
    "last_score": 6539,
    "last_position": 340
  },
  {
    "player": "vcops85",
    "board": "total_xp",
    "score": 6534,
    "position": 348,
    "last_score": 6534,
    "last_position": 342
  },
  {
    "player": "anadroxas",
    "board": "total_xp",
    "score": 6514,
    "position": 349,
    "last_score": 6514,
    "last_position": 343
  },
  {
    "player": "masonlikeboss",
    "board": "total_xp",
    "score": 6494,
    "position": 350,
    "last_score": 6489,
    "last_position": 344
  },
  {
    "player": "bastiaan248",
    "board": "total_xp",
    "score": 6482,
    "position": 351,
    "last_score": 6408,
    "last_position": 350
  },
  {
    "player": "fatal3000",
    "board": "total_xp",
    "score": 6441,
    "position": 352,
    "last_score": 5853,
    "last_position": 376
  },
  {
    "player": "-coolaid-",
    "board": "total_xp",
    "score": 6435,
    "position": 353,
    "last_score": 6435,
    "last_position": 347
  },
  {
    "player": "fuko_ibuki",
    "board": "total_xp",
    "score": 6422,
    "position": 354,
    "last_score": 6422,
    "last_position": 348
  },
  {
    "player": "eliska",
    "board": "total_xp",
    "score": 6420,
    "position": 355,
    "last_score": 6400,
    "last_position": 351
  },
  {
    "player": "celebiration",
    "board": "total_xp",
    "score": 6416,
    "position": 356,
    "last_score": 6416,
    "last_position": 349
  },
  {
    "player": "raphiti44",
    "board": "total_xp",
    "score": 6392,
    "position": 357,
    "last_score": 6392,
    "last_position": 352
  },
  {
    "player": "frankieckc",
    "board": "total_xp",
    "score": 6353,
    "position": 358,
    "last_score": 6353,
    "last_position": 353
  },
  {
    "player": "jet823",
    "board": "total_xp",
    "score": 6352,
    "position": 359,
    "last_score": 6264,
    "last_position": 359
  },
  {
    "player": "infestedbr",
    "board": "total_xp",
    "score": 6350,
    "position": 360,
    "last_score": 6350,
    "last_position": 354
  },
  {
    "player": "taodylan",
    "board": "total_xp",
    "score": 6337,
    "position": 361,
    "last_score": 6337,
    "last_position": 356
  },
  {
    "player": "phyron92",
    "board": "total_xp",
    "score": 6332,
    "position": 362,
    "last_score": 6187,
    "last_position": 363
  },
  {
    "player": "r80295ant",
    "board": "total_xp",
    "score": 6303,
    "position": 363,
    "last_score": 6290,
    "last_position": 357
  },
  {
    "player": "747049291",
    "board": "total_xp",
    "score": 6251,
    "position": 364,
    "last_score": 6251,
    "last_position": 360
  },
  {
    "player": "wdxynxl",
    "board": "total_xp",
    "score": 6243,
    "position": 365,
    "last_score": 6243,
    "last_position": 361
  },
  {
    "player": "aai",
    "board": "total_xp",
    "score": 6209,
    "position": 366,
    "last_score": 6046,
    "last_position": 370
  },
  {
    "player": "mannyyyyyy",
    "board": "total_xp",
    "score": 6206,
    "position": 367,
    "last_score": 6206,
    "last_position": 362
  },
  {
    "player": "dxvcd2010",
    "board": "total_xp",
    "score": 6153,
    "position": 368,
    "last_score": 6153,
    "last_position": 365
  },
  {
    "player": "abc02",
    "board": "total_xp",
    "score": 6125,
    "position": 369,
    "last_score": 6031,
    "last_position": 371
  },
  {
    "player": "acu902",
    "board": "total_xp",
    "score": 6112,
    "position": 370,
    "last_score": 6112,
    "last_position": 366
  },
  {
    "player": "pained hope",
    "board": "total_xp",
    "score": 6100,
    "position": 371,
    "last_score": 6100,
    "last_position": 367
  },
  {
    "player": "stipster",
    "board": "total_xp",
    "score": 6098,
    "position": 372,
    "last_score": 6098,
    "last_position": 368
  },
  {
    "player": "warsank",
    "board": "total_xp",
    "score": 6098,
    "position": 373,
    "last_score": 5381,
    "last_position": 399
  },
  {
    "player": "gertlin",
    "board": "total_xp",
    "score": 6053,
    "position": 374,
    "last_score": 6053,
    "last_position": 369
  },
  {
    "player": "othose",
    "board": "total_xp",
    "score": 5998,
    "position": 375,
    "last_score": null,
    "last_position": null
  },
  {
    "player": "tonysk1",
    "board": "total_xp",
    "score": 5996,
    "position": 376,
    "last_score": 5996,
    "last_position": 372
  },
  {
    "player": "dundeehitman",
    "board": "total_xp",
    "score": 5970,
    "position": 377,
    "last_score": 5841,
    "last_position": 377
  },
  {
    "player": "clipcup",
    "board": "total_xp",
    "score": 5902,
    "position": 378,
    "last_score": 5901,
    "last_position": 373
  },
  {
    "player": "gnomeu",
    "board": "total_xp",
    "score": 5899,
    "position": 379,
    "last_score": 5896,
    "last_position": 374
  },
  {
    "player": "tsukino",
    "board": "total_xp",
    "score": 5876,
    "position": 380,
    "last_score": 5876,
    "last_position": 375
  },
  {
    "player": "vaniek",
    "board": "total_xp",
    "score": 5843,
    "position": 381,
    "last_score": 5559,
    "last_position": 389
  },
  {
    "player": "prolipig",
    "board": "total_xp",
    "score": 5834,
    "position": 382,
    "last_score": 5834,
    "last_position": 378
  },
  {
    "player": "rod",
    "board": "total_xp",
    "score": 5809,
    "position": 383,
    "last_score": 5472,
    "last_position": 394
  },
  {
    "player": "zhenghh",
    "board": "total_xp",
    "score": 5780,
    "position": 384,
    "last_score": 5780,
    "last_position": 379
  },
  {
    "player": "candrial",
    "board": "total_xp",
    "score": 5751,
    "position": 385,
    "last_score": 5750,
    "last_position": 380
  },
  {
    "player": "tz88888888",
    "board": "total_xp",
    "score": 5751,
    "position": 386,
    "last_score": 5518,
    "last_position": 391
  },
  {
    "player": "three dead",
    "board": "total_xp",
    "score": 5724,
    "position": 387,
    "last_score": 5588,
    "last_position": 388
  },
  {
    "player": "teslatothemoon",
    "board": "total_xp",
    "score": 5707,
    "position": 388,
    "last_score": 4733,
    "last_position": 443
  },
  {
    "player": "tartan",
    "board": "total_xp",
    "score": 5705,
    "position": 389,
    "last_score": 5420,
    "last_position": 396
  },
  {
    "player": "ilovemo",
    "board": "total_xp",
    "score": 5690,
    "position": 390,
    "last_score": 5690,
    "last_position": 381
  },
  {
    "player": "rizzrotte",
    "board": "total_xp",
    "score": 5684,
    "position": 391,
    "last_score": 5641,
    "last_position": 385
  },
  {
    "player": "nanala",
    "board": "total_xp",
    "score": 5678,
    "position": 392,
    "last_score": 5678,
    "last_position": 382
  },
  {
    "player": "edgewesley",
    "board": "total_xp",
    "score": 5657,
    "position": 393,
    "last_score": 5657,
    "last_position": 383
  },
  {
    "player": "wizardstale",
    "board": "total_xp",
    "score": 5656,
    "position": 394,
    "last_score": 5656,
    "last_position": 384
  },
  {
    "player": "57552526",
    "board": "total_xp",
    "score": 5637,
    "position": 395,
    "last_score": 5637,
    "last_position": 386
  },
  {
    "player": "linglingfa",
    "board": "total_xp",
    "score": 5618,
    "position": 396,
    "last_score": 5618,
    "last_position": 387
  },
  {
    "player": "jill",
    "board": "total_xp",
    "score": 5608,
    "position": 397,
    "last_score": 5370,
    "last_position": 400
  },
  {
    "player": "meliane",
    "board": "total_xp",
    "score": 5539,
    "position": 398,
    "last_score": 5539,
    "last_position": 390
  },
  {
    "player": "spi",
    "board": "total_xp",
    "score": 5535,
    "position": 399,
    "last_score": 4788,
    "last_position": 433
  },
  {
    "player": "robosuckula",
    "board": "total_xp",
    "score": 5484,
    "position": 400,
    "last_score": 5484,
    "last_position": 392
  },
  {
    "player": "mi7a4o",
    "board": "total_xp",
    "score": 5477,
    "position": 401,
    "last_score": 5477,
    "last_position": 393
  },
  {
    "player": "lizard_egg",
    "board": "total_xp",
    "score": 5451,
    "position": 402,
    "last_score": 4821,
    "last_position": 432
  },
  {
    "player": "pliushinis",
    "board": "total_xp",
    "score": 5450,
    "position": 403,
    "last_score": null,
    "last_position": null
  },
  {
    "player": "disco-neck-ted",
    "board": "total_xp",
    "score": 5431,
    "position": 404,
    "last_score": 5111,
    "last_position": 415
  },
  {
    "player": "fluttershy",
    "board": "total_xp",
    "score": 5426,
    "position": 405,
    "last_score": 5426,
    "last_position": 395
  },
  {
    "player": "mishtav2",
    "board": "total_xp",
    "score": 5418,
    "position": 406,
    "last_score": 5221,
    "last_position": 407
  },
  {
    "player": "finrod",
    "board": "total_xp",
    "score": 5412,
    "position": 407,
    "last_score": 4727,
    "last_position": 444
  },
  {
    "player": "yes it's tough",
    "board": "total_xp",
    "score": 5412,
    "position": 408,
    "last_score": 5412,
    "last_position": 397
  },
  {
    "player": "zaydimon",
    "board": "total_xp",
    "score": 5404,
    "position": 409,
    "last_score": 5404,
    "last_position": 398
  },
  {
    "player": "jaydewolf",
    "board": "total_xp",
    "score": 5367,
    "position": 410,
    "last_score": 5367,
    "last_position": 401
  },
  {
    "player": "eiivix",
    "board": "total_xp",
    "score": 5359,
    "position": 411,
    "last_score": 4660,
    "last_position": 446
  },
  {
    "player": "pokerchips",
    "board": "total_xp",
    "score": 5352,
    "position": 412,
    "last_score": 5352,
    "last_position": 402
  },
  {
    "player": "bastyrova",
    "board": "total_xp",
    "score": 5321,
    "position": 413,
    "last_score": 5321,
    "last_position": 403
  },
  {
    "player": "maxsanderson",
    "board": "total_xp",
    "score": 5313,
    "position": 414,
    "last_score": 5313,
    "last_position": 404
  },
  {
    "player": "gian700",
    "board": "total_xp",
    "score": 5301,
    "position": 415,
    "last_score": 4646,
    "last_position": 447
  },
  {
    "player": "trendy_didi",
    "board": "total_xp",
    "score": 5266,
    "position": 416,
    "last_score": 5266,
    "last_position": 405
  },
  {
    "player": "mamoya",
    "board": "total_xp",
    "score": 5234,
    "position": 417,
    "last_score": 5234,
    "last_position": 406
  },
  {
    "player": "luv",
    "board": "total_xp",
    "score": 5213,
    "position": 418,
    "last_score": 5213,
    "last_position": 408
  },
  {
    "player": "rdyplayerone",
    "board": "total_xp",
    "score": 5211,
    "position": 419,
    "last_score": 5028,
    "last_position": 420
  },
  {
    "player": "good game",
    "board": "total_xp",
    "score": 5206,
    "position": 420,
    "last_score": 5206,
    "last_position": 409
  },
  {
    "player": "paula nara",
    "board": "total_xp",
    "score": 5192,
    "position": 421,
    "last_score": 5150,
    "last_position": 411
  },
  {
    "player": "hatmony",
    "board": "total_xp",
    "score": 5187,
    "position": 422,
    "last_score": 5187,
    "last_position": 410
  },
  {
    "player": "qwer121",
    "board": "total_xp",
    "score": 5122,
    "position": 423,
    "last_score": 5122,
    "last_position": 412
  },
  {
    "player": "clairex",
    "board": "total_xp",
    "score": 5118,
    "position": 424,
    "last_score": 5118,
    "last_position": 413
  },
  {
    "player": "12rings",
    "board": "total_xp",
    "score": 5114,
    "position": 425,
    "last_score": 5114,
    "last_position": 414
  },
  {
    "player": "northwesta",
    "board": "total_xp",
    "score": 5101,
    "position": 426,
    "last_score": 5047,
    "last_position": 419
  },
  {
    "player": "andy123qq4",
    "board": "total_xp",
    "score": 5069,
    "position": 427,
    "last_score": 5069,
    "last_position": 416
  },
  {
    "player": "razez",
    "board": "total_xp",
    "score": 5068,
    "position": 428,
    "last_score": 5068,
    "last_position": 417
  },
  {
    "player": "non sequitur",
    "board": "total_xp",
    "score": 5066,
    "position": 429,
    "last_score": 5066,
    "last_position": 418
  },
  {
    "player": "qinmissww",
    "board": "total_xp",
    "score": 5027,
    "position": 430,
    "last_score": 5027,
    "last_position": 421
  },
  {
    "player": "1716813869",
    "board": "total_xp",
    "score": 5017,
    "position": 431,
    "last_score": 5017,
    "last_position": 422
  },
  {
    "player": "kama777",
    "board": "total_xp",
    "score": 4994,
    "position": 432,
    "last_score": 4977,
    "last_position": 423
  },
  {
    "player": "lb br pro",
    "board": "total_xp",
    "score": 4975,
    "position": 433,
    "last_score": null,
    "last_position": null
  },
  {
    "player": "phantomstranger",
    "board": "total_xp",
    "score": 4961,
    "position": 434,
    "last_score": 4915,
    "last_position": 428
  },
  {
    "player": "kfcemployee",
    "board": "total_xp",
    "score": 4939,
    "position": 435,
    "last_score": 4939,
    "last_position": 424
  },
  {
    "player": "paul li",
    "board": "total_xp",
    "score": 4936,
    "position": 436,
    "last_score": 4936,
    "last_position": 425
  },
  {
    "player": "sunqqa",
    "board": "total_xp",
    "score": 4933,
    "position": 437,
    "last_score": 4736,
    "last_position": 442
  },
  {
    "player": "cdisunbreakable",
    "board": "total_xp",
    "score": 4929,
    "position": 438,
    "last_score": 4921,
    "last_position": 427
  },
  {
    "player": "sunspace11",
    "board": "total_xp",
    "score": 4929,
    "position": 439,
    "last_score": 4929,
    "last_position": 426
  },
  {
    "player": "gnad",
    "board": "total_xp",
    "score": 4925,
    "position": 440,
    "last_score": null,
    "last_position": null
  },
  {
    "player": "hatschiklatschi",
    "board": "total_xp",
    "score": 4860,
    "position": 441,
    "last_score": 4838,
    "last_position": 430
  },
  {
    "player": "bearich",
    "board": "total_xp",
    "score": 4849,
    "position": 442,
    "last_score": 4763,
    "last_position": 437
  },
  {
    "player": "oromis44",
    "board": "total_xp",
    "score": 4845,
    "position": 443,
    "last_score": 4845,
    "last_position": 429
  },
  {
    "player": "wtc8877",
    "board": "total_xp",
    "score": 4827,
    "position": 444,
    "last_score": 4827,
    "last_position": 431
  },
  {
    "player": "kurt vonnegut",
    "board": "total_xp",
    "score": 4816,
    "position": 445,
    "last_score": 4782,
    "last_position": 435
  },
  {
    "player": "n3bul4",
    "board": "total_xp",
    "score": 4816,
    "position": 446,
    "last_score": 4748,
    "last_position": 440
  },
  {
    "player": "pv_ziborov",
    "board": "total_xp",
    "score": 4809,
    "position": 447,
    "last_score": 4166,
    "last_position": 476
  },
  {
    "player": "windchopped",
    "board": "total_xp",
    "score": 4784,
    "position": 448,
    "last_score": 4784,
    "last_position": 434
  },
  {
    "player": "im221",
    "board": "total_xp",
    "score": 4777,
    "position": 449,
    "last_score": 4777,
    "last_position": 436
  },
  {
    "player": "j.a.y.",
    "board": "total_xp",
    "score": 4777,
    "position": 450,
    "last_score": 4753,
    "last_position": 439
  },
  {
    "player": "sandianshuidehan",
    "board": "total_xp",
    "score": 4764,
    "position": 451,
    "last_score": 4763,
    "last_position": 438
  },
  {
    "player": "yanyan23",
    "board": "total_xp",
    "score": 4741,
    "position": 452,
    "last_score": 4741,
    "last_position": 441
  },
  {
    "player": "mubawaba",
    "board": "total_xp",
    "score": 4739,
    "position": 453,
    "last_score": 4504,
    "last_position": 454
  },
  {
    "player": "blood fever",
    "board": "total_xp",
    "score": 4681,
    "position": 454,
    "last_score": 4680,
    "last_position": 445
  },
  {
    "player": "elegy250",
    "board": "total_xp",
    "score": 4677,
    "position": 455,
    "last_score": 4441,
    "last_position": 457
  },
  {
    "player": "khunmii",
    "board": "total_xp",
    "score": 4650,
    "position": 456,
    "last_score": 3793,
    "last_position": 509
  },
  {
    "player": "(clochard)",
    "board": "total_xp",
    "score": 4626,
    "position": 457,
    "last_score": 4626,
    "last_position": 448
  },
  {
    "player": "doniidiino",
    "board": "total_xp",
    "score": 4623,
    "position": 458,
    "last_score": 4620,
    "last_position": 449
  },
  {
    "player": "garoga",
    "board": "total_xp",
    "score": 4619,
    "position": 459,
    "last_score": 4270,
    "last_position": 470
  },
  {
    "player": "dyjintao",
    "board": "total_xp",
    "score": 4607,
    "position": 460,
    "last_score": 4023,
    "last_position": 484
  },
  {
    "player": "nova2009",
    "board": "total_xp",
    "score": 4601,
    "position": 461,
    "last_score": 4601,
    "last_position": 450
  },
  {
    "player": "aowu",
    "board": "total_xp",
    "score": 4597,
    "position": 462,
    "last_score": 3552,
    "last_position": 529
  },
  {
    "player": "jongene",
    "board": "total_xp",
    "score": 4579,
    "position": 463,
    "last_score": 4579,
    "last_position": 451
  },
  {
    "player": "y2k0000000",
    "board": "total_xp",
    "score": 4559,
    "position": 464,
    "last_score": 4349,
    "last_position": 464
  },
  {
    "player": "shadowritos",
    "board": "total_xp",
    "score": 4555,
    "position": 465,
    "last_score": 4555,
    "last_position": 452
  },
  {
    "player": "baxinn",
    "board": "total_xp",
    "score": 4547,
    "position": 466,
    "last_score": 4403,
    "last_position": 461
  },
  {
    "player": "oscanius",
    "board": "total_xp",
    "score": 4539,
    "position": 467,
    "last_score": 4534,
    "last_position": 453
  },
  {
    "player": "brutedeity",
    "board": "total_xp",
    "score": 4531,
    "position": 468,
    "last_score": 4446,
    "last_position": 456
  },
  {
    "player": "commandolin",
    "board": "total_xp",
    "score": 4472,
    "position": 469,
    "last_score": 4472,
    "last_position": 455
  },
  {
    "player": "joseph626_0",
    "board": "total_xp",
    "score": 4414,
    "position": 470,
    "last_score": 4414,
    "last_position": 458
  },
  {
    "player": "mushishi",
    "board": "total_xp",
    "score": 4406,
    "position": 471,
    "last_score": 4406,
    "last_position": 459
  },
  {
    "player": "linwei",
    "board": "total_xp",
    "score": 4404,
    "position": 472,
    "last_score": 4404,
    "last_position": 460
  },
  {
    "player": "zing0000",
    "board": "total_xp",
    "score": 4388,
    "position": 473,
    "last_score": 4388,
    "last_position": 462
  },
  {
    "player": "glazic",
    "board": "total_xp",
    "score": 4379,
    "position": 474,
    "last_score": 4241,
    "last_position": 473
  },
  {
    "player": "mandown",
    "board": "total_xp",
    "score": 4350,
    "position": 475,
    "last_score": 4350,
    "last_position": 463
  },
  {
    "player": "aspire",
    "board": "total_xp",
    "score": 4347,
    "position": 476,
    "last_score": 4347,
    "last_position": 465
  },
  {
    "player": "zt520530",
    "board": "total_xp",
    "score": 4343,
    "position": 477,
    "last_score": 3834,
    "last_position": 505
  },
  {
    "player": "stormveritas",
    "board": "total_xp",
    "score": 4317,
    "position": 478,
    "last_score": 4006,
    "last_position": 487
  },
  {
    "player": "birk",
    "board": "total_xp",
    "score": 4306,
    "position": 479,
    "last_score": 3741,
    "last_position": 512
  },
  {
    "player": "xktdxhero",
    "board": "total_xp",
    "score": 4290,
    "position": 480,
    "last_score": 4290,
    "last_position": 466
  },
  {
    "player": "moldtrinash",
    "board": "total_xp",
    "score": 4287,
    "position": 481,
    "last_score": 4287,
    "last_position": 467
  },
  {
    "player": "errigour",
    "board": "total_xp",
    "score": 4275,
    "position": 482,
    "last_score": 4275,
    "last_position": 468
  },
  {
    "player": "calf11",
    "board": "total_xp",
    "score": 4273,
    "position": 483,
    "last_score": 4273,
    "last_position": 469
  },
  {
    "player": "badwolf",
    "board": "total_xp",
    "score": 4258,
    "position": 484,
    "last_score": 4200,
    "last_position": 474
  },
  {
    "player": "stoppa00",
    "board": "total_xp",
    "score": 4254,
    "position": 485,
    "last_score": 4254,
    "last_position": 471
  },
  {
    "player": "zomcys",
    "board": "total_xp",
    "score": 4254,
    "position": 486,
    "last_score": 4254,
    "last_position": 472
  },
  {
    "player": "elstan",
    "board": "total_xp",
    "score": 4252,
    "position": 487,
    "last_score": 3234,
    "last_position": 557
  },
  {
    "player": "derbeggar",
    "board": "total_xp",
    "score": 4229,
    "position": 488,
    "last_score": 3949,
    "last_position": 494
  },
  {
    "player": "seacow",
    "board": "total_xp",
    "score": 4229,
    "position": 489,
    "last_score": 3968,
    "last_position": 492
  },
  {
    "player": "lordoflords",
    "board": "total_xp",
    "score": 4190,
    "position": 490,
    "last_score": 4190,
    "last_position": 475
  },
  {
    "player": "emperordragon",
    "board": "total_xp",
    "score": 4186,
    "position": 491,
    "last_score": 3683,
    "last_position": 516
  },
  {
    "player": "son goku",
    "board": "total_xp",
    "score": 4163,
    "position": 492,
    "last_score": 4101,
    "last_position": 480
  },
  {
    "player": "askeladd",
    "board": "total_xp",
    "score": 4157,
    "position": 493,
    "last_score": 4157,
    "last_position": 477
  },
  {
    "player": "aquiritas222",
    "board": "total_xp",
    "score": 4149,
    "position": 494,
    "last_score": 3990,
    "last_position": 490
  },
  {
    "player": "politeusername",
    "board": "total_xp",
    "score": 4106,
    "position": 495,
    "last_score": 4106,
    "last_position": 478
  },
  {
    "player": "arthureis",
    "board": "total_xp",
    "score": 4101,
    "position": 496,
    "last_score": 4101,
    "last_position": 479
  },
  {
    "player": "silversssss",
    "board": "total_xp",
    "score": 4101,
    "position": 497,
    "last_score": 4100,
    "last_position": 481
  },
  {
    "player": "kollekcionerik",
    "board": "total_xp",
    "score": 4057,
    "position": 498,
    "last_score": 4004,
    "last_position": 488
  },
  {
    "player": "schw0in",
    "board": "total_xp",
    "score": 4052,
    "position": 499,
    "last_score": 3964,
    "last_position": 493
  },
  {
    "player": "tippityt0p",
    "board": "total_xp",
    "score": 4035,
    "position": 500,
    "last_score": 4035,
    "last_position": 482
  }
];
