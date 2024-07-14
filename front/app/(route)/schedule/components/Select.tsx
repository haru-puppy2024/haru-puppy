import Image from 'next/image';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface ISelectProps {
  selectId: string;
  label: string;
  icon: ReactNode;
  children: ReactNode;
  selectedValue: string;
  onValueChange: (value: string) => void;
}

const Select = ({ selectId, label, icon, children, selectedValue, onValueChange }: ISelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const imageSrc = selectedValue && selectedValue !== '없음' ? '/svgs/close.svg' : '/svgs/cover-box.svg';

  const handleRemoveValue = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.stopPropagation();
    onValueChange('없음');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (event.target instanceof Node) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [selectedValue]);

  return (
    <SelectWrap ref={dropdownRef} data-selected-value={selectedValue}>
      <label htmlFor={selectId}>
        <span>{icon}</span>
        {label}
      </label>
      <SelectDiv onClick={() => setIsOpen(!isOpen)} data-selected-value={selectedValue}>
        {selectedValue || '없음'}
        <Image src={imageSrc} alt='드롭다운 열기' width={20} height={20} onClick={handleRemoveValue} />
      </SelectDiv>
      {isOpen && <DropdownWrap>{children}</DropdownWrap>}
    </SelectWrap>
  );
};

const SelectWrap = styled.div`
  position: relative;
  width: 300px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > label {
    font-size: 14px;
    font-weight: ${({ theme }) => theme.typo.regular};
    & > span {
      margin-right: 10px;
      vertical-align: middle;
    }
  }
`;

const SelectDiv = styled.div`
  color: ${({ theme }) => theme.colors.black70};

  &[data-selected-value='없음'] {
    color: ${({ theme }) => theme.colors.black70};
  }

  &[data-selected-value]:not([data-selected-value='없음']):not([data-selected-value='']) {
    color: ${({ theme }) => theme.colors.main};
  }

  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typo.regular};
  color: ${({ theme }) => theme.colors.black70};

  cursor: pointer;
  border: none;

  &:focus {
    border: 'none';
  }

  & > img {
    vertical-align: middle;
    margin-left: 10px;
  }
`;

const DropdownWrap = styled.div`
  position: absolute;
  bottom: 100%;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid ${({ theme }) => theme.colors.black50};
  border-radius: 10px;
`;

export default Select;
