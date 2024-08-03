'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useCode, useLoginQuery } from '@/app/_utils/apis/usePostLoginApi';
import Loading from '@/app/components/loading/loading';

const KakaoCallbackPage = () => {
  const code = useCode();
  const [error, setError] = useState<string>();
  const { isLoading } = useLoginQuery(code);

  if (error) {
    return (
      <Wrapper>
        <Image width={300} height={300} src='/svgs/dog_profile.svg' alt='dog_profile' />
        <StyledLink href='/auth/login'>로그인 페이지로 돌아가기</StyledLink>
        <p>{error}</p>
      </Wrapper>
    );
  }

  return <>{isLoading && <Loading />}</>;
};

const Wrapper = styled.div`
  display: flex;
  margin: 50px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  svg {
    color: ${({ theme }) => theme.colors.light};
  }

  & p {
    margin: 100px;
    font-size: 35px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.black80};
  }
`;
const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.main};
  border-radius: 50%;
  padding: 15px 30px;
`;
export default KakaoCallbackPage;
