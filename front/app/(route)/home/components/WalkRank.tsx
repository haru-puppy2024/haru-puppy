import { IRanking } from '@/app/_types/user/Mate';
import { getImgUrlSrc, UserRoleValue } from '@/app/constants/userRoleOptions';
import styled from 'styled-components';
interface IWalkRank {
  ranking: IRanking[];
}

const WalkRank = ({ ranking }: IWalkRank) => {
  console.log(ranking);

  return (
    <>
      <Wrapper>
        <Title>주간 산책 메이트 랭킹</Title>
        <ChartWrapper>
          {ranking?.map((user, index) => {
            const imgUrlSrc = getImgUrlSrc(user.imgUrl, user.userRole as UserRoleValue);
            console.log('유저 정보', user.imgUrl, user.userRole);
            console.log('유저정보 이미지', imgUrlSrc);
            return (
              <BoxWrapper key={index}>
                <UserContainer data-walk-count={user.count}>
                  <UserProfileImage>
                    <img src={imgUrlSrc} alt='프로필 이미지' />
                  </UserProfileImage>
                  <Nickname>{user.nickName}</Nickname>
                  <Role>{user.userRole}</Role>
                  <WalkCount>{user.count}회</WalkCount>
                </UserContainer>
                <Bar data-walk-count={user.count} />
              </BoxWrapper>
            );
          })}
        </ChartWrapper>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  min-width: 340px;
  bottom: 0px;
`;

const Title = styled.span`
  font-size: 20px;
  text-align: start;
  margin-bottom: 20px;
`;
const BoxWrapper = styled.div`
  width: 100px;
  display: flex;
  margin-right: 12px;
  flex-direction: column;
  position: relative;
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  height: 100%;
  padding-bottom: calc(30px * attr(data-walk-count, number));
`;

const Bar = styled.div`
  width: 80px;
  height: calc(25px * attr(data-walk-count, number));
  background-color: ${({ theme }) => `rgba(0, 0, 0, attr(data-walk-count, number) / 15)`};
  border-radius: 10px;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
`;

const Nickname = styled.span`
  margin-top: 14px;
  font-size: 16px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.black90};
`;

const Role = styled.span`
  margin-top: 7px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black80};
`;

const WalkCount = styled.span`
  margin-top: 16px;
  color: ${({ theme }) => theme.colors.black70};
`;

const UserProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-top: 10px;
  /* background-color: #cedbea; */
`;

export default WalkRank;
