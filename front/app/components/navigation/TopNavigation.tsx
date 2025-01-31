'use client';
import { useQuery } from 'react-query';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import NotificationUnreadIcon from '../../../public/svgs/notifications_unread.svg';
import { INotification } from '@/app/_types/noti/Noti';
import { useCookies } from 'react-cookie';

const TopNavigation = () => {
  const [cookies] = useCookies(['access_token']);
  const token = cookies.access_token;
  const { data: allNotifications } = useQuery<INotification[], Error>(
    'getAllNotifications',
    async () => {
      return Promise.resolve([]);
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  );
  const [showBtns, setShowBtns] = useState(!!token);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (allNotifications) {
      const hasUnread = allNotifications.some(
        (notification: INotification) => !notification.isRead,
      );
      setHasNotification(hasUnread);
    }
  }, [allNotifications]);

  const NotiComponent = hasNotification ? (
    <Image src={NotificationUnreadIcon} alt='알림' />
  ) : (
    <NotificationsNoneRoundedIcon />
  );

  const handleNotiClick = () => {
    setHasNotification(false);
    router.push('/noti');
  };

  useEffect(() => {
    setShowBtns(!!token);
  }, []);

  const pathname = usePathname();
  const getTitle = (pathname: string | null) => {
    switch (pathname) {
      case '/':
      default:
        return '홈';
      case '/auth/signup':
        return '회원가입';
      case '/auth/login':
        return '로그인';
      case '/schedule':
        return '일정';
      case '/noti':
        return '알림';
      case '/profile/dog':
        return '강아지 프로필';
      case '/profile/my':
        return '내 프로필';
      case '/auth/register/user':
        return '내 프로필';
      case '/auth/register/dog':
        return '강아지 프로필';
      case '/invite':
        return '메이트 초대하기';
      case '/setting':
        return '설정';
      case '/auth/userprofile':
        return '내 프로필';
      case '/setting/userprofile':
        return '내 프로필';
    }
  };

  const initialTitle = getTitle(pathname);
  const [currentTitle, setCurrentTitle] = useState(initialTitle);

  const router = useRouter();
  const handleGoBack = () => router.back();

  useEffect(() => {
    if (pathname) {
      const title = getTitle(pathname);
      setCurrentTitle(title);
    }
  }, [pathname]);

  return (
    <TopNavigationWrap data-show-btns={showBtns}>
      <button onClick={handleGoBack}>
        <ArrowBackRoundedIcon />
      </button>
      <h1>{currentTitle}</h1>
      <button onClick={handleNotiClick}>{NotiComponent}</button>
    </TopNavigationWrap>
  );
};

const TopNavigationWrap = styled.nav`
  position: absolute;
  top: 0;
  z-index: 100;
  background-color: #ffffff;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 390px;

  height: 48px;
  border-bottom: 0.5px solid ${({ theme }) => theme.colors.black60};
  background-color: #ffffff;

  & > h1 {
    flex-grow: 1;
    text-align: center;
    font-size: 16px;
    font-weight: ${({ theme }) => theme.typo.semibold};
  }

  & > *:not(strong) {
    flex-shrink: 0;
  }

  & > button {
    padding: 12px 15px;
    color: ${({ theme }) => theme.colors.black80};

    &:hover {
      color: ${({ theme }) => theme.colors.black90};
    }
  }

  &[data-show-btns='true'] > button {
    visibility: visible;
  }
`;

export default TopNavigation;
