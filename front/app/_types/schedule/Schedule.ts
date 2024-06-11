export interface IScheduleItem {
  scheduleId: number;
  scheduleType: string;
  mates: number[];
  scheduleDate?: string;
  time: string;
  repeatId?: string | null;
  active: boolean;
  alertType: string;
  homeId: string;
  isActive: boolean;
  isDeleted: boolean;
  memo: string;
  repeatType: string;
  scheduleTime: string;
}