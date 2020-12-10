import https from 'https';
import path from 'path';
import Octo from '@octo-bot/core';
import TomonBot from '@octo-bot/tomon-bot';

const agent = new https.Agent({ rejectUnauthorized: false });

const tomonOptions = {
  axiosConfig: {
    httpsAgent: agent,
  },
};

const ROOT = path.resolve(__dirname);

const tomonBot = new TomonBot(ROOT, 'tomon', tomonOptions);
// const tomonBot = new TomonBot(ROOT, 'tomon');

const instance = Octo.getInstance({
  bots: [tomonBot],
  ROOT,
});

instance.start();
