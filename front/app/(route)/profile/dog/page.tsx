'use client';

import { dogState } from '@/app/_states/dogState';
import { IDogProfile } from '@/app/_types/user/Dog';
import { updateDogProfileAPI } from '@/app/_utils/apis/useDogProfileApi';
import Button from '@/app/components/button/Button';
import Input, { InputType } from '@/app/components/input/Input';
import ContainerLayout from '@/app/components/layout/layout';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import DateSelect, { DateSelectLabel } from '@/app/components/profile/DateSelect';
import GenderSelect from '@/app/components/profile/GenderSelect';
import ProfileImg from '@/app/components/profile/ProfileImg';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

const DogProfilePage = () => {
  const defaultImage = '/svgs/dog_profile.svg';

  const [formData, setFormData] = useState<IDogProfile>({
    dogId: 0,
    name: '',
    gender: '',
    birthday: '',
    weight: 0,
    imgUrl: defaultImage,
  });

  const isDefaultImage = !formData.imgUrl?.startsWith('data');

  const [dogData, setDogData] = useRecoilState<any>(dogState);

  //필수입력 상태값
  const [requiredField, setRequiredField] = useState<{ name: boolean; gender: boolean; weight: boolean }>({
    name: false,
    gender: false,
    weight: false,
  });

  useEffect(() => {
    if (dogData) {
      setFormData({
        dogId: dogData.dogId,
        name: dogData.name || '',
        gender: dogData.gender || '',
        birthday: dogData.birthday || '',
        weight: dogData.weight || 0,
        imgUrl: dogData.imgUrl || defaultImage,
      });

      setRequiredField({
        name: !!dogData.name,
        gender: !!dogData.gender,
        weight: !!dogData.weight,
      });
    }
  }, [dogData]);

  const handleSelectChange = (name: string, value: any) => {
    if (name === 'birthday' && value instanceof Date) {
      value = dayjs(value).format('YYYY-MM-DD');
    }

    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);

    setRequiredField({
      ...requiredField,
      [name]: value !== '' && value !== null,
    });

    if (isDefaultImage) {
      setFormData((prevFormData) => ({ ...prevFormData, imgUrl: defaultImage }));
    }

    console.log('업데이트 된 formData:', newFormData);
  };

  //필수 입력란 체크 boolean
  const areAllFieldsFilled = requiredField.name && requiredField.gender && requiredField.weight;

  const accessToken = localStorage.getItem('access_token');
  const { mutate: updateDogProfileMutation } = updateDogProfileAPI({ accessToken, formData });

  const handleSignUpClick = () => {
    console.log('Sending FormData:', formData);
    updateDogProfileMutation();
  };

  return (
    <ContainerLayout>
      <TopNavigation />
      <ComponentsWrapper>
        <ProfileImg onValueChange={(value) => handleSelectChange('imgUrl', value)} imgUrl={formData.imgUrl} />
        <Input inputType={InputType.DogName} onInputValue={(value) => handleSelectChange('name', value)} value={formData.name} />
        <GenderSelect onValueChange={(value) => handleSelectChange('gender', value)} value={formData.gender} />
        <DateSelect onValueChange={(value) => handleSelectChange('birthday', value)} label={DateSelectLabel.Birthday} isRequired={false} initialDate={formData.birthday} />
        <Input inputType={InputType.Weight} onInputValue={(value) => handleSelectChange('weight', value)} value={formData.weight} />
        <ButtonWrapper>
          <Button onClick={handleSignUpClick} disabled={!areAllFieldsFilled}>
            저장하기
          </Button>
        </ButtonWrapper>
      </ComponentsWrapper>
      <BottomNavigation />
    </ContainerLayout>
  );
};

const ButtonWrapper = styled.div`
  margin-top: 40px;
`;

const ComponentsWrapper = styled.div`
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
