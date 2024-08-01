import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IMate, IScheduleItem } from '@/app/_types';
import instance from '@/app/_utils/apis/interceptors';
import { getUserRoleSvgPath } from '@/app/constants/userRoleOptions';
import { mateState } from '@/app/_states/mateState';
import { useRecoilValue } from 'recoil';
import { scheduleTypeOptions } from '@/app/constants/scheduleTypeOptions';

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
  todoList: IScheduleItem[];
}

const TodoCard = ({ todoList }: ITodoCardProps) => {
  const [todos, setTodos] = useState<IScheduleItem[]>([]);
  const mates = useRecoilValue(mateState);

  useEffect(() => {
    setTodos(todoList);
  }, [todoList]);

  console.log('이게 todos', todos);

  const handleCheckboxChange = async (scheduleId: number, currentIsActive: boolean) => {
    const newIsActive = !currentIsActive;
    const updatedTodos = todos.map((todo) => (todo.scheduleId === scheduleId ? { ...todo, isActive: newIsActive } : todo));
    setTodos(updatedTodos);

    try {
      const response = await instance.patch(`/api/schedules/${scheduleId}/status?active=${newIsActive}`);
      console.log('상태 response', response);

      if (!response.data.success) {
        throw new Error('서버 응답 에러');
      }
    } catch (error) {
      console.error('스케줄 수정 에러', error);
      // 에러가 발생하면 상태를 되돌림
      const revertedTodos = todos.map((todo) => (todo.scheduleId === scheduleId ? { ...todo, isActive: currentIsActive } : todo));
      setTodos(revertedTodos);
    }
  };

  const activeTodos = todos.filter((todo) => todo.isActive);
  const inactiveTodos = todos.filter((todo) => !todo.isActive);

  return (
    <Wrapper>
      {activeTodos.length > 0 && (
        <TodoListWrapper>
          <CardTitle>완료</CardTitle>
          {activeTodos.map((todo, index) => {
            const { label, icon } = getScheduleTypeDetails(todo.scheduleType);
            return (
              <TodoItem key={index}>
                <Checkbox type='checkbox' checked onChange={() => handleCheckboxChange(todo.scheduleId, todo.isActive)} />
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
      )}

      {inactiveTodos.length > 0 && (
        <TodoListWrapper>
          <CardTitle>오늘</CardTitle>
          {inactiveTodos.map((todo, index) => {
            const { label, icon } = getScheduleTypeDetails(todo.scheduleType);
            return (
              <TodoItem key={index}>
                <Checkbox type='checkbox' checked={todo.isActive} onChange={() => handleCheckboxChange(todo.scheduleId, todo.isActive)} />
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
      )}

      <RegisteredMate></RegisteredMate>
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

const Checkbox = styled.input.attrs<{ checked?: boolean }>(({ checked }) => ({
  checked: checked || false,
}))`
  margin: 10px;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border: 1.5px solid gainsboro;
  border-radius: 50%;
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

const RegisteredMate = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.black60};
`;

export default TodoCard;
