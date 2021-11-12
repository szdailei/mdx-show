/* eslint-disable no-console */

const maxIdleCount = 5;

class Complier {
  constructor(name, path, cleanFunc, buildFunc, options) {
    this.name = name;
    this.path = path;
    this.cleanFunc = cleanFunc;
    this.buildFunc = buildFunc;
    this.options = options;
  }

  async build() {
    this.options.compiling = true;
    await this.cleanFunc();
    this.options.requireCompile = false;
    this.options.idleCount = 0;
    try {
      await this.buildFunc();
      const now = new Date();
      console.log(`${this.name} rebuild at ${now.toGMTString()}`);
    } catch (error) {
      console.log(error);
    }
    this.options.compiling = false;
  }

  period() {
    if (this.options.changed) {
      this.options.requireCompile = true;
      this.options.idleCount = 0;
      this.options.changed = false;
    } else if (this.options.requireCompile) {
      this.options.idleCount += 1;
    }

    if (this.options.requireCompile && this.options.idleCount >= maxIdleCount && !this.options.clientCompiling) {
      this.build(this);
    }
  }
}

export default Complier;
