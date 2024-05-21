import { IMate } from '../user/Mate';

export interface IScheduleAddFormData {
  type: string;
  mates: IMate[] | null;
  date: string | null;
  time: Date | null;
  repeat: string;
  noti: string;
  memo: string;
}
