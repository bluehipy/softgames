import * as PIXI from "pixi.js";
import BaseModule from "./BaseModule.js";

export default class TextImage extends BaseModule {
  init() {
    this.index = 0;
    this.templates = [
      "Hello there!",
      "#2#4",
      "text #1 and #5 text",
      "#2 and #3 text #4",
      "#7 #8 some text",
      "some text #9 #10"
    ];
    if (!this.loader.resources.emoticons) {
      this.loader
        //.add("emoticons", "./assets/emoticons.json") // not working on this npm version
        .add("emoticons", "./assets/emoticons.png")
        .load(this.onLoad.bind(this));
    } else {
      this.initTextures();
      this.run();
    }
  }
  onLoad(loader, resources) {
    if (this.isDestroyed) return;
    this.initTextures();
    this.run();
  }
  initTextures() {
    this.textures = [];
    let x = 0,
      y = 0,
      d = 72;
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 5; i++) {
        x = i * 72;
        y = j * 72;
        let frame = new PIXI.Rectangle(x, y, d, d);
        let texture = new PIXI.Texture(
          this.loader.resources.emoticons.texture,
          frame
        );
        this.textures.push(texture);
      }
    }
  }
  run() {
    this.intervalId = setInterval(this.showMessage.bind(this), 2000);
    this.showMessage();
  }
  showMessage() {
    if (this.lastMsg) {
      this.lastMsg.destroy();
    }

    this.index = this.index % (this.templates.length - 1);
    let msg = this.parse(this.templates[this.index]);
    this.lastMsg = this.layout(msg);
    this.stage.addChild(this.lastMsg);
    this.centerMessage();
    this.index++;
  }
  centerMessage() {
    if (this.lastMsg) {
      this.lastMsg.x = (this.width - this.lastMsg.width) / 2;
      this.lastMsg.y = (this.height - this.lastMsg.height) / 2;
    }
  }
  parse(msg) {
    const re = /(#\d+)/g;
    const separator = "##$$$";
    let out = [];
    const size = 3 + Math.floor(Math.random() * 4) + "em";
    let result = [];
    const replacer = (match, p, offset, s) => {
      out.push(match.substr(1));
      return separator;
    };

    let s = msg.replace(re, replacer);
    s = s.split(separator);

    s.forEach((segment, index) => {
      segment && result.push(this.factoryText(segment, size));
      out[index] && result.push(this.factoryImage(out[index]));
    });
    return result;
  }
  factoryImage(index) {
    return new PIXI.Sprite(this.textures[index]);
  }
  factoryText(s, size) {
    return new PIXI.Text(s, { fontSize: size });
  }
  layout(arr) {
    let container = new PIXI.Container();
    let h = 0;
    arr
      .map(obj => {
        if (obj instanceof PIXI.Text) {
          h = Math.max(h, obj.height);
        }
        return obj;
      })
      .map((obj, index) => {
        if (obj instanceof PIXI.Sprite && h) {
          obj.height = h;
          obj.scale.x = obj.scale.y;
        }
        if (h) {
          obj.y = (h - obj.height) / 2;
        }
        if (index) {
          let prev = arr[index - 1];
          obj.x = prev.x + prev.width;
        }
        container.addChild(obj);
      });
    return container;
  }
  destroy() {
    this.isDestroyed = true;
    clearInterval(this.intervalId);
    delete this.intervalId;
    this.lastMsg && this.lastMsg.destroy();
    delete this.lastMsg;
    delete this.index;
    this.templates.length = 0;
    delete this.templates;
    this.textures.map(t => t.destroy());
    this.textures.length = 0;
    delete this.textures;
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
    this.centerMessage();
  }
}
