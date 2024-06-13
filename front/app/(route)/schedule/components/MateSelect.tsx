import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import MateProfile from '@/app/components/profile/MateProfile';
import { IMate } from '@/app/_types/user/Mate';

interface IMateSelectProps {
  onValueChange: (value: IMate[]) => void;
  mates: IMate[] | [];
  initialSelectedMates: IMate[] | [];
}

const MateSelect = ({ onValueChange, mates, initialSelectedMates }: IMateSelectProps) => {
  const [selectedMateId, setSelectedMateId] = useState<number[]>([]);

  useEffect(() => {
    if (initialSelectedMates && initialSelectedMates.length > 0) {
      const initialSelectedMateIds = initialSelectedMates.map((mate) => mate.userId);
      setSelectedMateId(initialSelectedMateIds);
      onValueChange(initialSelectedMates);
    }
  }, [initialSelectedMates]);

  console.log('initialSelectedMates:', initialSelectedMates, 'selectedMates:', selectedMateId); // 디버깅용

  const handleMateClick = (userId: number) => {
    const isSelected = selectedMateId.includes(userId);
    const newSelectedMates = isSelected ? selectedMateId.filter((mateId) => mateId !== userId) : [...selectedMateId, userId];

    setSelectedMateId(newSelectedMates);
    const selectedMateObjects = newSelectedMates.map((mateId) => mates.find((mate) => mate.userId === mateId)).filter((mate) => mate !== undefined) as IMate[];

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
      <MateProfileWrapper>{mates?.map((mate) => <MateProfile key={mate.userId} mate={mate} isClicked={selectedMateId.includes(mate.userId)} onClick={() => handleMateClick(mate.userId)} size='40' />)}</MateProfileWrapper>
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
