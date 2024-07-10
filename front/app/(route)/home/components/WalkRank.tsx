import { IRanking } from '@/app/_types/user/Mate';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';

interface IUser {
  user_id: number;
  user_img?: string;
  nickname?: string;
  rank: number;
}

interface IWalkRank {
  ranking: IRanking[];
}

const WalkRank = ({ ranking }: IWalkRank) => {
  return (
    <>
      <Wrapper>
        <Title>주간 산책 메이트 랭킹</Title>
        <ChartWrapper>
          {ranking?.map((user, index) => (
            <BoxWrapper key={index}>
              <UserContainer data-walk-count={user.count}>
                {/* {user.imgUrl ? <UserProfileImage><Image src={user.imgUrl} alt='프로필 이미지' width={65} height={65} /></UserProfileImage>
                  : <UserProfileImage />} */}
                <Nickname>{user.nickName}</Nickname>
                <WalkCount>{user.count}회</WalkCount>
              </UserContainer>
              <Bar data-walk-count={user.count} />
            </BoxWrapper>
          ))}
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
  width: 370px;
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

const WalkCount = styled.span`
  font-weight: bold;
  margin-top: 10px;
  font-weight: ${({ theme }) => theme.typo.medium};
`;

const Nickname = styled.span`
  margin-top: 10px;
`;

const UserProfileImage = styled.div`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  margin-top: 10px;
  background-color: #cedbea;
`;

export default WalkRank;
