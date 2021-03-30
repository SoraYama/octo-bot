import OctoBot from './bot';
import OctoEvent from './event';

export default class BaseService {
  public constructor(public bot: OctoBot, public event: OctoEvent) {}
}
