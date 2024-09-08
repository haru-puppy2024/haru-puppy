'use client';

import styled from 'styled-components';
import NotiCard from './NotiCard';
import { INotification } from '@/app/_types/noti/Noti';

interface INotiCardGroupProps {
  sendDate: string;
  notiData: (INotification & { time: string })[];
}

const NotiCardGroup = ({ sendDate, notiData }: INotiCardGroupProps) => {
  return (
    <NotiCardGroupWrap>
      <strong>{sendDate}</strong>
      <div>
        {notiData.map((noti, index) => {
          return (
            <NotiCard
              key={noti.id}
              time={noti.time}
              scheduleType={noti.scheduleType}
              content={noti.content}
              notificationId={noti.id}
              isRead={noti.isRead}
            />
          );
        })}
      </div>
    </NotiCardGroupWrap>
  );
};

const NotiCardGroupWrap = styled.div`
  width: 340px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  margin: 0 auto;
  & > div {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  & > strong {
    color: ${({ theme }) => theme.colors.black80};
    font-weight: ${({ theme }) => theme.typo.semibold};
    font-size: 16px;
  }
`;

export default NotiCardGroup;
