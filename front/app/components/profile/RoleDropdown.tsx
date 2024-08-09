import React, { useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { userRoleOptions } from '@/app/constants/userRoleOptions';
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectPopover,
  SelectProvider,
  useSelectStore,
} from '@ariakit/react';

interface IRoleDropdownProps {
  onValueChange: (value: string) => void;
  value?: string;
}

const RoleDropdown = ({ onValueChange, value }: IRoleDropdownProps) => {
  const defaultValue = value || 'DAD';
  const selectStore = useSelectStore({
    defaultValue,
    setValue: (newValue) => {
      onValueChange(newValue);
    },
  });

  const selectedOption = userRoleOptions.find(
    (option) => option.value === selectStore.getState().value,
  );

  useEffect(() => {
    if (!value) {
      onValueChange(defaultValue);
    }
  }, []);

  useEffect(() => {
    if (value && value !== selectStore.getState().value) {
      selectStore.setValue(value);
    }
  }, [value, selectStore]);

  return (
    <RoleSelectWrap>
      <SelectProvider store={selectStore}>
        <StyledLabel>나는 우리 강아지의...</StyledLabel>
        <StyledSelect>
          {selectedOption ? selectedOption.label : '선택하세요'}
          <Image src='/svgs/cover-box.svg' alt='드롭다운 열기' width={20} height={20} />
        </StyledSelect>
        <StyledSelectPopover store={selectStore}>
          {userRoleOptions.map((option) => (
            <StyledSelectItem key={option.value} value={option.value}>
              {option.label}
            </StyledSelectItem>
          ))}
        </StyledSelectPopover>
      </SelectProvider>
    </RoleSelectWrap>
  );
};

const RoleSelectWrap = styled.div`
  position: relative;
  width: 340px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
`;

const StyledLabel = styled(SelectLabel)`
  font-size: 16px;
  font-weight: ${({ theme }) => theme.typo.regular};
  margin-bottom: 10px;
`;

const StyledSelect = styled(Select)`
  width: 340px;
  position: relative;
  line-height: 48px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  padding: 0 15px;

  & > img {
    position: absolute;
    top: 14px;
    right: 10px;
  }
`;

const StyledSelectPopover = styled(SelectPopover)`
  position: absolute;
  left: 95px;
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.black50};
  border-radius: 10px;
  position: absolute;
  margin: 10px 0;
  z-index: 1000;
`;

const StyledSelectItem = styled(SelectItem)`
  position: relative;
  cursor: pointer;
  text-align: center;
  width: 100%;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.black90};
  padding: 15px 0;

  &:hover {
    background-color: #f7fbff;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.colors.black60};
  }

  &:first-child:hover {
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
  }

  &:last-child:hover {
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }
`;

export default RoleDropdown;
