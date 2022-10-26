import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { HighscoreService, REQUEST_STATE } from './../highscore.service';
import { namifyHighscore } from 'src/lib/helper';

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
          this.rederData();
          this.container!.classList.remove('hidden');
          break;
        default:
          break;
      }
    });
  }

  rederData() {
    let snapShot = this.highscoreService.snapShot;
    if (snapShot[0] == 'battle_royale') {
      //rederBROption
    }

    if (snapShot[0] == 'player') {
      this.rederPlayerData()
    } else {

    }

  }

  ngOnDestroy(): void {
    this.requestState$.unsubscribe();
  }

  rederPlayerData() {
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
      let tmp = `<td>${namifyHighscore(skill)}</td>`;

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

}
