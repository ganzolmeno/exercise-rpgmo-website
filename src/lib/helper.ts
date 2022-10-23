export function tenMinuteCache(): number { return Math.floor(secondstamp() / 600); }

export function secondstamp() { return parseInt(String(Math.round((new Date).getTime() / 1e3))) }
