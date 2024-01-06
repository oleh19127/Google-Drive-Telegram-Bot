import 'dotenv/config';
import { Telegraf, Input } from 'telegraf';
import { message } from 'telegraf/filters';
import { help } from './command-static/help.js';
import { utils } from '../utils/utils.js';
import { googleDrive } from '../google-drive/googleDrive.js';

export const telegrafBot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, {
  handlerTimeout: 900_000_000,
});

telegrafBot.command('quit', async (ctx) => {
  await ctx.leaveChat();
});

telegrafBot.command('start', async (ctx) => {
  await ctx.reply(`Hello ${ctx.from.first_name}`);
});

telegrafBot.command('help', async (ctx) => {
  await ctx.reply(help);
});

telegrafBot.command('get_photos', async (ctx) => {
  console.log('Start delete photos from tmp folder...');
  await utils.deleteAllPhotosFromTmpFolder();
  console.log('End delete photos from tmp folder');

  console.log('Getting all files from google drive...');
  const allFiles = await googleDrive.getAllFiles();
  console.log('End getting all files from google drive');

  console.log('Getting random photos...');
  const randomFiles = await utils.getRandomPhotos(allFiles, 10);
  console.log('End getting random photos');

  console.log('Start downloading photos...');
  await googleDrive.downloadFiles(randomFiles);
  console.log('End downloading photos');

  console.log('Getting all images from tmp folder...');
  const allImages = await utils.getAllImageNamesFromTmpFolder();
  console.log('End getting all images from tmp folder');

  await ctx.reply('Start sending photos...');
  console.log('Start sending photos...');
  let sleepTime = 500;
  for (const image of allImages) {
    await ctx.replyWithPhoto(Input.fromLocalFile(image));
    await utils.sleep(sleepTime);
    sleepTime = sleepTime + 150;
  }
  console.log('End sending photos');
  await ctx.reply('End sending photos');
});

telegrafBot.catch(async (e, ctx) => {
  await ctx.reply(e.message);
  console.log(e.message);
});

// Enable graceful stop
process.once('SIGINT', () => telegrafBot.stop('SIGINT'));
process.once('SIGTERM', () => telegrafBot.stop('SIGTERM'));
