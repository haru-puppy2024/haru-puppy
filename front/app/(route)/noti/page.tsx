'use client';

import styled from 'styled-components';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import NotiCardGroup from './components/NotiCardGroup';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import React from 'react';
import { INotification, ITransformedNotiData } from '@/app/_types/noti/Noti';

const NotiPage = () => {
  const {
    data: allNotifications,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useQuery('getAllNotifications', () => {}, {
    staleTime: Infinity,
  });
  const [formattedNotiData, setFormattedNotiData] = useState<ITransformedNotiData[]>([]);

  useEffect(() => {
    if (allNotifications) {
      const transformedData = (allNotifications as INotification[]).reduce(
        (acc: ITransformedNotiData[], noti: INotification) => {
          const sendDateObj = new Date(noti.sendDate);
          const date = sendDateObj.toISOString().split('T')[0];
          const hours = sendDateObj.getHours().toString().padStart(2, '0');
          const minutes = sendDateObj.getMinutes().toString().padStart(2, '0');
          const time = `${hours}:${minutes}`;

          const existingDateGroup = acc.find((item) => item.sendDate === date);

          if (existingDateGroup) {
            existingDateGroup.notifications.push({ ...noti, time });
          } else {
            acc.push({
              sendDate: date,
              notifications: [{ ...noti, time }],
            });
          }

          return acc;
        },
        [],
      );
      transformedData
        .sort((a, b) => {
          if (a.sendDate > b.sendDate) return -1;
          if (a.sendDate < b.sendDate) return 1;
          return 0;
        })
        .forEach((item) => {
          item.notifications.sort((a, b) => {
            if (a.time > b.time) return -1;
            if (a.time < b.time) return 1;
            return 0;
          });
        });

      setFormattedNotiData(transformedData);
    }
  }, [allNotifications]);

  useEffect(() => {
    if (isErrorAll) {
      console.error('전체 알림 로딩 중 에러 발생');
    }
  }, [isErrorAll]);

  return (
    <>
      <TopNavigation />
      <Container>
        <NotiPageWrap>
          <main>
            {formattedNotiData && formattedNotiData.length > 0 ? (
              formattedNotiData.map((notiGroup, index) => (
                <React.Fragment key={notiGroup.sendDate ?? index}>
                  <NotiCardGroup
                    sendDate={notiGroup.sendDate}
                    notiData={notiGroup.notifications}
                  />
                  {index < formattedNotiData.length - 1 && <Divider />}
                </React.Fragment>
              ))
            ) : (
              <p>알림이 없습니다.</p>
            )}
          </main>
        </NotiPageWrap>
        <BottomNavigation />
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  min-height: 100vh;
`;

const NotiPageWrap = styled.div`
  width: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};

  & > main {
    width: 100%;
    margin-top: 80px;
    flex-grow: 1;
    margin-bottom: 6.25rem;
  }
`;

const Divider = styled.hr`
  width: 2px;
  height: 30px;
  border: 0;
  background-color: ${({ theme }) => theme.colors.black60};
  margin: 20px 0;
  margin-left: 56px;
`;

export default NotiPage;
