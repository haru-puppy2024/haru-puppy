import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { IMate } from '@/app/_types';
import { getUserRoleLabel } from '@/app/constants/userRoleOptions';

interface IMateProfileProps {
  isClicked?: boolean;
  onClick?: () => void;
  mate: IMate;
  size?: string;
}

const MateProfile = ({ isClicked, onClick, mate, size }: IMateProfileProps) => {
  const onMateDelete = () => {
    console.log('mate 삭제');
  };

  const userRoleLabel = mate.userRole ? getUserRoleLabel(mate.userRole) : null;

  return (
    <Wrapper>
      <ProfileContainer>
        <Profile data-clicked={isClicked} onClick={onClick} size={size} />
        {isClicked && <Image src='/svgs/mate_check.svg' alt='mate-check' width={20} height={20} />}
      </ProfileContainer>
      <Info size={size}>
        <NickName>{mate.nickName}</NickName>
        <Name>{userRoleLabel}</Name>
      </Info>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 80px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfileContainer = styled.div`
  position: relative;
  height: 40px;
  & > img {
    position: absolute;
    top: 20%;
    left: 85%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
`;

const Profile = styled.div<{ size?: string }>`
  width: ${({ size }) => (size ? `${size}px` : '60px')};
  height: ${({ size }) => (size ? `${size}px` : '60px')};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.light};
  position: relative;
  box-sizing: border-box;
  border: 2px solid transparent;
  cursor: pointer;

  &[data-clicked='true'] {
    border-color: #06acf4;
  }
`;

const Info = styled.div<{ size?: string }>`
  display: flex;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-top: ${({ size }) => (size === '60' ? '20px' : '0')};

  p {
    display: inline-block;
    margin: 3px;
  }
`;

const NickName = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black90};
`;

const Name = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black80};
`;

export default MateProfile;
