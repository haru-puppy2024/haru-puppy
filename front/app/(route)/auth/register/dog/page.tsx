'use client';

import { IRegisterData } from '@/app/_types';
import { usePostRegisterAPI } from '@/app/_utils/apis/user/usePostRegisterAPI';
import Button from '@/app/components/button/Button';
import Input from '@/app/components/input/Input';
import ContainerLayout from '@/app/components/layout/layout';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import DateSelect, { DateSelectLabel } from '@/app/components/profile/DateSelect';
import GenderSelect from '@/app/components/profile/GenderSelect';
import ProfileImg from '@/app/components/profile/ProfileImg';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';

const NewDogSchema = v.object({
  imgUrl: v.string(),
  name: v.pipe(v.string(), v.minLength(1, '강아지 이름을 입력해주세요.')),
  gender: v.pipe(v.string(), v.minLength(1, '성별을 선택해주세요.')),
  birthday: v.string(),
  weight: v.pipe(
    v.number(),
    v.minValue(0.1, '올바른 체중을 입력해주세요.'),
    v.transform((value) => {
      const roundedValue = Number(value.toFixed(1));
      if (roundedValue !== value) {
        throw new Error('체중은 소수점 첫째자리까지만 입력 가능합니다.');
      }
      return roundedValue;
    }),
  ),
});

const DogRegisterPage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { mutate: registerAPI } = usePostRegisterAPI();
  const [userRequest, setUserRequest] = useState<IRegisterData['userRequest'] | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<IRegisterData['dogRequest']>({
    resolver: valibotResolver(NewDogSchema),
    defaultValues: {
      name: '',
      gender: '',
      birthday: dayjs().format('YYYY-MM-DD'),
      weight: 0,
      imgUrl: '/svgs/dog_profile.svg',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedUserRequest = sessionStorage.getItem('userRequestData');
      if (storedUserRequest) {
        setUserRequest(JSON.parse(storedUserRequest));
      } else {
        router.push('/auth/register/user');
      }
    }
  }, [isClient, router]);

  const handleFormChange = (name: keyof IRegisterData['dogRequest'], value: any) => {
    if (name === 'birthday' && value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }
    if (name === 'weight') {
      value = Number(Number(value).toFixed(1));
    }
    setValue(name, value);
  };

  const onSubmit = (data: IRegisterData['dogRequest']) => {
    if (userRequest) {
      const requestData: IRegisterData = {
        userRequest,
        dogRequest: data,
        homeName: `${data.name}네 집`,
      };
      console.log('Request data to be sent:', requestData);
      registerAPI(requestData);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <ContainerLayout>
      <TopNavigation />
      <DogRegisterFormWrap onSubmit={handleSubmit(onSubmit)}>
        <ProfileImg
          onValueChange={(value) => handleFormChange('imgUrl', value)}
          imgUrl={watch('imgUrl')}
        />
        <Input
          {...register('name')}
          label='강아지 이름'
          error={errors.name?.message}
          placeholder='이름을 입력하세요'
        />
        <GenderSelect
          onValueChange={(value) => handleFormChange('gender', value)}
          value={watch('gender')}
        />
        <DateSelect
          onValueChange={(value) => handleFormChange('birthday', value)}
          label={DateSelectLabel.Birthday}
        />
        <Input
          {...register('weight', {
            valueAsNumber: true,
            onChange: (e) => handleFormChange('weight', e.target.value),
          })}
          label='체중'
          error={errors.weight?.message}
          placeholder='체중을 입력하세요'
          type='number'
          step='0.1'
        />
        <ButtonWrapper>
          <Button disabled={!isValid}>가입 완료하기</Button>
        </ButtonWrapper>
      </DogRegisterFormWrap>
    </ContainerLayout>
  );
};

const ButtonWrapper = styled.div`
  margin-top: 40px;
`;

const DogRegisterFormWrap = styled.form`
  display: grid;
  grid-template-rows: repeat(4, minmax(20px, 1fr));
  grid-gap: 30px;
  justify-content: center;
  align-items: center;
  margin: 7.5rem 0;
  & > div:first-of-type {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
export default DogRegisterPage;
