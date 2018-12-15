export default class BaseModule {
  constructor(config = {}) {
    Object.assign(this, config);
    this.init();
  }
  init() {}
  resize(width, height) {}
  destroy() {}
}
