import dotenv from 'dotenv';

const botToken = dotenv.config().parsed?.QQ_BOT_TOKEN || '';

export default {
  botToken,
  superUserIds: [],
  bannedModules: [],
  enabledGroupIds: null,
  blockedUser: [],
};
