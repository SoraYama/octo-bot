import { IOctoEvent } from '../types/IEvent';
import OctoBot from './bot';

export default class BaseService {
  public constructor(public bot: OctoBot, public event: IOctoEvent) {}
}
