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
import { INotification } from '@/app/_types/noti/Noti';
import { useGetSingleNotification } from '@/app/_utils/apis/noti/useGetNotificationAPI';
import { useRouter } from 'next/navigation';

const NOTIFICATION_DURATION = 5000;

const NotificationManager: React.FC = () => {
  const notifications = useRecoilValue(notificationsState);
  const setNotifications = useSetRecoilState(notificationsState);
  const isEnabled = useRecoilValue(eventSourceEnabledState);
  const { isEnabled: eventSourceIsEnabled } = useEventSource();
  const shownNotifications = useRef(new Set<number>());
  const getSingleNotification = useGetSingleNotification();
  const router = useRouter();

  const removeNotification = useCallback(
    (id: number) => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      shownNotifications.current.delete(id);
    },
    [setNotifications],
  );

  const handleNotificationClick = useCallback(
    (notificationId: number) => {
      getSingleNotification.mutate(notificationId, {
        onSuccess: () => {
          router.push('/noti');
        },
      });
    },
    [getSingleNotification, router],
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
            content={notification.content}
            time={time}
          />,
          {
            autoClose: NOTIFICATION_DURATION,
            onClose: () => removeNotification(notification.id),
            onClick: () => handleNotificationClick(notification.id),
          },
        );
      }
    },
    [removeNotification, handleNotificationClick],
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
