import dotenv from 'dotenv';
import path from 'path';
import Octo from '@octo-bot/core';
// import DiscordBot from '@octo-bot/discord-bot';
// import TomonBot from '@octo-bot/tomon-bot';
// import TelegramBot from '@octo-bot/telegram-bot';
import QQBot from '@octo-bot/qq-bot';
import { AvailableIntentsEventsEnum } from 'qq-guild-bot';

// const agent = SocksProxyAgent('socks://127.0.0.1:1080');
const { REDIS_HOST, REDIS_PORT, REDIS_DB, QQ_BOT_TOKEN, QQ_APP_ID } = dotenv.config().parsed || {};

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
// const telegramBot = new TelegramBot(ROOT, 'telegram', {
//   telegram: {
//     agent,
//   },
//   handlerTimeout: 10000,
// });
const qqBot = new QQBot(ROOT, 'qq', {
  appID: QQ_APP_ID, // 申请机器人时获取到的机器人 BotAppID
  token: QQ_BOT_TOKEN, // 申请机器人时获取到的机器人 BotToken
  intents: [
    AvailableIntentsEventsEnum.PUBLIC_GUILD_MESSAGES,
    AvailableIntentsEventsEnum.DIRECT_MESSAGE,
    AvailableIntentsEventsEnum.INTERACTION,
  ], // 事件订阅,用于开启可接收的消息类型
  sandbox: true, // 沙箱支持，可选，默认false. v2.7.0+
});

const instance = Octo.getInstance({
  bots: [qqBot],
  ROOT,
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    database: REDIS_DB,
    // password: REDIS_PASSWORD,
  },
});

instance.start();
