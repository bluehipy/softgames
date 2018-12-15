import Container from "pixi.js/lib/core/display/Container.js";
import Graphics from "pixi.js/lib/core/graphics/Graphics.js";
export default class MenuButton extends Container {
  constructor(config) {
    super();
    this.initialConfig = config;
    this.interactive = true;
    this.buttonMode = true;
    this.init();
  }
  init() {
    const w = this.initialConfig.width;
    const h = this.initialConfig.height;

    this.icon = new Graphics();
    this.icon.lineStyle(1, 0xff0000);
    this.icon.beginFill(0xff0000);
    this.icon.drawRect(0, 0, w, 3);
    this.icon.drawRect(0, -1 + h / 2, w, 3);
    this.icon.drawRect(0, h - 3, w, 3);
    this.icon.endFill();
    this.addChild(this.icon);
  }
}
