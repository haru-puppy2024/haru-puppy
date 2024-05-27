import { IMate } from '../user/Mate';

export interface IScheduleAddFormData {
  scheduleType: string;
  mates: IMate[] | null;
  scheduleDate: string | null;
  scheduleTime: string;
  repeatType: string;
  alertType: string;
  memo: string;
}
