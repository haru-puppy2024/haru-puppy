'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { userState } from '@/app/_states/userState';
import ContainerLayout from '@/app/components/layout/layout';
import { KAKAO_AUTH_URL } from '@/app/constants/api';
import LogoImg from '@/public/svgs/logo.svg';
import kakaoMsgIcon from '@/public/svgs/message-circle.svg';
import Loading from '@/app/components/loading/loading';

const LoginPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [, setUserData] = useRecoilState(userState);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search);
      const homeId = searchParams.get('homeId') || null;
      if (homeId) {
        setUserData((prevUserData) => ({
          ...prevUserData,
          homeId: homeId,
        }));
      }
    }
  }, [isClient, setUserData]);

  const onLoginClick = () => {
    router.push(KAKAO_AUTH_URL);
  };

  if (!isClient) {
    return null;
  }

  return (
    <ContainerLayout>
      <Suspense fallback={<Loading />}>
        <StyledMain>
          <Image src={LogoImg} alt='하루강아지 로고' priority />
          <LoginButtonWrap onClick={onLoginClick}>
            <Image priority src={kakaoMsgIcon} alt='카카오 메세지' />
            카카오톡 계정으로 시작
          </LoginButtonWrap>
        </StyledMain>
      </Suspense>
    </ContainerLayout>
  );
};

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 7.5rem;
  gap: 11.0625rem;
`;
const LoginButtonWrap = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 322px;
  height: 44px;
  border: 1px solid #f2c94c;
  border-radius: 44px;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typo.regular};
  color: ${({ theme }) => theme.colors.black80};
  & > img {
    margin: 0 59px 0 14px;
  }
`;

export default LoginPage;
