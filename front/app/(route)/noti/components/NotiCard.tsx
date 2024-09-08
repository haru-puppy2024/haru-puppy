'use client';
import styled from 'styled-components';
import { useGetSingleNotification } from '@/app/_utils/apis/noti/useGetNotificationAPI';
import { useCallback, useMemo } from 'react';
import { scheduleTypeOptions } from '@/app/constants/scheduleTypeOptions';

interface INotiCardProps {
  notificationId: number;
  scheduleType: string;
  content: string;
  time: string;
  isRead: boolean | null;
}

const NotiCard = ({
  notificationId,
  scheduleType,
  time,
  content,
  isRead,
}: INotiCardProps) => {
  const mutation = useGetSingleNotification();

  const handleNotiCardClick = useCallback(() => {
    if (isRead === false) {
      mutation.mutate(notificationId);
    }
  }, [mutation, notificationId, isRead]);

  const { icon, label } = useMemo(() => {
    const matchingOption = scheduleTypeOptions.find(
      (option) => option.value === scheduleType,
    );
    return {
      icon: matchingOption?.icon || null,
      label: matchingOption?.label || '',
    };
  }, [scheduleType]);

  return (
    <NotiCardWrap onClick={handleNotiCardClick} data-isread={isRead}>
      <div>{icon}</div>
      <NotiContent>
        <p>{label}</p>
        <p>{content}</p>
      </NotiContent>
      <span>{time}</span>
      {isRead !== null && (
        <StatusChipWrapper>
          <UnreadChip>안 읽음</UnreadChip>
          <ReadChip className='read'>읽음</ReadChip>
        </StatusChipWrapper>
      )}
    </NotiCardWrap>
  );
};

const NotiCardWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 76px;
  border-radius: 10px;
  background-color: #ffffff;
  padding-left: 22px;

  &[data-isread='false'] {
    cursor: pointer;
  }

  &[data-isread='false']:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  transition: box-shadow 0.3s ease;

  & > span {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: ${({ theme }) => theme.colors.black80};
    font-weight: ${({ theme }) => theme.typo.regular};
    font-size: 12px;
  }
`;

const NotiContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  gap: 4px;
  max-width: 200px;

  & > p:nth-of-type(1) {
    color: ${({ theme }) => theme.colors.black90};
    font-weight: ${({ theme }) => theme.typo.medium};
    font-size: 16px;
  }

  & > p:nth-of-type(2) {
    font-size: 12px;
    font-weight: ${({ theme }) => theme.typo.medium};
    color: ${({ theme }) => theme.colors.black80};
    margin-bottom: 4px;
  }
`;

const BaseChip = styled.div`
  padding: 4px 6px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: ${({ theme }) => theme.typo.medium};
`;

const UnreadChip = styled(BaseChip)`
  color: #ffffff;
  background-color: ${({ theme }) => theme.colors.main};
`;

const ReadChip = styled(BaseChip)`
  color: ${({ theme }) => theme.colors.black80};
  background-color: ${({ theme }) => theme.colors.background};
  display: none;
`;

const StatusChipWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;

  ${NotiCardWrap}[data-isread="false"]:hover & ${UnreadChip} {
    display: none;
  }

  ${NotiCardWrap}[data-isread="false"]:hover & ${ReadChip} {
    display: block;
  }

  ${NotiCardWrap}[data-isread="true"] & ${UnreadChip} {
    display: none;
  }

  ${NotiCardWrap}[data-isread="true"] & ${ReadChip} {
    display: block;
  }
`;

export default NotiCard;
