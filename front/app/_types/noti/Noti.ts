export interface INotification {
  id: number;
  content: string;
  url: string;
  isRead: boolean;
  scheduleType: string;
  notificationType: string;
  sendDate: string;
  time?: string;
  message?: string;
}

export interface ITransformedNotiData {
  sendDate: string;
  notifications: (INotification & { time: string })[];
}
