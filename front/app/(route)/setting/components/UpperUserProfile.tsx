import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { StyledArrowIcon } from './NavMenu';
import { useRouter } from 'next/navigation';
import { getUserRoleLabel } from '@/app/constants/userRoleOptions';

interface IUserInfo {
  nickName: string | null;
  userRole: string | null;
  imgUrl: string | null;
}

const UpperUserProfile = ({ nickName, userRole, imgUrl }: IUserInfo) => {
  const router = useRouter();
  const onUserProfileClick = () => {
    router.push('/profile/my');
  };

  const validImgUrl = imgUrl && imgUrl?.startsWith('data') ? imgUrl : '/svgs/mate_father.svg';
  const userRoleLabel = userRole ? getUserRoleLabel(userRole) : null;

  return (
    <Wrapper onClick={onUserProfileClick}>
      {imgUrl ? <Image src={validImgUrl} alt='User Profile' width={70} height={70} /> : <Image src='/svgs/mate_father.svg' alt='Default User Profile' width={70} height={70} />}
      <InfoWrapper>
        <Info>
          <UserDetails>
            <UserName>{nickName}</UserName>
            <UserRole>{userRoleLabel}</UserRole>
          </UserDetails>
          <div>
            <StyledArrowIcon />
          </div>
        </Info>
      </InfoWrapper>
    </Wrapper>
  );
};

const InfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  cursor: pointer;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-size: 24px;
  font-weight: ${({ theme }) => theme.typo.regular};
  color: ${({ theme }) => theme.colors.black90};
  margin-bottom: 8px;
`;

const UserRole = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black70};
`;

const Wrapper = styled.div`
  justify-content: space-between;
  width: 340px;
  height: 70px;
  display: flex;
  margin: 50px 0px;
`;

export default UpperUserProfile;
