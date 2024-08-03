import { IMate } from '@/app/_types';
import { getImgUrlSrc, getUserRoleLabel, UserRoleValue } from '@/app/constants/userRoleOptions';
import styled from 'styled-components';

interface IMateProfileProps {
  isClicked?: boolean;
  onClick?: () => void;
  mate: IMate;
  size?: string;
}

const MateProfile = ({ isClicked, onClick, mate, size }: IMateProfileProps) => {
  const userRoleLabel = mate.userRole ? getUserRoleLabel(mate.userRole) : null;
  const imgUrlSrc = getImgUrlSrc(mate.imgUrl, mate.userRole as UserRoleValue);

  return (
    <Wrapper>
      <ProfileContainer>
        <Profile src={imgUrlSrc} alt={mate.nickName} data-clicked={isClicked} onClick={onClick} size={size} />
        {isClicked && <CheckImg src='/svgs/mate_check.svg' alt='mate-check' width={20} height={20} />}
      </ProfileContainer>
      <Info>
        <NickName>{mate.nickName}</NickName>
        <Name>{userRoleLabel}</Name>
      </Info>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 64px;
`;

const ProfileContainer = styled.div`
  position: relative;
`;

const Profile = styled.img<{ size?: string }>`
  width: ${({ size }) => (size ? `${size}px` : '60px')};
  height: ${({ size }) => (size ? `${size}px` : '60px')};
  border-radius: 50%;
  box-sizing: border-box;
  border: 2px solid transparent;
  cursor: pointer;

  &[data-clicked='true'] {
    border-color: #06acf4;
  }
`;

const CheckImg = styled.img`
  position: absolute;
  right: -10px;
`;

const Info = styled.div`
  display: flex;
  height: 40px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 8px;

  p {
    display: inline-block;
    margin: 3px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
