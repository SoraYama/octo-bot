import fs from 'fs-extra';
import path from 'path';

const pkgJson = fs.readJsonSync(path.resolve(__dirname, '../../package.json'));

export default pkgJson;
