import path from 'path';
import Octo from '@octo-bot/core';
import TomonBot from '@octo-bot/tomon-bot';

const ROOT = path.resolve(__dirname);

const tomonBot = new TomonBot(ROOT, 'tomon');

const instance = Octo.getInstance({
  bots: [tomonBot],
  ROOT,
});

instance.start();
