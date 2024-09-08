import { IReport } from '@/app/_types/user/Mate';
import instance from '@/app/_utils/apis/interceptors';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface IReportCard {
  reports: IReport;
  userName: string;
}

const ReportCard = ({ reports, userName }: IReportCard) => {
  const [todayPooCount, setTodayPooCount] = useState(reports.todayPooCount);
  const [lastWalkCount, setLastWalkCount] = useState(reports.lastWalkCount);
  const [lastWash, setLastWash] = useState(reports.lastWash);
  const [lastHospitalDate, setLastHospitalDate] = useState(reports.lastHospitalDate);

  useEffect(() => {
    setTodayPooCount(reports.todayPooCount);
    setLastWalkCount(reports.lastWalkCount);
    setLastWash(reports.lastWash);
    setLastHospitalDate(reports.lastHospitalDate);
  }, [reports]);

  const reportsArray = [
    {
      title: '지난주 산책',
      count: lastWalkCount,
      unit: '회',
      icon: <Image src={'/svgs/paw.svg'} alt='산책 아이콘' width={25} height={25} />,
    },
    {
      title: '오늘의 배변활동',
      count: todayPooCount,
      unit: '회',
      icon: <Image src={'/svgs/poop.svg'} alt='배변활동 아이콘' width={30} height={30} />,
    },
    {
      title: '마지막 목욕',
      count: lastWash ? dayjs(lastWash).format('MM.DD') : '-',
      icon: (
        <Image
          src={'/svgs/dog_bath.svg'}
          alt='마지막 목욕 아이콘'
          width={30}
          height={30}
        />
      ),
    },
    {
      title: '마지막 검진',
      count: lastHospitalDate ? dayjs(lastHospitalDate).format('MM.DD') : '-',
      icon: (
        <Image
          src={'/svgs/dog_health_check.svg'}
          alt='마지막 검진 아이콘'
          width={30}
          height={30}
        />
      ),
    },
  ];

  const onMinusClick = async () => {
    try {
      const response = await instance.delete('/api/schedules/complete', {
        data: { scheduleType: 'POO' },
      });

      setTodayPooCount((prevCount) => Math.max(prevCount - 1, 0));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const onPlusClick = async () => {
    try {
      const response = await instance.post('/api/schedules/complete', {
        scheduleType: 'POO',
      });

      setTodayPooCount((prevCount) => prevCount + 1);
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <>
      <ReportCardWrapper>
        <Title>{userName}의 리포트</Title>

        {reportsArray.map((report, index) => (
          <Wrapper key={index}>
            <p>{report.title}</p>
            <Info>
              {report.title === '오늘의 배변활동' && (
                <StyledIconButtonMinus
                  src='/svgs/minus-svgrepo-com 1.svg'
                  alt='minus icon'
                  width={24}
                  height={24}
                  onClick={onMinusClick}
                />
              )}
              <IconImg>{report.icon}</IconImg>
              <Count
                data-is-date-type={
                  report.title === '마지막 목욕' || report.title === '마지막 검진'
                }
              >
                {report.count !== null && report.count !== 0 ? (
                  <>
                    {report.count}
                    <p>{report.unit}</p>
                  </>
                ) : (
                  <>
                    0<p>{report.unit}</p>
                  </>
                )}
              </Count>
              {report.title === '오늘의 배변활동' && (
                <StyledIconButtonPlus
                  src='/svgs/plus-circle-svgrepo-com 1.svg'
                  alt='plus icon'
                  width={24}
                  height={24}
                  onClick={onPlusClick}
                />
              )}
            </Info>
          </Wrapper>
        ))}
      </ReportCardWrapper>
    </>
  );
};

const IconImg = styled.div`
  position: absolute;
  left: 32px;
`;

const StyledIconButtonPlus = styled(Image)`
  cursor: pointer;
  position: absolute;
  right: 8px;
`;

const StyledIconButtonMinus = styled(Image)`
  cursor: pointer;
  position: absolute;
  left: 8px;
`;

const ReportCardWrapper = styled.div`
  min-width: 340px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const Title = styled.span`
  font-size: 20px;
  grid-column: span 2;
  text-align: start;
  margin-bottom: 10px;
`;

const Wrapper = styled.div`
  position: relative;
  width: 156px;
  height: 84px;
  margin: 0 auto;
  border: 2px solid ${({ theme }) => theme.colors.black60};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.black90};
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  svg {
    width: 40px;
    height: 40px;
    fill: purple;
  }
`;

const Count = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.black90};
  margin-left: 20px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 5px;

  &[data-is-date-type='true'] {
    margin-left: 42px;
  }

  p {
    display: inline-block;
    font-size: 14px;
    margin-left: 5px;
    padding-bottom: 5px;
  }
`;

export default ReportCard;
