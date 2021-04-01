import log4js from 'log4js';
import path from 'path';

export default function configureLog(ROOT: string) {
  return log4js.configure({
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
