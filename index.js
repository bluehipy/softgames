// import Application from "pixi.js/lib/core/Application.js";
// import Text from "pixi.js/lib/core/text/Text.js";
// import Point from "pixi.js/lib/core/math/Point.js";
import * as PIXI from "pixi.js";
import Game from "./src/Game.js";

const enterFullscreen = e => {
  const docEl = document.documentElement;
  if (docEl.requestFullscreen) {
    docEl.requestFullscreen();
  } else if (docEl.mozRequestFullScreen) {
    docEl.mozRequestFullScreen();
  } else if (docEl.webkitRequestFullscreen) {
    docEl.webkitRequestFullscreen();
  } else if (docEl.msRequestFullscreen) {
    docEl.msRequestFullscreen();
  }
  hide(btnFull);
  show(btnShrink);
};

const exitFullscreen = e => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
  hide(btnShrink);
  show(btnFull);
};
const isInFullscreen = () => {
  const isFull =
    (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement &&
      document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null);
  return !!isFull;
};
const hasFullscreen = () => {
  const docEl = document.documentElement;
  return !!(
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullscreen ||
    docEl.msRequestFullscreen
  );
};
const hide = el => (el.style.display = "none");
const show = el => (el.style.display = "block");

const btnFull = document.getElementById("fullscreen");
const btnShrink = document.getElementById("normalscreen");

if (hasFullscreen()) {
  btnFull.addEventListener("mousedown", enterFullscreen);
  btnFull.addEventListener("tap", enterFullscreen);

  btnShrink.addEventListener("mousedown", exitFullscreen);
  btnShrink.addEventListener("tap", exitFullscreen);

  show(isInFullscreen() ? btnShrink : btnFull);
}

const app = new PIXI.Application(window.innerWidth, window.innerHeight, {
  backgroundColor: 0x1099bb,
  antialias: true
});
document.body.appendChild(app.view);

const game = new Game({
  stage: app.stage,
  ticker: app.ticker,
  loader: app.loader,
  width: window.innerWidth,
  height: window.innerHeight
});

window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  app.renderer.resize(w, h);
  game.resize(w, h);
});
