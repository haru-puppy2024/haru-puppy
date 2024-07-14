import { IMate } from '@/app/_types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';
import MateProfile from '../../../components/profile/MateProfile';

interface IMateListProps {
  mates: IMate[];
}

const MateList = ({ mates }: IMateListProps) => {
  const [isEdit, setIsedit] = useState(false);

  const router = useRouter();
  console.log('mates data', mates);

  const onEditClick = () => {
    setIsedit(!isEdit);
  };
  //   console.log('isEdit', isEdit);

  return (
    <Wrapper>
      <UpperWrapper>
        <p>메이트</p>
      </UpperWrapper>

      <ProfileWrapper>
        {mates?.map((mate) => <MateProfile key={mate.userId} mate={mate} size='60' />)}
        <PlusWrapper onClick={() => router.push('/invite')}>{mates?.length < 4 && <Image src={'/svgs/mate_plus.svg'} alt='mate-edit-btn' width={24} height={24} />}</PlusWrapper>
      </ProfileWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 340px;
`;

const UpperWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  > p {
    font-size: 20px;
  }
  > div {
    cursor: pointer;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-left: 10px;
`;

const PlusWrapper = styled.div`
  margin-left: auto;
  margin-right: 13px;
  cursor: pointer;
`;

export default MateList;
