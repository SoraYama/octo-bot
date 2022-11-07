import path from 'path';

import configureLog from '../base/logger';
import { loadDir } from './utils';

abstract class BaseLoader {
  protected logger;

  public constructor(
    public ROOT: string,
    protected loadPath?: string,
    protected ignorePaths: string[] = [],
  ) {
    this.logger = configureLog(ROOT).getLogger('loader');
    this.loadResolvedDir.bind(this);
  }

  public async loadResolvedDir() {
    if (!this.loadPath) {
      this.logger.warn(`loader ${this.constructor.name} has no load path`);
      return;
    }
    await loadDir(this.getResolvedPath(this.loadPath), this.loadFn.bind(this), this.ignorePaths);
  }

  protected abstract loadFn(fileName: string): Promise<void>;

  protected getResolvedPath(...dirOrFileNames: string[]) {
    return path.resolve(this.ROOT, ...dirOrFileNames);
  }
}

export default BaseLoader;
