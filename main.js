const express = require("express");
const path = require("path");

const getTranslatedServer = (lang) => {
  const distFolder = path.join(
    process.cwd(),
    `dist/exercise-rpgmo-website/server/${lang}`
  );

  const server = require(`${distFolder}/main.js`);

  return server.app(lang);
};

function run() {
  const port = process.env['PORT'] || 4200;

  // Start up the Node server
  // TODO: add lang.
  const appEn = getTranslatedServer("en");
  const appZh = getTranslatedServer("zh");
  const appTw = getTranslatedServer("zh-tw");

  const server = express();
  server.use("/en", appEn);
  server.use("/zh", appZh);
  server.use("/zh-tw", appTw);
  server.use("", appEn);

  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
