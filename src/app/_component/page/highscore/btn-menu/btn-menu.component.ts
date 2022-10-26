import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, AfterViewInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { SKILL_LIST, HighscoreService, REQUEST_STATE } from '../highscore.service';

@Component({
  selector: 'app-btn-menu',
  templateUrl: './btn-menu.component.html',
  styleUrls: ['./btn-menu.component.scss']
})
export class BtnMenuComponent implements AfterViewInit, OnDestroy {

  requestStateSubscription?: Subscription;
  is_close = !1;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public highscoreService: HighscoreService
  ) { }

  displayPlayer(event: KeyboardEvent | MouseEvent, keycode: number) {
    if (keycode == 13) {
      this.highscoreService.parseUrl([
        'player',
        (document.getElementById('filter_player1') as HTMLInputElement).value,
        (document.getElementById('filter_player2') as HTMLInputElement).value
      ]);
      event.preventDefault();
    }
  }

  displaySkill(skill: string, page: number) {
    if (this.highscoreService.requestState.getValue()) {
      this.highscoreService.requestState.next(0)
    } else {
      this.highscoreService.requestState.next(1)

    }
    let arr = [skill, 'page', page];
    if (skill == "battle_royale") {
      arr = [skill, `br_${this.highscoreService.brMode}_${this.highscoreService.brStat}`, 'page', page];
    }
    this.highscoreService.parseUrl(arr);
  }

  elementActive(skill: string) {
    this.removeElementsActive();
    document.getElementById(`skill_${skill}`)?.classList.add('active');
  }

  removeElementsActive(): void {
    this.highscoreService.skills.forEach(v => {
      document.getElementById(`skill_${v}`)?.classList.remove('active');
    })
  }

  toggleMenu(){
    if(!this.is_close) return;
    document.querySelector('.hs_menu')!.classList.toggle('close')
  }

  ngAfterViewInit(): void {

    let stop_at_challenge = this.highscoreService.challenges[0];

    if (!isPlatformBrowser(this.platformId)) return;

    let is_challenge = !1;
    for (let i = 0; i < SKILL_LIST.length; i++) {
      let skill = SKILL_LIST[i];
      is_challenge = is_challenge || stop_at_challenge == skill.o;
      let btn = document.createElement('div');
      btn.classList.add('skill');
      is_challenge ? btn.classList.add('challenge') : 0;
      btn.id = 'skill_' + skill.o;
      btn.innerHTML = `<div class='skill_icon' style="background-position-x: ${-24 * i}px"></div>` + skill.t;
      btn.addEventListener('click', () => { this.displaySkill(skill.o, 0) });
      document.getElementById(is_challenge ? 'challenges_panel' : 'skills_panel')!.appendChild(btn);
    }

    this.requestStateSubscription = this.highscoreService.requestState.subscribe(val => {
      switch (val) {
        case REQUEST_STATE.LOADING:
          document.querySelector('.hs_menu')!.classList.add('hidden2');
          this.is_close=!1;
          break;
        case REQUEST_STATE.ERROR:
          document.querySelector('.hs_menu')!.classList.remove('hidden2');
          document.querySelector('.hs_menu')!.classList.add('close');
          this.is_close=!0;
          break;
        case REQUEST_STATE.COMPELETE:
          document.querySelector('.hs_menu')!.classList.remove('hidden2');
          document.querySelector('.hs_menu')!.classList.add('close');
          this.elementActive(this.highscoreService.snapShot[0])
          this.is_close=!0;
          break;
        default:
          document.querySelector('.hs_menu')!.classList.remove('close');
          document.querySelector('.hs_menu')!.classList.remove('hidden2');
          this.is_close=!1;
          this.removeElementsActive();
          break;
      }
    });
  }

  ngOnDestroy(): void {
    this.requestStateSubscription?.unsubscribe();
  }

}
