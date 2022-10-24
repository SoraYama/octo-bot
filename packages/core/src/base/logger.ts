import log4js from 'log4js';
import path from 'path';

let configuredLog4js: log4js.Log4js | null = null;

const configureLog = (ROOT: string) => {
  if (!configuredLog4js) {
    configuredLog4js = log4js.configure({
      appenders: {
        main: {
          type: 'file',
          filename: path.resolve(ROOT, 'log', 'main.log'),
        },
        console: {
          type: 'console',
        },
      },
      categories: {
        default: {
          appenders: ['main', 'console'],
          level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
        },
      },
    });
  }

  return configuredLog4js;
};

export default configureLog;
