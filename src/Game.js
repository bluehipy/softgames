// import Text from "pixi.js/lib/core/text/Text.js";
// import Point from "pixi.js/lib/core/math/Point.js";
// import Sprite from "pixi.js/lib/core/sprites/Sprite.js";
// import * as loaders from "pixi.js/lib/loaders";
import * as PIXI from "pixi.js";
import CardsDeck from "./modules/CardsDeck.js";
import TextImage from "./modules/TextImage.js";
import AwesomeFire from "./modules/AwesomeFire.js";

export default class Game {
  constructor(config = {}) {
    Object.assign(this, config);
    this.modules = [CardsDeck, TextImage, AwesomeFire];
    this.labels = ["Cards Deck", "Images and Texts", "Awesome Fire"];
    this.loader.add("menu", "./assets/menu.png").load(this.onLoad.bind(this));
  }
  onLoad(loader, resources) {
    this.showFPS();
    this.showMenu(resources);
    this.startDemo(1);
  }
  resize(width, height) {
    let gap;
    this.width = width;
    this.height = height;

    if (this.menuBtn) {
      this.menuBtn.y = 5;
      this.menuBtn.width = this.width / 15;
      this.menuBtn.scale.y = this.menuBtn.scale.x;
      this.menuBtn.x = width - this.menuBtn.width - 5;
    }

    if (this.fpsTxt) {
      this.fpsTxt.x = 5;
      this.fpsTxt.y = 5;
    }
    gap = this.getGap();
    if (this.demo) {
      this.demo.resize(width - 2 * gap, height - 2 * gap);
      this.demo.stage.x = gap;
      this.demo.stage.y = gap;
    }
    if (this.menuOptions) {
      this.menuOptions.destroy();
      delete this.menuOptions;
      this.showMenuOptions();
    }
  }
  getGap() {
    const a = this.fpsTxt;
    const b = this.menuBtn;

    if (a && b) {
      return Math.max(a.y + a.height, b.y + b.height) + 5;
    }
    return 5;
  }
  showFPS() {
    const fpsTxt = new PIXI.Text(this.ticker.FPS.toFixed(2), {
      fontSize: "3em"
    });
    fpsTxt.position = new PIXI.Point(5, 5);
    this.stage.addChild(fpsTxt);
    this.ticker.add(() => {
      fpsTxt.text = this.ticker.FPS.toFixed(2);
    });
    this.fpsTxt = fpsTxt;
  }
  showMenu(res) {
    this.menuBtn = new PIXI.Sprite(res.menu.texture);
    this.stage.addChild(this.menuBtn);
    this.menuBtn.width = this.width / 15;
    this.menuBtn.scale.y = this.menuBtn.scale.x;
    this.menuBtn.y = 5;
    this.menuBtn.x = this.width - this.menuBtn.width - 5;
    this.menuBtn.interactive = true;
    this.menuBtn.buttonMode = true;
    this.menuBtn.on("tap", this.showMenuOptions, this);
    this.menuBtn.on("mousedown", this.showMenuOptions, this);
  }
  showMenuOptions() {
    if (this.menuOptions) {
      this.menuOptions.destroy();
      delete this.menuOptions;
    }
    this.menuOptions = new PIXI.Container();
    let bg = new PIXI.Graphics();
    bg.beginFill(0x000000, 0.7);
    bg.drawRect(0, 0, 100, 100);
    bg.endFill();
    bg.width = this.width;
    bg.height = this.height;
    this.menuOptions.addChild(bg);
    let labels = this.labels.map(
      lbl => new PIXI.Text(lbl, { fontSize: "7em", fill: "orange" })
    );
    let gap = labels[0].height;
    let h = (2 * labels.length - 1) * gap;
    let y0 = (this.height - h) / 2;
    labels.map((lbl, index) => {
      lbl.y = y0;
      y0 += lbl.height + gap;
      lbl.x = (this.width - lbl.width) / 2;
      this.menuOptions.addChild(lbl);
      lbl.interactive = true;
      lbl.buttonMode = true;
      lbl.on("tap", this.selectOption.bind(this, index), this);
      lbl.on("mousedown", this.selectOption.bind(this, index), this);
    });
    this.stage.addChild(this.menuOptions);
  }
  selectOption(index) {
    if (this.menuOptions) {
      this.menuOptions.destroy();
      delete this.menuOptions;
    }
    this.startDemo(index);
  }
  startDemo(demoIndex) {
    this.stopDemo();
    const container = this.stage.addChild(new PIXI.Container());
    const gap = this.getGap();
    container.x = gap;
    container.y = gap;
    this.demo = new this.modules[demoIndex]({
      stage: container,
      ticker: this.ticker,
      loader: this.loader,
      width: this.width - 2 * gap,
      height: this.height - 2 * gap
    });
  }
  stopDemo() {
    if (this.demo) {
      this.demo.destroy();
      this.demo.stage.destroy();
      delete this.demo;
    }
  }
  destroy() {
    this.stopDemo();
    this.fpsTxt.destroy();
    delete this.fpsTxt;
    delete this.stage;
    delete this.ticker;
  }
}
