import { startTelegram } from "./api/telegram/telegram.js";

const startApp = async () => {
  try {
    console.log("Start App!!!");
    await startTelegram();
  } catch (e) {
    console.log(e);
  }
};

startApp();
