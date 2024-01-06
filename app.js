import { telegrafBot } from './telegram/telegraf.js';
class App {
  async start() {
    try {
      await telegrafBot.launch();
    } catch (error) {
      console.log(error);
    }
  }
}

const app = new App();

app.start();
