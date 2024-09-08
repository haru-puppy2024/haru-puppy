import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  notificationsState,
  eventSourceEnabledState,
} from '@/app/_utils/apis/noti/useGetSubscribeNotificationAPI';
import NotiCard from './NotiCard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEventSource } from '@/app/_utils/apis/noti/useGetSubscribeNotificationAPI';
import { INotification } from '@/app/_utils/apis/noti/useGetNotificationAPI';

const NOTIFICATION_DURATION = 50000; // 알림이 표시될 시간 (밀리초)

const NotificationManager: React.FC = () => {
  const notifications = useRecoilValue(notificationsState);
  const setNotifications = useSetRecoilState(notificationsState);
  const isEnabled = useRecoilValue(eventSourceEnabledState);
  const { isEnabled: eventSourceIsEnabled } = useEventSource();
  const shownNotifications = useRef(new Set<number>());

  const removeNotification = useCallback(
    (id: number) => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      shownNotifications.current.delete(id);
    },
    [setNotifications],
  );

  const showNotification = useCallback(
    (notification: INotification) => {
      if (!shownNotifications.current.has(notification.id)) {
        shownNotifications.current.add(notification.id);
        const time = new Date().toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
        });
        toast(
          <NotiCard
            notificationId={notification.id}
            scheduleType={notification.scheduleType}
            isRead={null}
            message={notification.content}
            time={time}
            onClose={() => removeNotification(notification.id)}
          />,
          {
            autoClose: NOTIFICATION_DURATION,
            onClose: () => removeNotification(notification.id),
          },
        );
      }
    },
    [removeNotification],
  );

  useEffect(() => {
    if (isEnabled && eventSourceIsEnabled) {
      notifications.forEach((notification) => {
        if (!notification.isRead) {
          showNotification(notification);
        }
      });
    }
  }, [notifications, isEnabled, eventSourceIsEnabled, showNotification]);

  return <ToastContainer position='top-center' />;
};

export default NotificationManager;
