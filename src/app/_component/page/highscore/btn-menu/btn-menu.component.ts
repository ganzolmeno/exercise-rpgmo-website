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

  displaySkill(s: any, a: any) {
    console.log(s, a)

  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    SKILL_LIST.forEach((skill, idx) => {
      let elm = `<option value="${skill.o}">${skill.t}</option>`;
      document.getElementById('hs_dropdown')!.innerHTML += elm;

      let btn = document.createElement('div');
      btn.classList.add('skill');
      btn.id = 'skill_' + skill.o;
      btn.innerText = skill.t;
      btn.addEventListener('click', ()=>{this.displaySkill(skill.o,0)});
      document.getElementById('btn_list')!.appendChild(btn);
    });
  }

}
