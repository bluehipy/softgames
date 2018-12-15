// import Texture from "pixi.js/lib/core/textures/Texture.js";
// import Sprite from "pixi.js/lib/core/sprites/Sprite.js";
// import Text from "pixi.js/lib/core/text/Text.js";
// import Point from "pixi.js/lib/core/math/Point.js";
// import ParticleContainer from "pixi.js/lib/particles/ParticleContainer.js";
// import * as loaders from "pixi.js/lib/loaders";
import * as PIXI from "pixi.js";
import BaseModule from "./BaseModule.js";

export default class CardsDeck extends BaseModule {
  init() {
    this.container = new PIXI.particles.ParticleContainer();
    this.stage.addChild(this.container);

    this.gap = 10;
    this.cardsNo = 144;
    this.cardIndex = this.cardsNo - 1;
    this.cardTexture = this.cropCardTexture();
    this.maxW = (this.width - 3 * this.gap) / 2;
    this.maxH = Math.min(this.width, this.height) / 3;
    if (!this.cardTexture) {
      this.loader.add("card", "./assets/card.png").load(this.onLoad.bind(this));
    } else {
      this.run();
    }
  }
  cropCardTexture() {
    const loader = this.loader,
      resources = loader && loader.resources,
      card = resources && resources.card,
      texture = card && card.texture;
    if (texture) {
      return new PIXI.Texture(texture, {
        x: 40,
        y: 0,
        width: 222,
        height: 300
      });
    }
  }
  onLoad(loader, resources) {
    this.cardTexture = this.cropCardTexture();
    this.run();
  }

  run() {
    this.ticker.add(this.render, this);
    this.drawCards();
    this.moveId = setInterval(this.moveCards.bind(this), 1000);
    this.moveCards();
  }
  drawCards() {
    this.cards = [];
    for (let i = 0; i < this.cardsNo; i++) {
      const card = new PIXI.Sprite(this.cardTexture);
      card.index = i;
      this.repos(card);
      this.cards.push(card);
      this.container.addChild(card);
    }
  }
  moveCard(card, to, duration = 2000) {
    return new Promise((resolve, reject) =>
      this.createAnimation(card, to, duration, resolve, reject)
    );
  }
  createAnimation(card, end, duration, resolve, reject) {
    card.animation = {
      start: this.getStart(card, end),
      end: Object.assign({}, end),
      delta: this.getDelta(card, end),
      duration: duration,
      resolve: resolve,
      reject: reject,
      createdOn: new Date().getTime()
    };
  }
  getDelta(start, end) {
    const delta = {};
    for (let p in end) {
      delta[p] = end[p] - start[p];
    }
    return delta;
  }
  getStart(card, end) {
    const start = {};
    for (let p in end) {
      start[p] = card[p];
    }
    return start;
  }
  animate(card) {
    const now = new Date().getTime();
    const { start, end, delta, duration, resolve, createdOn } = card.animation;
    const ease = t => --t * t * t + 1;
    const progress = ease((now - createdOn) / duration);

    if (progress >= 1) {
      Object.assign(card, end);
      resolve(card);
      delete card.animation;
      return;
    } else {
      const state = {};
      for (let p in end) {
        state[p] = start[p] + delta[p] * progress;
      }
      Object.assign(card, state);
    }
  }
  moveCards() {
    const maxW = (this.width - 3 * this.gap) / 2;

    if (this.cardIndex >= 0) {
      const card = this.cards[this.cardIndex--];

      this.moveCard(card, this.getEndByIndex(card.index))
        .then(card => this.updateZIndex(card))
        .catch(err => {});
    } else {
      clearInterval(this.moveId);
      delete this.moveId;
    }
  }
  updateZIndex(card) {
    card.moved = true;
  }
  render() {
    if (this.cards.length) {
      this.container.children = this.container.children.sort((a, b) => {
        if (a.animation && b.animation) {
          return b.index - a.index;
        }
        if (!a.animation && !b.animation) {
          return b.y - a.y;
        }
        if (a.animation) return 1;

        return -1;
      });
      for (let i = this.cards.length - 1; i >= 0; i--) {
        const card = this.cards[i];
        card && card.animation && this.animate(card);
      }
    }
  }
  resize(width, height) {
    if (this.resizeId) {
      clearTimeout(this.resizeId);
    }
    this.resizeId = setTimeout(
      this.delayedResize.bind(this, width, height),
      200
    );
  }
  delayedResize(width, height) {
    this.width = width;
    this.height = height;
    this.maxW = (width - 3 * this.gap) / 2;
    this.maxH = Math.min(width, height) / 3;
    this.cards.map(card => this.repos(card));
  }
  repos(card) {
    const maxW = this.maxW;
    const maxH = this.maxH;

    card.width = maxW;
    card.scale.y = card.scale.x;

    card.height = maxH;
    card.scale.x = card.scale.y;

    const dy = (this.height - maxH - 2 * this.gap) / this.cardsNo;
    const start = this.getStartByIndex(card.index);
    const end = this.getEndByIndex(card.index);

    if (card.moved) {
      Object.assign(card, end);
    } else {
      if (!card.animation) {
        Object.assign(card, start);
      } else {
        let delta = this.getDelta(start, end);
        card.animation.start = Object.assign({}, start);
        card.animation.end = Object.assign({}, end);
        card.animation.delta = Object.assign({}, delta);
      }
    }
  }
  getStartByIndex(index) {
    const dy = (this.height - this.maxH - 2 * this.gap) / this.cardsNo;
    return {
      x: this.gap,
      y: this.height - this.gap - this.maxH - index * dy
    };
  }
  getEndByIndex(index) {
    const dy = (this.height - this.maxH - 2 * this.gap) / this.cardsNo;
    return {
      x: this.width - this.gap - this.maxW,
      y: this.height - this.gap - this.maxH - (this.cardsNo - index - 1) * dy
    };
  }
  destroy() {
    this.ticker.remove(this.render, this);
    if (this.moveId) {
      clearInterval(this.moveId);
      delete this.moveId;
    }
    if (this.resizeId) {
      clearTimeout(this.resizeId);
      delete this.resizeId;
    }
    delete this.cardTexture;
    this.cards = this.cards.map(card => {
      if (card && card.animation) {
        card.animation.reject();
        delete card.animation;
      }
      card && card.destroy();
    });
    this.cards.length = 0;
    delete this.cards;
    delete this.gap;
    delete this.cardsNo;
    delete this.cardIndex;
  }
}
