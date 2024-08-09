'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { dogState } from '@/app/_states/dogState';
import { IDogProfile } from '@/app/_types/user/Dog';
import { useUpdateDogProfileAPI } from '@/app/_utils/apis/useDogProfileApi';
import dayjs from 'dayjs';
import ContainerLayout from '@/app/components/layout/layout';
import Button from '@/app/components/button/Button';
import Input from '@/app/components/input/Input';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import DateSelect, { DateSelectLabel } from '@/app/components/profile/DateSelect';
import GenderSelect from '@/app/components/profile/GenderSelect';
import ProfileImg from '@/app/components/profile/ProfileImg';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { overlay } from 'overlay-kit';
import Modal from '@/app/components/modal/modal';
import Loading from '@/app/components/loading/loading';

const DogProfileSchema = v.object({
  dogId: v.number(),
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

const DEFAULT_IMAGE = '/svgs/dog_profile.svg';

const DogProfilePage = () => {
  const [dogData, setDogData] = useRecoilState<any>(dogState);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<IDogProfile>({
    resolver: valibotResolver(DogProfileSchema),
    defaultValues: {
      dogId: 0,
      name: '',
      gender: '',
      birthday: dayjs().format('YYYY-MM-DD'),
      weight: 0,
      imgUrl: DEFAULT_IMAGE,
    },
    mode: 'onChange',
  });

  const formData = watch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && dogData) {
      setValue('dogId', dogData.dogId || 0);
      setValue('name', dogData.name || '');
      setValue('gender', dogData.gender || '');
      setValue('birthday', dogData.birthday || dayjs().format('YYYY-MM-DD'));
      setValue('weight', dogData.weight || 0);
      setValue(
        'imgUrl',
        dogData.imgUrl && dogData.imgUrl.startsWith('data')
          ? dogData.imgUrl
          : DEFAULT_IMAGE,
      );
    }
  }, [isClient, dogData, setValue]);

  useEffect(() => {
    setAccessToken(localStorage.getItem('access_token'));
  }, []);

  const updateDogProfileAPI = useUpdateDogProfileAPI();

  const handleFormChange = (name: keyof IDogProfile, value: any) => {
    if (name === 'birthday' && value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }
    if (name === 'weight') {
      value = Number(Number(value).toFixed(1));
    }
    if (name === 'imgUrl') {
      value = value.startsWith('data') ? value : DEFAULT_IMAGE;
    }
    setValue(name, value);
  };

  const onSubmit = (data: IDogProfile) => {
    console.log('Form data to be submitted:', data);
    updateDogProfileAPI.mutate(
      { accessToken, formData: data },
      {
        onSuccess: () => {
          setDogData(data);
          openModal();
        },
        onError: (error) => {
          console.error('프로필 업데이트 에러:', error);
        },
      },
    );
  };

  const openModal = () => {
    overlay.open(({ isOpen, close }) => (
      <Modal
        isOpen={isOpen}
        onClose={close}
        children='성공적으로 업데이트되었습니다.'
        btn1='확인'
      />
    ));
  };

  return (
    <ContainerLayout>
      <TopNavigation />
      <Suspense fallback={<Loading/>}>
        <DogProfileFormWrap onSubmit={handleSubmit(onSubmit)}>
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
            initialDate={watch('birthday')}
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
            <Button disabled={!isValid}>저장하기</Button>
          </ButtonWrapper>
        </DogProfileFormWrap>
      </Suspense>
      <BottomNavigation />
    </ContainerLayout>
  );
};

const ButtonWrapper = styled.div`
  margin-top: 40px;
`;

const DogProfileFormWrap = styled.form`
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
export default DogProfilePage;
