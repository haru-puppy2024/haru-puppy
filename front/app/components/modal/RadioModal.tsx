import styled from '@emotion/styled';
import React from 'react';

interface RadioModalProps {
  title: string;
  name: string;
  optionList: {
    key: string;
    label: string;
  }[];
  onSubmit: (key: string) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export const RadioModal = ({ title, name, optionList, onSubmit, isOpen, setOpen }: RadioModalProps) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);

  return (
    <>
      <RadioModalWrap data-open={isOpen}>
        <fieldset>
          <legend>{title}</legend>

          {optionList.map((option) => (
            <label key={option.key}>
              <img src='/svgs/RadioButton_uncheck.svg' alt='' className='uncheck' />
              <img src='/svgs/RadioButton_check.svg' alt='' className='check' />
              <input
                type='radio'
                name={name}
                checked={selectedOption === option.key}
                onChange={() => {
                  setSelectedOption(option.key);
                }}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
        <button
          onClick={() => {
            if (selectedOption) {
              onSubmit(selectedOption);
              setOpen(false);
            }
          }}
          disabled={selectedOption === null}
        >
          확인
        </button>
      </RadioModalWrap>
    </>
  );
};

const RadioModalWrap = styled.div`
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  font-size: 14px;
  padding: 18.5px 19.5px 47px;
  box-shadow:
    0 10px 15px -3px rgb(0 0 0 / 0.1),
    0 4px 6px -4px rgb(0 0 0 / 0.1);

  & fieldset {
    min-width: 12.6875rem;
  }

  & legend {
    margin-bottom: 25.5px;
    font-weight: 500;
  }

  & label {
    display: flex;
    margin-bottom: 22.5px;
    font-weight: 400;
    line-height: 20px;
  }

  label:has(input:checked) .uncheck {
    display: none;
  }

  label:has(input:not(:checked)) .check {
    display: none;
  }

  & img {
    margin-right: 17.83px;
  }

  & input {
    //tailwindcss sr-only
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  & button {
    border-radius: 6px;
    color: white;
    font-weight: 400;
    padding: 4px 10px;
    background-color: #06acf4;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    bottom: 10px;
  }
`;
