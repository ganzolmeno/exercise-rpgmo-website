import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HighscoreService {

  readonly highscore_url = 'https://rpg-de2.mo.ee/';
  readonly charjs_url = 'https://data.mo.ee/';

  selectedOption:string = '';

  skills = [
    "total",
    "total_xp",
    "accuracy",
    "strength",
    "defense",
    "health",
    "magic",
    "alchemy",
    "woodcutting",
    "farming",
    "fishing",
    "cooking",
    "jewelry",
    "carpentry",
    "forging",
    "mining",
    "breeding",
    "fletching",
    "archery",
    "wizardry",
    "fungiculture",
    "party",
    "skill_quest",
    "kill_quest",
    "cathedral",
    "scavenger_hunt"
  ];

  challenges = [
    "party",
    "skill_quest",
    "kill_quest",
    "cathedral",
    "scavenger_hunt",
    "battle_royale"
  ];

  constructor() { }
}
/**
* 'o' : origin,
* 't' : translate
*/
interface TranslateData {
  o: string,
  t: string
}

export const SKILL_LIST: TranslateData[] = [
  {
    o: "total",
    t: $localize`:@@Total:Total`
  },
  {
    o: "total_xp",
    t: $localize`:@@Total xp:Total xp`
  },
  {
    o: "accuracy",
    t: $localize`:@@Accuracy:Accuracy`
  },
  {
    o: "strength",
    t: $localize`:@@Strength:Strength`
  },
  {
    o: "defense",
    t: $localize`:@@Defense:Defense`
  },
  {
    o: "health",
    t: $localize`:@@Health:Health`
  },
  {
    o: "magic",
    t: $localize`:@@Magic:Magic`
  },
  {
    o: "alchemy",
    t: $localize`:@@Alchemy:Alchemy`
  },
  {
    o: "woodcutting",
    t: $localize`:@@Woodcutting:Woodcutting`
  },
  {
    o: "farming",
    t: $localize`:@@Farming:Farming`
  },
  {
    o: "fishing",
    t: $localize`:@@Fishing:Fishing`
  },
  {
    o: "cooking",
    t: $localize`:@@Cooking:Cooking`
  },
  {
    o: "jewelry",
    t: $localize`:@@Jewelry:Jewelry`
  },
  {
    o: "carpentry",
    t: $localize`:@@Carpentry:Carpentry`
  },
  {
    o: "forging",
    t: $localize`:@@Forging:Forging`
  },
  {
    o: "mining",
    t: $localize`:@@Mining:Mining`
  },
  {
    o: "breeding",
    t: $localize`:@@Breeding:Breeding`
  },
  {
    o: "fletching",
    t: $localize`:@@Fletching:Fletching`
  },
  {
    o: "archery",
    t: $localize`:@@Archery:Archery`
  },
  {
    o: "wizardry",
    t: $localize`:@@Wizardry:Wizardry`
  },
  {
    o: "fungiculture",
    t: $localize`:@@Fungiculture:Fungiculture`
  },
  {
    o: "party",
    t: $localize`:@@Party:Party`
  },
  {
    o: "skill_quest",
    t: $localize`:@@Skill quests:Skill quests`
  },
  {
    o: "kill_quest",
    t: $localize`:@@Kill quests:Kill quests`
  },
  {
    o: "cathedral",
    t: $localize`:@@Cathedral:Cathedral`
  },
  {
    o: "scavenger_hunt",
    t: $localize`:@@Scavenger hunt:Scavenger hunt`
  },
  {
    o: "battle_royale",
    t: $localize`:@@Battle royale:Battle royale`
  }
];
