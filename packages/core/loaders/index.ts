import fs from 'fs-extra';
import path from 'path';
import configureLog from '../base/logger';

class Loader {
  protected logger;

  public constructor(public ROOT: string) {
    this.logger = configureLog(ROOT).getLogger('loader');
  }

  protected getResolvedPath(...dirOrFileNames: string[]) {
    return path.resolve(this.ROOT, ...dirOrFileNames);
  }

  protected async getDir(...dirNames: string[]) {
    const path = this.getResolvedPath(...dirNames);
    if (!fs.existsSync(path)) {
      throw new Error(`未找到该路径: ${path}`);
    }
    const list = await fs.readdir(path);
    return list.filter((dir) => dir !== '.DS_Store');
  }
}

export default Loader;
