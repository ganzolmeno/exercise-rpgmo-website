export function tenMinuteCache(): number { return Math.floor(secondstamp() / 600); }

export function secondstamp() { return parseInt(String(Math.round((new Date).getTime() / 1e3))) }

export function namifyHighscore(name:string){
  if(name == 'skill_quest'){
    name = 'skill_quests';
  } else if (name == 'kill_quest'){
    name = 'kill_quests';
  }
  return capitaliseFirstLetter(name).replace("_", " ");
}

export function capitaliseFirstLetter(t:string){return t.charAt(0).toUpperCase()+t.slice(1)}
