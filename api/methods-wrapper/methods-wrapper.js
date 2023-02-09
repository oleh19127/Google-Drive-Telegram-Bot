import ora from "ora";
import { random } from "../random/random.js";

class MethodsWrapper {
  constructor() {
    this.spinner = ora();
  }
  async init(method, spinnerText, [...arg]) {
    const spinner = this.spinner;
    spinner.color = await random.color();
    try {
      spinner.start(spinnerText);
      const result = await method(...arg);
      spinner.succeed();
      return result;
    } catch (e) {
      spinner.fail();
      console.log(e.message);
    }
  }
}

export const methodsWrapper = new MethodsWrapper();
