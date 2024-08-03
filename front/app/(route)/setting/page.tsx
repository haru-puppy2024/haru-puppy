'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userState } from '@/app/_states/userState';
import { useRouter } from 'next/navigation';
import NavMenu from './components/NavMenu';
import UpperUserProfile from './components/UpperUserProfile';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import ToggleSwitch from '@/app/components/toggle/ToggleSwitch';
import Modal from '@/app/components/modal/modal';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import { fetchNotification } from '@/app/_utils/apis/usePutAlarmApi';
import { useTerminateAccount } from '@/app/_utils/apis/useTerminateAccount';
import { useLogout } from '@/app/_utils/apis/user/useLogout';
import { getImgUrlSrc, getUserRoleLabel, UserRoleValue } from '@/app/constants/userRoleOptions';
import Loading from '@/app/components/loading/loading';

const SettingPage = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [isLogoutModal, setLogoutIsModal] = useState(false);
  const [isTerminateModal, setTerminateModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const userData = useRecoilValue(userState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('access_token');
    setAccessToken(token);
    if (!token) {
      router.push('/auth/login');
    }
  }, [router]);

  const { mutate: notification } = useMutation((active: boolean) => fetchNotification(active, accessToken), {
    onSuccess: () => {
      queryClient.invalidateQueries('notifications');
    },
  });

  const defaultImg = userData.imgUrl && getImgUrlSrc(userData.imgUrl, userData.userRole as UserRoleValue);
  const validImgUrl = userData.imgUrl && userData.imgUrl?.startsWith('data') ? userData.imgUrl : defaultImg;
  const userRoleLabel = userData.userRole && getUserRoleLabel(userData.userRole);

  // 알림 토글 함수
  const handelToggle = (toggled: boolean) => {
    setIsToggled(toggled);
    notification(toggled);
  };

  // 매이트 초대 함수(/invite로 라우팅)
  const handleMateInvite = () => {
    if (typeof window !== 'undefined') {
      router.push('/invite');
    }
  };

  const toggleLogoutModal = () => {
    setLogoutIsModal(!isLogoutModal);
  };

  const toggleTerminateModal = () => {
    setTerminateModal(!isTerminateModal);
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

  if (!isClient) {
    return <Loading />; // 로딩 상태 표시
  }

  return (
    <>
      <TopNavigation />
      <Wrapper>
        <UpperUserProfile imgUrl={validImgUrl} nickName={userData.nickName} userRole={userRoleLabel} />
        <MenuWrapper>
          <NavMenu title='알림 설정'>
            <ToggleSwitch onToggle={handelToggle} isToggled={isToggled} />
          </NavMenu>
          <NavMenu title='로그아웃' onClick={toggleLogoutModal} />
          {isLogoutModal && <Modal children='로그아웃하시겠습니까?' btn1='취소' btn2='로그아웃' onClose={toggleLogoutModal} onBtn2Click={handleLogout} />}
          <NavMenu title='회원 탈퇴' onClick={toggleTerminateModal} />
          {isTerminateModal && <Modal children='정말 탈퇴 하시겠습니까?' btn1='취소' btn2='회원 탈퇴' onClose={toggleTerminateModal} onBtn2Click={handleTerminate} />}
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
