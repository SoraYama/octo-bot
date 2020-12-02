import path from 'path';
import configureLog from '../base/logger';
import { loadDir } from './utils';

abstract class BaseLoader {
  protected logger;

  public constructor(
    public ROOT: string,
    protected loadPath: string,
    protected ignorePaths: string[] = [],
  ) {
    this.logger = configureLog(ROOT).getLogger('loader');
    this.loadResolvedDir();
  }

  protected abstract loadFn(fileName: string): Promise<void>;

  protected getResolvedPath(...dirOrFileNames: string[]) {
    return path.resolve(this.ROOT, ...dirOrFileNames);
  }

  protected loadResolvedDir() {
    loadDir(this.getResolvedPath(this.loadPath), this.loadFn, this.ignorePaths);
  }
}

export default BaseLoader;
