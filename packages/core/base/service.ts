import { IOctoBot } from '../types/ICore';
import { IOctoEvent } from '../types/IEvent';

export default class BaseService {
  public constructor(public bot: IOctoBot, public event: IOctoEvent) {}
}
