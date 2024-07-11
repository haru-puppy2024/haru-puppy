import { IMate } from '../user/Mate';

export interface IScheduleAddFormData {
  scheduleType: string;
  mates: IMate[] | [];
  scheduleDate: Date | string;
  scheduleTime: string;
  repeatId?: number;
  repeatType: string;
  alertType: string;
  memo: string;
}
