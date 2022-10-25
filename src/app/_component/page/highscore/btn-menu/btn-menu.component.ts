import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, AfterViewInit, PLATFORM_ID } from '@angular/core';
import { SKILL_LIST, HighscoreService } from '../highscore.service';

@Component({
  selector: 'app-btn-menu',
  templateUrl: './btn-menu.component.html',
  styleUrls: ['./btn-menu.component.scss']
})
export class BtnMenuComponent implements AfterViewInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public highscoreService: HighscoreService
  ) { }

  displaySkill(skill: string, page: number) {
    this.removeElementsActive();
    document.getElementById(`skill_${skill}`)?.classList.add('active');
    let arr = [skill, 'page', page];
    if (skill == "battle_royale") {
      arr = [skill, `br_${this.highscoreService.brMode}_${this.highscoreService.brStat}`, 'page', page];
    }
    this.highscoreService.parseUrl(arr);
  }

  removeElementsActive(): void {
    this.highscoreService.skills.forEach(v => {
      document.getElementById(`skill_${v}`)?.classList.remove('active');
    })
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
      btn.innerHTML = `<div class='skill_icon' style="background-position-x: ${-24 * i}px"></div>`+skill.t;
      btn.addEventListener('click', () => { this.displaySkill(skill.o, 0) });
      document.getElementById(is_challenge ? 'challenges_panel' : 'skills_panel')!.appendChild(btn);
    }
  }

}
