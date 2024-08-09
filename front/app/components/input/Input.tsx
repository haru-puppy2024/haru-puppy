import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    const inputId = props.id || props.name;
    const errorId = error ? `${inputId}-error` : undefined;
    return (
      <InputWrap>
        <label htmlFor={props.id || props.name}>{label}</label>
        <input
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...props}
          id={inputId}
        />
        {error && <ErrorMessage id={errorId}>{error}</ErrorMessage>}
      </InputWrap>
    );
  },
);

const InputWrap = styled.div<{ showErr?: boolean }>`
  width: 340px;
  height: 74px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  & label {
    font-size: 14;
    font-weight: 400;
    margin-bottom: 14px;
    & span {
      margin-left: 8px;
      color: ${({ theme }) => theme.colors.alert};
    }
  }

  & input {
    position: relative;
    width: 340px;
    padding: 15px 0;
    border: 1px solid
      ${({ showErr, theme }) => (showErr ? theme.colors.alert : theme.colors.black50)};
    border-radius: 10px;
    color: #000000;
    text-align: center;
    font-weight: 400;
    font-size: 14px;
    &:focus {
      border-color: ${({ theme }) => theme.colors.black80};
    }
  }
`;

const ErrorMessage = styled.span`
  margin-top: 8px;
  margin-left: 2px;
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.alert};
`;

export default Input;
