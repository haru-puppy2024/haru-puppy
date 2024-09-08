'use client';

import MateList from '@/app/(route)/home/components/MateList';
import ReportCard from '@/app/(route)/home/components/ReportCard';
import UserProfile from '@/app/(route)/home/components/UserProfile';
import WalkRank from '@/app/(route)/home/components/WalkRank';
import { mateState } from '@/app/_states/mateState';
import { dogState } from '@/app/_states/dogState';
import { IDogDetail, IHomeData, IRanking, IReport } from '@/app/_types/user/Mate';
import instance from '@/app/_utils/apis/interceptors';
import ContainerLayout from '@/app/components/layout/layout';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import Loading from '@/app/components/loading/loading';

const fetchHomeData = async (): Promise<IHomeData> => {
  try {
    const response = await instance.get('/api/home');
    return response.data.data;
  } catch (error) {
    throw new Error('Home api 페칭 에러');
  }
};

const HomePage = () => {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery<IHomeData>('homeData', fetchHomeData);
  const [mates, setMates] = useRecoilState(mateState);
  const [dog, setDog] = useRecoilState(dogState);
  const [cookies] = useCookies(['access_token']);

  useEffect(() => {
    const accessToken = cookies['access_token'];
    if (!accessToken) {
      router.push('/auth/login');
    }
  }, [cookies, router]);

  useEffect(() => {
    if (data && data.mateDto) {
      setMates(data.mateDto);
      setDog(data.dogDetailResponse);
    }
  }, [data, setMates, setDog]);

  if (isLoading) {
    return <Loading />; // 로딩 상태 표시
  }

  if (isError) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        Error loading data
      </div>
    ); // 에러 상태 표시
  }

  const user: IDogDetail = data?.dogDetailResponse || {
    dogId: 0,
    name: '',
    weight: 0,
    gender: 'FEMALE',
    birthday: '',
    imgUrl: 'src://',
  };

  const reports: IReport = data?.reportDto || {
    todayPooCount: 0,
    lastWalkCount: 0,
    lastWash: '',
    lastHospitalDate: '',
  };
  const ranking: IRanking[] = data?.rankingDto || [
    {
      userId: 0,
      imgUrl: 'src://',
      nickName: '',
      userRole: '',
      count: 0,
    },
  ];

  return (
    <main>
      <TopNavigation />
      <ContainerLayout>
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
  overflow-x: hidden;
  display: flex;
  padding: 120px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default HomePage;
