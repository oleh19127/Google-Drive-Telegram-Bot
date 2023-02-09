import { Telegraf } from "telegraf";
import { commands } from "./commands.js";
import { getIdOnly } from "../utils/get-Id-only.js";
import { googleDrive, __dirname } from "../google-drive/google-drive.js";
import { join } from "path";
import { readFileSync } from "node:fs";
import { removeFilesFromFolder } from "../utils/remove-files-from-folder.js";
import { getFileNamesFromFolder } from "../utils/get-file-names-from-folder.js";
import { sleep } from "../sleep/sleep.js";
import * as dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
  handlerTimeout: 900_000_000,
});

export const startTelegram = async () => {
  bot.command("quit", async (ctx) => {
    await ctx.telegram.leaveChat(ctx.message.chat.id);
    await ctx.leaveChat();
  });

  bot.start(async (ctx) => {
    await ctx.reply(`Welcome ${ctx.message.from.first_name}`);
  });

  bot.command("get_photos", async (ctx) => {
    await ctx.reply("Getting random photos from google drive...");
    const idOnly = await getIdOnly(3);
    for (const idOnlyElement of idOnly) {
      await googleDrive.downloadFile(idOnlyElement);
    }
    const filesInTmpFolder = await getFileNamesFromFolder(
      join(__dirname, "temporary-images")
    );
    let sleepTime = 200;
    for (const filesInTmpFolderElement of filesInTmpFolder) {
      await ctx.replyWithPhoto({
        source: readFileSync(
          join(__dirname, "temporary-images", filesInTmpFolderElement)
        ),
      });
      await sleep(sleepTime);
      sleepTime = sleepTime + 50;
    }
    await removeFilesFromFolder(join(__dirname, "temporary-images"));
    await ctx.reply("End upload photos");
  });

  bot.on("message", async (ctx) => {
    await ctx.reply(commands);
  });

  bot.catch(async (e, ctx) => {
    await ctx.reply(e.message);
    console.log(e.message);
  });

  await bot.launch();

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
