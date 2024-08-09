import React from 'react';
import styled from 'styled-components';

interface DogGenderSelectorProps {
  onValueChange: (value: string) => void;
  value?: string;
}

const GenderSelect = ({ onValueChange, value }: DogGenderSelectorProps) => {
  const genderOptions = ['MALE', 'FEMALE'];

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    onValueChange(selectedValue);
  };

  return (
    <Wrapper>
      <Title>
        <p id='gender-label'>성별</p>
      </Title>
      <GenderWrapper>
        {genderOptions.map((gender) => (
          <Label key={gender} aria-labelledby='gender-label'>
            <Input
              type='radio'
              name='gender'
              value={gender}
              checked={value === gender}
              onChange={handleGenderChange}
              aria-checked={value === gender}
              aria-labelledby={`label-${gender}`}
            />
            <GenderButton>{gender === 'FEMALE' ? '여아' : '남아'}</GenderButton>
          </Label>
        ))}
      </GenderWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 340px;
  height: 74px;
  margin: 0 auto;
`;

const Title = styled.div`
  display: flex;
  margin-bottom: 14px;

  & > p {
    font-size: 14px;
  }
`;

const GenderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0 5px;
`;

const Input = styled.input`
  display: none;

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.main};
    color: white;
  }
`;
const GenderButton = styled.span`
  width: 160px;
  height: 38px;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.main};
  border-radius: 10px;
  background-color: white;
  color: ${({ theme }) => theme.colors.black90};
  transition: background-color 0.3s ease;
`;

export default GenderSelect;
