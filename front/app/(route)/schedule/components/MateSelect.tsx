'use client';

import { IMate } from '@/app/_types/user/Mate';
import MateProfile from '@/app/components/profile/MateProfile';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface IMateSelectProps {
  onValueChange: (value: IMate[]) => void;
  mates: IMate[] | [];
  initialSelectedMates: { userId: number }[] | [];
}

const MateSelect = ({ onValueChange, mates, initialSelectedMates }: IMateSelectProps) => {
  const [selectedMates, setSelectedMates] = useState<{ userId: number }[]>([]);

  useEffect(() => {
    if (initialSelectedMates && initialSelectedMates.length > 0) {
      setSelectedMates(initialSelectedMates);
      onValueChange(initialSelectedMates);
    }
  }, [initialSelectedMates]);

  const handleMateClick = (userId: number) => {
    const isSelected = selectedMates.some((mate) => mate.userId === userId);
    const newSelectedMates = isSelected ? selectedMates.filter((mate) => mate.userId !== userId) : [...selectedMates, { userId }];

    setSelectedMates(newSelectedMates);
    onValueChange(newSelectedMates);
  };

  return (
    <MateSelectWrap>
      <label htmlFor='schedule-type'>
        <span>
          <PeopleOutlineRoundedIcon />
        </span>
        담당 선택
      </label>
      <MateProfileWrapper>
        {mates?.map((mate) => <MateProfile key={mate.userId} mate={mate} isClicked={selectedMates.some((selectedMate) => selectedMate.userId === mate.userId)} onClick={() => handleMateClick(mate.userId)} size='40' />)}
      </MateProfileWrapper>
    </MateSelectWrap>
  );
};

const MateProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const MateSelectWrap = styled.div`
  position: relative;
  width: 300px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  & > label {
    font-size: 14px;
    font-weight: ${({ theme }) => theme.typo.regular};
    & > span {
      margin-right: 10px;
      vertical-align: middle;
    }
  }
`;

export default MateSelect;
