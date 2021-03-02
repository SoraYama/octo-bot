import path from 'path';
import Octo from '@octo-bot/core';
import TomonBot from '@octo-bot/tomon-bot';
import DiscordBot from '@octo-bot/discord-bot';
import TelegramBot from '@octo-bot/telegram-bot';
import SocksProxyAgent from 'socks-proxy-agent';

const agent = SocksProxyAgent('socks://127.0.0.1:1080');

const tomonOptions = {
  axiosConfig: {
    httpsAgent: agent,
  },
  wsOptions: {
    agent,
  },
};

const ROOT = path.resolve(__dirname);

const tomonBot = new TomonBot(ROOT, 'tomon', tomonOptions);
const telegramBot = new TelegramBot(ROOT, 'telegram', {
  telegram: {
    agent,
  },
  handlerTimeout: 10000,
});
const discordBot = new DiscordBot(ROOT, 'discord');

const instance = Octo.getInstance({
  bots: [tomonBot, telegramBot, discordBot],
  // bots: [telegramBot],
  ROOT,
});

instance.start();
