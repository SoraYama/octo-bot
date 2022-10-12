import path from 'path';
import SocksProxyAgent from 'socks-proxy-agent';

import Octo from '@octo-bot/core';
// import DiscordBot from '@octo-bot/discord-bot';
// import TomonBot from '@octo-bot/tomon-bot';
import TelegramBot from '@octo-bot/telegram-bot';

const agent = SocksProxyAgent('socks://127.0.0.1:1080');

// const tomonOptions = {
//   axiosConfig: {
//     httpsAgent: agent,
//   },
//   wsOptions: {
//     agent,
//   },
// };

const ROOT = path.resolve(__dirname);

// const tomonBot = new TomonBot(ROOT, 'tomon', tomonOptions);
// const discordBot = new DiscordBot(ROOT, 'discord');
const telegramBot = new TelegramBot(ROOT, 'telegram', {
  telegram: {
    agent,
  },
  handlerTimeout: 10000,
});

const instance = Octo.getInstance({
  bots: [telegramBot],
  ROOT,
});

instance.start();
