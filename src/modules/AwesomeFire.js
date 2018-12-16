import * as PIXI from "pixi.js";
import BaseModule from "./BaseModule.js";

export default class AwesomeFire extends BaseModule {
  init() {
    this.maxCount = 10;
    this.bg = new PIXI.Graphics();
    this.bg.beginFill(0x000000, 1);
    this.bg.drawRect(0, 0, 10, 10);
    this.bg.endFill();
    this.bg.width = this.width;
    this.bg.height = this.height;
    this.stage.addChild(this.bg);
    this.container = new PIXI.Container();
    this.stage.addChild(this.container);

    if (!this.loader.resources.flame) {
      this.loader
        .add("flame", "./assets/flame.png")
        .load(this.onLoad.bind(this));
    } else {
      this.texture = this.loader.resources.flame.texture;
      this.run();
    }
  }
  onLoad(loader, resources) {
    if (this.isDestroyed) return;
    this.texture = resources.flame.texture;
    this.run();
  }
  run() {
    for (let i = 0; i < this.maxCount; i++) {
      let flame = new PIXI.Sprite(this.texture);
      flame.speed = 1;
      flame.maxScale = 0;
      flame.alpha = 0;
      this.container.addChild(this.initFlame(flame));
    }
    this.ticker.add(this.render, this);
  }
  render() {
    this.container.children = this.container.children.map(kid =>
      this.initFlame(kid)
    );
  }
  initFlame(flame) {
    if (flame.maxScale) {
      flame.scale.x += flame.speed;
      flame.scale.y = flame.scale.x;
      flame.x = (this.width - flame.width) / 2;
      flame.y = this.height - flame.height;
      if (flame.scale.x > 0.75 * flame.maxScale) {
        flame.alpha -= 1.5 * flame.speed;
      }
      if (flame.scale.x < 0.75 * flame.maxScale) {
        flame.alpha = Math.min(0.2, flame.alpha + flame.speed);
      }
      if (flame.rottion !== 0) {
        flame.rottion = (flame.rottion > 0 ? -1 : 1) * flame.speed;
      }
    }
    if (flame.scale.x < flame.maxScale || flame.alpha > 0) return flame;

    flame.scale.y = flame.scale.x = 1;
    flame.rotation = 0;
    flame.x = (this.width - flame.width) / 2;
    flame.height = this.height;
    flame.maxScale = flame.scale.y;

    flame.scale.y = flame.scale.x = 0.2 * flame.maxScale;
    flame.alpha = 0;
    flame.speed = 1 / (350 + 250 * Math.random());
    flame.rotation = ((10 - Math.random() * 5) * Math.PI) / 180;

    flame.y = this.height - flame.height;
    return flame;
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
    if (this.bg) {
      this.bg.width = width;
      this.bg.height = height;
    }
  }
  destroy() {
    this.isDestroyed = true;
    this.ticker.remove(this.render, this);
    if (this.bg) {
      this.bg.destroy();
      delete this.bg;
    }
    if (this.container) {
      this.container.destroy();
      delete this.container;
    }
    delete this.texture;
  }
}
