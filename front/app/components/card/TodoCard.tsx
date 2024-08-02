'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IMate, IScheduleItem } from '@/app/_types';
import { getUserRoleSvgPath } from '@/app/constants/userRoleOptions';
import { mateState } from '@/app/_states/mateState';
import { useRecoilValue, useRecoilState } from 'recoil';
import { scheduleTypeOptions } from '@/app/constants/scheduleTypeOptions';
import { useGetTodoScheduleAPI, usePatchTodoScheduleAPI } from '@/app/_utils/apis';

const getDefaultImgUrl = (userId: number, mates: IMate[]): string => {
  const mate = mates.find((mate) => mate.userId === userId);
  const role = mate ? mate.userRole : undefined;
  return role ? getUserRoleSvgPath(role) : '';
};

const getScheduleTypeDetails = (scheduleType: string) => {
  const type = scheduleTypeOptions.find((option) => option.value === scheduleType);
  return type ? { label: type.label, icon: type.icon } : { label: scheduleType, icon: null };
};

interface ITodoCardProps {
  year: number;
  month: number;
  day?: number;
  todoList: IScheduleItem[];
}

const TodoCard = ({ todoList, year, month, day }: ITodoCardProps) => {
  const [todos, setTodos] = useState<IScheduleItem[]>(todoList);
  const { data: fetchedTodos, refetch } = useGetTodoScheduleAPI(year, month, day);
  const mates = useRecoilValue(mateState);
  const mutation = usePatchTodoScheduleAPI();

  useEffect(() => {
    setTodos(todoList);
  }, [todoList, setTodos]);

  useEffect(() => {
    if (fetchedTodos) {
      setTodos(fetchedTodos);
    }
  }, [fetchedTodos, setTodos]);

  useEffect(() => {
    if (fetchedTodos) {
      setTodos(fetchedTodos);
    }
  }, [fetchedTodos, setTodos]);

  const handleCheckboxChange = (scheduleId: number, currentIsActive: boolean) => {
    const newIsActive = !currentIsActive;
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.scheduleId === scheduleId ? { ...todo, isActive: newIsActive } : todo)));
    mutation.mutate(
      { scheduleId, newIsActive },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  const activeTodos = todos.filter((todo) => todo.isActive);
  const inactiveTodos = todos.filter((todo) => !todo.isActive);

  console.log('이게 todos', todos);

  const renderTodoList = (todos: IScheduleItem[], title: string) => (
    <TodoListWrapper>
      <CardTitle>{title}</CardTitle>
      {todos.map((todo, index) => {
        const { label, icon } = getScheduleTypeDetails(todo.scheduleType);
        return (
          <TodoItem key={index}>
            <Checkbox checked={!!todo.isActive} onChange={() => handleCheckboxChange(todo.scheduleId, todo.isActive)} />
            <TodoIcon>{icon}</TodoIcon>
            <TodoText data-active={todo.isActive}>{label}</TodoText>
            <MateImgWrapper>
              {todo.mates.map((mateId, mateIndex) => (
                <MateImg alt='메이트 이미지' key={mateIndex} index={mateIndex} src={getDefaultImgUrl(mateId, mates)} />
              ))}
            </MateImgWrapper>
          </TodoItem>
        );
      })}
    </TodoListWrapper>
  );

  return (
    <Wrapper>
      {activeTodos.length > 0 && renderTodoList(activeTodos, '완료')}
      {inactiveTodos.length > 0 && renderTodoList(inactiveTodos, '오늘')}
      {activeTodos.length === 0 && inactiveTodos.length === 0 && <CenteredMessage>일정이 없습니다.</CenteredMessage>}
    </Wrapper>
  );
};

const CenteredMessage = styled.p`
  display: flex;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.black80};
  margin-top: 50%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TodoListWrapper = styled.div`
  width: 349px;
  background-color: #ffffff;
  margin: 20px;
  border-radius: 15px;
  padding-top: 3px;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.5);
  min-height: 70px;
`;

const TodoItem = styled.div`
  display: flex;
  width: 340px;
  height: 50px;
  border-radius: 15px;
  align-items: center;
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const CardTitle = styled.div`
  color: ${({ theme }) => theme.colors.black80};
  font-size: 16px;
  margin-top: 15px;
  margin-left: 5px;
  margin-bottom: 10px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin: 10px;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  border: 1.5px solid gainsboro;
  appearance: none;
  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #06acf4;
  }
`;
const TodoIcon = styled.div`
  margin-right: 8px;
  margin-left: 4px;
  display: inline-flex;
`;

const TodoText = styled.p`
  font-weight: ${({ theme }) => theme.typo.regular};
  flex: 1;
  color: ${({ theme }) => theme.colors.black90};
  &[data-active='true'] {
    text-decoration: line-through;
  }
  &[data-active='false'] {
    text-decoration: none;
  }
`;

const MateImgWrapper = styled.div`
  width: 50px;
  height: 30px;
  display: flex;
  right: 0px;
  position: relative;
`;

const MateImg = styled.img<{ index: number }>`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: absolute;
  left: ${(props) => props.index * 18}px;
`;

export default TodoCard;
