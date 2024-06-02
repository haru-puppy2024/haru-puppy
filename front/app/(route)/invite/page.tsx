'use client';

import { useRecoilValue } from 'recoil';
import { userState } from '@/app/_states/userState';
import ContentCopyIcon from '@mui/icons-material/ContentCopyRounded';
import styled from 'styled-components';
import ContainerLayout from '@/app/components/layout/layout';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import { useState } from 'react';
import Modal from '@/app/components/modal/modal';

const InvitePage = () => {
  const userData = useRecoilValue(userState);
  const homeId = userData.homeId;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const copyToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
      try {
        await navigator.clipboard.writeText(text);
        setIsModalVisible(true);
      } catch (error) {
        console.error('클립보드 복사에 실패했습니다.', error);
      }
    } else {
      console.log('이 브라우저는 클립보드 복사 기능을 지원하지 않습니다.');
      alert('이 브라우저는 클립보드 복사 기능을 지원하지 않습니다.');
    }
  };

  const shareLink = () => {
    const inviteUrl = `http://localhost:3000/auth/login?homeId=${homeId}`;
    copyToClipboard(inviteUrl);
  };

  //   const shareLink = () => {
  //     const inviteUrl = `https://haru-puppy-front.vercel.app/auth/login?homeId=${homeId}`;
  //     copyToClipboard(inviteUrl);
  //   };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ContainerLayout>
      {isModalVisible && <Modal children='초대 링크가 클립보드에 복사되었습니다.' btn1='확인' onClose={handleCloseModal} />}
      <TopNavigation />
      <InvitePageWrap>
        <strong>강아지를 같이 돌볼 메이트를 초대해주세요!</strong>
        <InviteButtonWrap onClick={shareLink}>
          <ContentCopyIcon width={20} height={20} />
          초대 링크 복사하기
        </InviteButtonWrap>
      </InvitePageWrap>
    </ContainerLayout>
  );
};

const InvitePageWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > strong {
    font-weight: ${({ theme }) => theme.typo.semibold};
  }
`;
const InviteButtonWrap = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 300px;
  width: 370px;
  height: 56px;
  border-radius: 10px;
  font-size: 18px;
  font-weight: ${({ theme }) => theme.typo.regular};
  background-color: #ffd06c;
  color: #000000;
  & > :nth-child(1) {
    margin: 0 50px 0 53px;
  }
`;

export default InvitePage;
