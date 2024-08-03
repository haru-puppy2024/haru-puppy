'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from 'styled-components';
import Image from 'next/image';
import ContainerLayout from '@/app/components/layout/layout';
import Button from '@/app/components/button/Button';
import Loading from '@/app/components/loading/loading';

const WelcomePage = () => {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // 클라이언트에서만 렌더링되도록 설정
  }, []);

  useEffect(() => {
    if (isClient) {
      const searchParams = useSearchParams();
      const emailParam = searchParams?.get('email');
      setEmail(emailParam);
    }
  }, [isClient]);

  const onBtnClick = () => {
    router.push(`/auth/register/user?email=${email}`);
  };
  return (
    <ContainerLayout>
      <Suspense fallback={<Loading />}>
        <Wrapper>
          <Image width={187} height={227} src='/svgs/dog_welcome.svg' alt='환영 이미지' />
          <Button onClick={onBtnClick}>내 프로필 작성하기</Button>
        </Wrapper>
      </Suspense>
    </ContainerLayout>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 7.5rem;
  gap: 9.375rem;
`;

export default WelcomePage;
