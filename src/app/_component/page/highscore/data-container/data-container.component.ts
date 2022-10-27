import { delay } from 'src/lib/helper';
import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { HighscoreService, REQUEST_STATE, SKILL_LIST } from './../highscore.service';

@Component({
  selector: 'app-data-container',
  templateUrl: './data-container.component.html',
  styleUrls: ['./data-container.component.scss']
})
export class DataContainerComponent implements AfterViewInit, OnDestroy {

  container!: HTMLElement | null;

  readonly dict = {
    noInTop: $localize`:@@Not in top:Not in top`,
    level: $localize`:@@Level:Level`,
    xp: $localize`:@@XP (Millions):XP (Millions)`,
    point: $localize`:@@Points:Points`,
    rank: $localize`:@@Rank:Rank`,
    player: $localize`:@@Player:Player`
  };

  requestState$!: Subscription;


  constructor(
    private hs: HighscoreService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngAfterViewInit(): void {
    this.container = document.getElementById('hs_output');

    if (!isPlatformBrowser(this.platformId)) return;
    this.container!.innerHTML = '';
    let loading = document.getElementById('hs_loading');
    let err = document.getElementById('hs_err_output');

    this.requestState$ = this.hs.requestState.subscribe(stat => {
      this.container?.classList.add('hidden');
      loading?.classList.add('hidden');
      err?.classList.add('hidden');
      switch (stat) {
        case REQUEST_STATE.LOADING:
          loading!.classList.remove('hidden');
          break;
        case REQUEST_STATE.ERROR:
          err!.classList.remove('hidden');
          err!.innerText = this.hs.outputData[0];
          break;
        case REQUEST_STATE.COMPELETE:
          this.renderData();
          this.container!.classList.remove('hidden');
          break;
        default:
          break;
      }
    });
  }

  renderData() {
    let snapShot = this.hs.snapShot;
    if (snapShot[0] == 'battle_royale') {
      //renderBROption
    }

    if (snapShot[0] == 'player') {
      this.hs.snapShot.length == 3 ? this.renderCompareData() : this.renderPlayerData();
    } else {
      this.renderSkill();
    }

  }

  ngOnDestroy(): void {
    this.requestState$.unsubscribe();
  }

  renderSkill() {
    let snapShot = this.hs.snapShot;
    let skill = snapShot[0]
    let level_text = this.dict.level;
    if (skill == "total_xp") {
      level_text = this.dict.xp;
    }
    else if (["party", "scavenger_hunt", "skill_quest", "kill_quest", "battle_royale"].indexOf(skill) != -1 || /br_/.test(skill)) {
      level_text = this.dict.point;
    }

    let output = `<table class='hs_table table_skill'><thead><tr class='field_name'>
    <td colspan='2'>${this.dict.rank}</td>
    <td>${this.dict.player}</td>
    <td colspan='2'>${level_text}</td>
    </tr></thead><tbody>`;
    this.hs.outputData[0].forEach((data: any) => {
      output += `<tr><td>${this.formatSkillLevel(data['position'], !0, skill)}</td>
      <td>${this.colorifyNumber(data['position'], data['last_position'], !0, skill)}</td>
      <td>${data.player}</td>
      <td>${this.formatSkillLevel(data['score'], !1, skill)}</td>
      <td>${this.colorifyNumber(data['score'], data['last_score'], !1, skill)}</td>
      </tr>`;
    });

    output += `</tbody></table>`;
    this.container!.innerHTML = output;
    this.container!.querySelectorAll('tbody td:nth-child(1)').forEach(elm => {
      elm.classList.add('btn');
      elm.addEventListener('click', () => { this.displayRank(parseInt(elm.innerHTML)) });
    })
    this.container!.querySelectorAll('tbody td:nth-child(3)').forEach(elm => {
      elm.classList.add('btn');
      elm.addEventListener('click', () => { this.hs.parseUrl(['player', elm.innerHTML]) });
    })

    let next, prev;

    if (this.hs.outputData[0].length >= 500) {
      next = document.createElement('div');
      next.className = 'next_page';
      next.innerText = $localize`:@@Next:Next`;
      next.addEventListener('click', _ => {
        let idx = this.hs.snapShot[0] == 'battle_royale' ? 1 : 0;
        this.hs.snapShot[2 + idx] += 1;
        this.hs.parseUrl(this.hs.snapShot);
      })
    }

    if (this.hs.page != 0) {
      prev = document.createElement('div');
      prev.className = 'prev_page';
      prev.innerText = $localize`:@@Previous:Previous`;
      prev.addEventListener('click', _ => {
        let idx = this.hs.snapShot[0] == 'battle_royale' ? 1 : 0;
        this.hs.snapShot[2 + idx] -= 1;
        this.hs.parseUrl(this.hs.snapShot);
      })
    }

    if (next || prev) {
      document.querySelector(`.hs_table`)!.innerHTML += `<tfoot><tr><td colspan='5'></td></tr></tfoot>`;
      let elm = document.querySelector(`.hs_table tfoot td`);
      prev ? elm?.append(prev as HTMLElement) : 0;
      next ? elm?.append(next as HTMLElement) : 0;
    }

    if (this.hs.snapShot[0] == 'battle_royale') {
      this.renderBattleRoyaleOptions();
    }

    this.renderTitle();

    this.scroll2Target();
  }

  renderTitle() {
    let skill = this.hs.snapShot[0];
    let idx = -1;
    SKILL_LIST.forEach((v, i) => { if (v.o == skill) idx = i; });
    let output = `<tr><td colspan='5'><div class='badge_base'>
    <div class='badge_deco'></div>
    <div class='badge_skill' style="background-position-x: -${idx * 36}px;"></div>
    <div class='badge_label'>${SKILL_LIST[idx].t}</div>
    </div></td></tr>`;

    let container = this.container!.querySelector('.hs_table thead');
    container!.innerHTML = output + container!.innerHTML;
  }

  scroll2Target() {
    let snapShot = this.hs.snapShot;
    let add = snapShot[0] == 'battle_royale' ? 1 : 0;
    setTimeout(_ => {
      if (snapShot[0] != 'player' && snapShot[1 + add] == 'rank')
        document.querySelector(`.hs_table tbody tr:nth-child(${parseInt(snapShot[2 + add])})`)!.scrollIntoView(true),
          document.querySelector(`.hs_table tbody tr:nth-child(${parseInt(snapShot[2 + add])})`)!.classList.add('highlight');
      else
        document.querySelector('.hs_table')!.scrollIntoView(true);
      let scrolledY = window.scrollY;

      if (scrolledY) {
        window.scroll(0, scrolledY - 80);/* fixed header*/
      }
    }, 300)
  }

  renderBattleRoyaleOptions() {
    let select = document.createElement('select');
    select.id = "br_mode";
    [{ v: 's', n: $localize`:@@Solo:Solo` },
    { v: 'd', n: $localize`:@@Duo:Duo` },
    { v: 't', n: $localize`:@@Trio:Trio` }].forEach(obj => {
      select.innerHTML += `<option value='${obj.v}'>${obj.n}</option>`
    })
    select.value = this.hs.brMode;
    select.addEventListener('change', e => { this.displayBattleRoyale() });

    let container = this.container!.querySelector('.hs_table thead');
    container!.innerHTML = `<tr><td colspan='5'></td></tr>` + container!.innerHTML;
    container = this.container!.querySelector('.hs_table thead td');
    container?.append(select);

    select = document.createElement('select');
    select.id = "br_stat";
    [{ v: 'w', n: $localize`:@@Wins:Wins` },
    { v: 'k', n: $localize`:@@Kills:Kills` },
    { v: 'p', n: $localize`:@@Plays:Plays` },
    { v: 'd', n: $localize`:@@Deaths:Deaths` }].forEach(obj => {
      select.innerHTML += `<option value='${obj.v}'>${obj.n}</option>`
    })
    select.value = this.hs.brStat;
    select.addEventListener('change', e => { this.displayBattleRoyale() });
    container?.append(select);
  }

  displayBattleRoyale() {
    this.hs.brMode = (<HTMLInputElement>document.getElementById('br_mode')!).value;
    this.hs.brStat = (<HTMLInputElement>document.getElementById('br_stat')!).value;
    let arr = ['battle_royale', `br_${this.hs.brMode}_${this.hs.brStat}`, 'page', 0]
    this.hs.setUrl(arr);
    this.hs.requestData(arr);
  }

  displayRank(num: number) {
    if (num < 0) return;
    document.querySelectorAll('tr').forEach(v => {
      v.classList.remove('highlight');
    });
    document.querySelectorAll('tbody tr')[num - 1].classList.add('highlight');
    if (this.hs.snapShot[0] == "battle_royale") {
      this.hs.setUrl([this.hs.snapShot[0], 'br_' + this.hs.brMode + '_' + this.hs.brStat, 'rank', num]);
    } else {
      this.hs.setUrl([this.hs.snapShot[0], 'rank', num]);
    }
  }

  renderCompareData() {
    let snapShot = this.hs.snapShot;
    let playerName1 = snapShot[1];
    let playerData1 = this.hs.playerScores[playerName1];
    let playerName2 = snapShot[2];
    let playerData2 = this.hs.playerScores[playerName2];
    let output =
      `<table class='hs_table compare'><thead>
      <tr><td colspan='2' class='name'>${playerName1}</td>
    <td class='vs'>VS</td><td colspan='2' class='name'>${playerName2}</td></tr>
<tr class='field_name'><td>${this.dict.rank}</td><td>${this.dict.point}</td><td></td>
<td>${this.dict.point}</td><td>${this.dict.rank}</td></tr>
    </thead><tbody>`;
    SKILL_LIST.forEach(val => {
      let skill = val.o;
      if (skill == 'battle_royale') return;

      output += `<tr${this.colorClass(playerData1[skill].score, playerData2[skill].score)}>
      <td>${playerData1[skill].position ? this.formatSkillLevel(playerData1[skill].position, !0, skill) : this.dict.noInTop}</td>
      <td>${playerData1[skill].score ? this.formatSkillLevel(playerData1[skill].score, !1, skill) : ''}</td>
      <td>${val.t}</td>
      <td>${playerData2[skill].score ? this.formatSkillLevel(playerData2[skill].score, !1, skill) : ''}</td>
      <td>${playerData2[skill].position ? this.formatSkillLevel(playerData2[skill].position, !0, skill) : this.dict.noInTop}</td>
      </tr>`
    });
    output += `</tbody></table>`;
    this.container!.innerHTML = output;
  }

  renderPlayerData() {
    let playerName1 = this.hs.snapShot[1];
    let playerData1 = this.hs.playerScores[playerName1];
    let output = `<table class='hs_table single'
    ><thead><tr><td colspan='5' class='name'>${playerName1}</td></tr>
    <tr class='field_name'><td colspan='2'>${this.dict.rank}</td><td></td><td colspan='2'>${this.dict.point}</td></tr>
    </thead><tbody>`;
    SKILL_LIST.forEach(val => {
      let skill = val.o;
      if (skill == 'battle_royale') return;

      output += `<tr>
      <td>${playerData1[skill].position ? this.formatSkillLevel(playerData1[skill].position, !0, skill) : this.dict.noInTop}</td>
      <td>${this.colorifyNumber(playerData1[skill].position, playerData1[skill].last_position, !0, skill)}</td>
      <td>${val.t}</td>
      <td>${playerData1[skill].score ? this.formatSkillLevel(playerData1[skill].score, !1, skill) : ''}</td>
      <td>${this.colorifyNumber(playerData1[skill].score, playerData1[skill].last_score, !1, skill)}</td>
      </tr>`
    });
    output += `</tbody></table>`;
    this.container!.innerHTML = output;
  }

  colorClass(p1: number | undefined, p2: number | undefined) {
    if (p1 == p2) {
      return "";
    }
    else if (p1! > p2!) {
      return " class='p1'";
    }
    else {
      return " class='p2'";
    }
  }

  colorifyNumber(current: number | undefined, last: number | undefined, is_Rank: boolean, skill: string) {
    if (!current || !last) {
      return '';
    }
    var green = ' class="green"';
    var red = ' class="red"';
    var change = Math.abs(current - last);
    if (current < last) {
      if (is_Rank) {
        return ' <span' + green + '>(+' + this.formatSkillLevel(change, is_Rank, skill) + ')</span>';
      }
      return ' <span' + red + '>(-' + this.formatSkillLevel(change, is_Rank, skill) + ')</span>';
    } else if (current > last) {
      if (is_Rank) {
        return ' <span' + red + '>(-' + this.formatSkillLevel(change, is_Rank, skill) + ')</span>';
      }
      return ' <span' + green + '>(+' + this.formatSkillLevel(change, is_Rank, skill) + ')</span>';
    }
    return '';
  }

  formatSkillLevel(value: number | undefined, is_Rank: boolean, skill: string) {
    if (!value) return '';
    let result = value.toString();
    if (!is_Rank && skill == 'total_xp') {
      result = (value / 10).toFixed(1);
    }
    result = this.addComma(result);

    return result;
  }

  addComma(value: string) {
    if (value != "") {
      value += "";
      var arr = value.split(".");
      var re = /(\d{1,3})(?=(\d{3})+$)/g;

      return arr[0].replace(re, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
    } else {
      return '';
    }
  }

}
