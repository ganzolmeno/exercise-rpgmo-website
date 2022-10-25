export {}

declare global {

  interface String {
    sanitize(): string;
    username(): string;
    usernamify(): string;
  }
}

if (!String.prototype.sanitize) {
  String.prototype.sanitize = function (): string {
    return this.replace(/[^A-Za-z-_0-9\u00fc\u00f5\u00f6\u00e4\u00d6\u00c4\u00d5\u00dc\u0161\u0160\u017e\u017d\@#$%^"'; \?!\.,'()\=\+\-\*\/:]/g, "")
  }
}

if (!String.prototype.username) {
  String.prototype.username = function (): string {
    return this.sanitize().trim().replace(/ +(?= )/g, "").replace(/\/|\\/g, "").trim();
  }
}

if (!String.prototype.usernamify) {
  String.prototype.usernamify = function (): string {
    return this.toLowerCase().username().substr(0, 16);
  }
}


