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

    }

  }

  ngOnDestroy(): void {
    this.requestState$.unsubscribe();
  }

  renderCompareData() {
    let snapShot = this.highscoreService.snapShot;
    let isCompare = snapShot.length == 3;
    let playerName1 = snapShot[1];
    let playerData1 = this.highscoreService.playerScores[playerName1];
    let playerName2 = isCompare ? snapShot[2] : undefined;
    let playerData2 = isCompare ? this.highscoreService.playerScores[playerName2!] : 0;
    let output =
      `<table>
    <thead><tr>
    <td colspan='${isCompare ? 2 : 3}'>${playerName1}</td>
    ${isCompare ? `<td></td><td colspan='2'>${playerName2}</td>` : ''}
    </tr></thead><tbody>`;
    this.highscoreService.skills.forEach(skill => {
      if (skill == 'battle_royale') return;
      let tmp = `<td>${skill}</td>`;

      output += `<tr>
      <td>${playerData1[skill].position}</td>
      ${isCompare ? '' : tmp}
      <td>${playerData1[skill].score}</td>
      ${!isCompare ? '' :
          `${tmp}
        <td>${playerData2[skill].score}</td>
        <td>${playerData2[skill].position}</td>
      `}
      </tr>`
    });
    output += `</tbody></table>`;
    this.container!.innerHTML = output;
  }

  renderPlayerData() {
    let playerName1 = this.highscoreService.snapShot[1];
    let playerData1 = this.highscoreService.playerScores[playerName1];
    let output = `<table class='hs_table single'
    ><thead><tr><td colspan='5' class='name'>${playerName1}</td></tr></thead><tbody>`;
    SKILL_LIST.forEach(val => {
      let skill = val.o;
      if (skill == 'battle_royale') return;
      let tmp = `<td>${val.t}</td>`;
      output += `<tr>
      <td>${playerData1[skill].position}</td>
      <td>${this.colorifyDiff(playerData1[skill].position, playerData1[skill].last_position, !0, skill)}</td>
      ${tmp}
      <td>${playerData1[skill].score}</td>
      <td>${this.colorifyDiff(playerData1[skill].score, playerData1[skill].last_score, !1, skill)}</td>
      </tr>`
    });
    output += `</tbody></table>`;
    this.container!.innerHTML = output;
  }

  colorifyDiff(current: string, last: string, is_Rank: boolean, skill: string) {
    if (!current || !last || skill == 'scavenger_hunt') {
      return '';
    }
    var green = ' class="green"';
    var red = ' class="red"';
    var change = Math.abs(parseInt(current) - parseInt(last));
    if (parseInt(current) < parseInt(last)) {
      if (is_Rank) {
        return ' <span' + green + '>(+' + this.formatSkillLevel(change, is_Rank, skill) + ')</span>';
      }
      return ' <span' + red + '>(-' + this.formatSkillLevel(change, is_Rank, skill) + ')</span>';
    } else if (parseInt(current) > parseInt(last)) {
      if (is_Rank) {
        return ' <span' + red + '>(-' + this.formatSkillLevel(change, is_Rank, skill) + ')</span>';
      }
      return ' <span' + green + '>(+' + this.formatSkillLevel(change, is_Rank, skill) + ')</span>';
    }
    return '';
  }

  formatSkillLevel(value: number, is_Rank: boolean, skill: string) {
    if (!value) return '';
    if (!is_Rank && skill == 'total_xp') {
      return (value / 10).toFixed(1);
    }
    return value;
  }

}
