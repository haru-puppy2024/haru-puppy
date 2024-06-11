'use client';
import styled from 'styled-components';
import ContainerLayout from '@/app/components/layout/layout';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import UserProfile from '@/app/(route)/home/components/UserProfile';
import MateList from '@/app/(route)/home/components/MateList';
import ReportCard from '@/app/(route)/home/components/ReportCard';
import WalkRank from '@/app/(route)/home/components/WalkRank';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import instance from '@/app/_utils/apis/interceptors';
import { IDogDetail, IHomeData, IMate, IRanking, IReport } from '@/app/_types/user/Mate';


const dummyReports = {
  today_poo_cnt: 2,
  last_week_walk_cnt: 7,
  last_wash_date: '2023-12-13 00:00:00',
  last_hospital_date: '2023-12-13 00:00:00',
};

const dummyRanking = [
  {
    user_id: 1,
    user_img: '',
    nickname: 'User1',
    rank: 4,
  },
  {
    user_id: 2,
    user_img: '',
    nickname: 'User2',
    rank: 2,
  },
  {
    user_id: 3,
    user_img: '',
    nickname: 'User3',
    rank: 3,
  },
];

const fetchHomeData = async (): Promise<IHomeData> => {
  try {
    const response = await instance.get('/api/home');
    return response.data.data;
  } catch (error) {
    throw new Error('Home api 페칭 에러');
  }
};

const Page = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<IHomeData>('homeData', fetchHomeData);
  console.log('home data:', data)

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      router.push('/auth/login');
    }
  }, []);

  const mates: IMate[] = data?.mateDto || [];
  const user: IDogDetail = data?.dogDetailResponse || {
    dogId: 0,
    name: '',
    weight: 0,
    gender: 'FEMALE',
    birthday: '',
    imgUrl: 'src://',
  };

  console.log('mates 데이터', mates);

  const reports: IReport = data?.reportDto || {
    todayPooCount: 0,
    lastWalkCount: 0,
    lastWash: '',
    lastHospitalDate: '',
  };
  const ranking: IRanking[] = data?.rankingDto || [{
    userId: 0,
    imgUrl: 'src://',
    nickName: '',
    userRole: '',
    count: 0,
  }];

  return (
    <main>
      <ContainerLayout>
        <TopNavigation />
        <Wrapper>
          <UserProfile user={user} />
          <MateList mates={mates} />
          <ReportCard reports={reports} userName={user.name} />
          <WalkRank ranking={ranking} />
        </Wrapper>
        <BottomNavigation />
      </ContainerLayout>
    </main>
  );
};

const Wrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  padding: 100px 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin-top: 300px;
`;

export default Page;
