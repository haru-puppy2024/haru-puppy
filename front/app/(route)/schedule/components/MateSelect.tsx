import React, { useState } from 'react';
import styled from 'styled-components';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import MateProfile from '@/app/components/profile/MateProfile';
import { IMate } from '@/app/_types/user/Mate';

interface IMateSelectProps {
  onValueChange: (value: IMate[]) => void;
  mates: IMate[] | null;
}

const MateSelect = ({ onValueChange, mates }: IMateSelectProps) => {
  const [selectedMates, setSelectedMates] = useState<number[]>([]);

  const handleMateClick = (userId: number) => {
    const isSelected = selectedMates.includes(userId);
    const newSelectedMates = isSelected ? selectedMates.filter((mateId) => mateId !== userId) : [...selectedMates, userId];

    setSelectedMates(newSelectedMates);
    const selectedMateObjects = newSelectedMates.map((mateId) => ({ userId: mateId }));

    onValueChange(selectedMateObjects);
  };

  return (
    <MateSelectWrap>
      <label htmlFor='schedule-type'>
        <span>
          <PeopleOutlineRoundedIcon />
        </span>
        담당 선택
      </label>
      <MateProfileWrapper>{mates?.map((mate) => <MateProfile key={mate.userId} mate={mate} isClicked={selectedMates.includes(mate.userId)} onClick={() => handleMateClick(mate.userId)} size='40' />)}</MateProfileWrapper>
    </MateSelectWrap>
  );
};

const MateProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
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
