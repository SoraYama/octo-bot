import dotenv from 'dotenv';

const botToken = dotenv.config().parsed?.TELEGRAM_TOKEN || '';

export default {
  botToken,
  superUserIds: [],
  bannedModules: [],
  enabledGroupIds: null,
  blockedUser: [],
};
