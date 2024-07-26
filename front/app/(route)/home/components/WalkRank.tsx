import { IRanking } from '@/app/_types/user/Mate';
import { getImgUrlSrc, getUserRoleValue, UserRoleValue } from '@/app/constants/userRoleOptions';
import styled from 'styled-components';
interface IWalkRank {
  ranking: IRanking[];
}

const WalkRank = ({ ranking }: IWalkRank) => {
  console.log(ranking);

  const topRanking = ranking.sort((a, b) => b.count - a.count).slice(0, 3);

  return (
    <>
      <Wrapper>
        <Title>주간 산책 메이트 랭킹</Title>
        <ChartWrapper>
          {topRanking?.map((user, index) => {
            const mateRoleValue = getUserRoleValue(user.userRole);
            const imgUrlSrc = getImgUrlSrc(user.imgUrl, mateRoleValue as UserRoleValue);

            let barHeight;
            if (user.count === 0) {
              barHeight = 5;
            } else if (index === 0) {
              barHeight = 130;
            } else if (index === 1) {
              barHeight = 95;
            } else if (index === 2 && user.count > 0) {
              barHeight = 72;
            } else {
              barHeight = Math.min(72 + (user.count - 1) * 3, 130);
            }

            let barColor;
            if (user.count <= 1 && index === 2) {
              barColor = '#dbdbdb';
            } else if (index === 0) {
              barColor = '#929292';
            } else if (index === 1 && user.count > 0) {
              barColor = '#adadad';
            } else {
              barColor = '#dbdbdb';
            }

            console.log('유저 정보', user.userRole);
            console.log('유저정보 이미지', imgUrlSrc);
            console.log('유저 정보', ranking);
            return (
              <BoxWrapper key={index}>
                <UserContainer data-walk-count={user.count}>
                  <UserProfileImage>
                    <img src={imgUrlSrc} alt='프로필 이미지' width={60} />
                  </UserProfileImage>
                  <Nickname>{user.nickName}</Nickname>
                  <Role>{user.userRole}</Role>
                  <WalkCount>{user.count}회</WalkCount>
                </UserContainer>
                <Bar style={{ height: `${barHeight}px`, backgroundColor: barColor }} />
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
  min-height: 260px;
  bottom: 0px;
`;

const Title = styled.span`
  font-size: 20px;
  text-align: start;
  margin-bottom: 44px;
`;
const BoxWrapper = styled.div`
  width: 100px;
  min-height: 177px;
  display: flex;
  margin-right: 12px;
  flex-direction: column;
  align-items: center;
  gap: 13px;
`;

const UserContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  height: 100%;
`;

const Bar = styled.div`
  width: 80px;
  background-color: #dbdbdb;
  border-radius: 10px;
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
  margin: 16px 13px;
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
