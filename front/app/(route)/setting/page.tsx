'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCookies } from 'react-cookie';
import { useRecoilValue } from 'recoil';
import { userState } from '@/app/_states/userState';
import { useRouter } from 'next/navigation';
import NavMenu from './components/NavMenu';
import UpperUserProfile from './components/UpperUserProfile';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import ToggleSwitch from '@/app/components/toggle/ToggleSwitch';
import Modal from '@/app/components/modal/modal';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import { useTerminateAccount } from '@/app/_utils/apis/useTerminateAccount';
import { useLogout } from '@/app/_utils/apis/user/useLogout';
import {
  getImgUrlSrc,
  getUserRoleLabel,
  UserRoleValue,
} from '@/app/constants/userRoleOptions';
import Loading from '@/app/components/loading/loading';
import { overlay } from 'overlay-kit';
import { useEventSource } from '@/app/_utils/apis/noti/useGetSubscribeNotificationAPI';

const SettingPage = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const userData = useRecoilValue(userState);
  const [isClient, setIsClient] = useState(false);
  const [cookies] = useCookies(['access_token']);
  const eventSource = useEventSource();

  useEffect(() => {
    setIsClient(true);
    const token = cookies['access_token'];
    setAccessToken(token);
    if (!token) {
      router.push('/auth/login');
    }
  }, [cookies, router]);

  const defaultImg =
    userData.imgUrl && getImgUrlSrc(userData.imgUrl, userData.userRole as UserRoleValue);
  const validImgUrl =
    userData.imgUrl && userData.imgUrl?.startsWith('data') ? userData.imgUrl : defaultImg;
  const userRoleLabel = userData.userRole && getUserRoleLabel(userData.userRole);

  // 알림 토글 함수
  const handleToggle = (toggled: boolean) => {
    console.log('Toggling EventSource in SettingPage');
    eventSource.toggleEventSource();
  };

  // 매이트 초대 함수(/invite로 라우팅)
  const handleMateInvite = () => {
    if (typeof window !== 'undefined') {
      router.push('/invite');
    }
  };

  const openLogoutModal = () => {
    overlay.open(({ isOpen, close }) => (
      <Modal
        isOpen={isOpen}
        onClose={close}
        children='로그아웃하시겠습니까?'
        btn1='취소'
        btn2='로그아웃'
        onBtn2Click={handleLogout}
      />
    ));
  };

  const openTerminateModal = () => {
    overlay.open(({ isOpen, close }) => (
      <Modal
        isOpen={isOpen}
        onClose={close}
        children='정말 탈퇴 하시겠습니까?'
        btn1='취소'
        btn2='회원 탈퇴'
        onBtn2Click={handleTerminate}
      />
    ));
  };

  // 로그아웃
  const { mutate: logoutMutation } = useLogout();
  const handleLogout = () => {
    logoutMutation({ accessToken: accessToken || '' });
  };

  // 회원탈퇴
  const { mutate: terminateMutation } = useTerminateAccount();
  const handleTerminate = () => {
    terminateMutation({ accessToken: accessToken || '' });
  };

  if (!isClient || !accessToken) {
    return <Loading />;
  }

  return (
    <>
      <TopNavigation />
      <Wrapper>
        <UpperUserProfile
          imgUrl={validImgUrl}
          nickName={userData.nickName}
          userRole={userRoleLabel}
        />
        <MenuWrapper>
          <NavMenu title='알림 설정'>
            <ToggleSwitch onToggle={handleToggle} isToggled={eventSource.isEnabled} />
          </NavMenu>
          <NavMenu title='로그아웃' onClick={openLogoutModal} />
          <NavMenu title='회원 탈퇴' onClick={openTerminateModal} />
          <NavMenu title='메이트 초대하기' onClick={handleMateInvite} />
        </MenuWrapper>
      </Wrapper>
      <BottomNavigation />
    </>
  );
};

const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  margin-top: 50px;
`;

export default SettingPage;
