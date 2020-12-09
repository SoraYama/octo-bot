/* eslint-disable @typescript-eslint/ban-types */
import { IScheduleInfo } from '../types/ISchedule';

class Schedule {
  private _scheduleMap = new Map<string, IScheduleInfo>();

  public setScheduleInfo(clazz: Function, methodName: string, cronStr: string) {
    if (!methodName) {
      return;
    }

    const key = `${clazz.name}-${methodName}`;

    if (this._scheduleMap.get(key)) {
      return;
    }

    this._scheduleMap.set(key, { clazz, methodName, cronStr });
  }

  public get allSchedule() {
    return this._scheduleMap.values();
  }
}

const schedule = new Schedule();

export default schedule;
