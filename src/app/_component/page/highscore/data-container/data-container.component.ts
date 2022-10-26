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


  constructor(private highscoreService: HighscoreService, @Inject(PLATFORM_ID) private platformId: any) { }

  ngAfterViewInit(): void {
    this.container = document.getElementById('hs_output');

    if (!isPlatformBrowser(this.platformId)) return;
    this.container!.innerHTML = '';
    let loading = document.getElementById('hs_loading');
    let err = document.getElementById('hs_err_output');

    this.requestState$ = this.highscoreService.requestState.subscribe(stat => {
      this.container?.classList.add('hidden');
      loading?.classList.add('hidden');
      err?.classList.add('hidden');
      switch (stat) {
        case REQUEST_STATE.LOADING:
          loading!.classList.remove('hidden');
          break;
        case REQUEST_STATE.ERROR:
          err!.classList.remove('hidden');
          err!.innerText = this.highscoreService.outputData[0];
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
    let snapShot = this.highscoreService.snapShot;
    if (snapShot[0] == 'battle_royale') {
      //renderBROption
    }

    if (snapShot[0] == 'player') {
      this.highscoreService.snapShot.length == 3 ? this.renderCompareData() : this.renderPlayerData();
    } else {
      this.renderSkill();
    }

  }

  ngOnDestroy(): void {
    this.requestState$.unsubscribe();
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

  renderSkill() {
    let snapShot = this.highscoreService.snapShot;
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
    this.highscoreService.outputData[0].forEach((data: any) => {
      output += `<tr><td rank='${data.position}'>${this.formatSkillLevel(data['position'],!0,skill)}</td>
      <td>${this.colorifyNumber(data['position'],data['last_position'],!0,skill)}</td>
      <td player='${data.player}'>${data.player}</td>
      <td>${this.formatSkillLevel(data['score'],!1,skill)}</td>
      <td>${this.colorifyNumber(data['score'],data['last_score'],!1,skill)}</td>
      </tr>`;
    });

    output += `</tbody></table>`;
    this.container!.innerHTML = output;
  }

  renderCompareData() {
    let snapShot = this.highscoreService.snapShot;
    let playerName1 = snapShot[1];
    let playerData1 = this.highscoreService.playerScores[playerName1];
    let playerName2 = snapShot[2];
    let playerData2 = this.highscoreService.playerScores[playerName2];
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
    let playerName1 = this.highscoreService.snapShot[1];
    let playerData1 = this.highscoreService.playerScores[playerName1];
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
