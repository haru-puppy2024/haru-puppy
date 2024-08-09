'use client';
import { useEffect, useState } from 'react';
import { userState } from '@/app/_states/userState';
import { IUser } from '@/app/_types/user/User';
import { usePutUserProfileAPI } from '@/app/_utils/apis';
import Button from '@/app/components/button/Button';
import Input from '@/app/components/input/Input';
import ContainerLayout from '@/app/components/layout/layout';
import Modal from '@/app/components/modal/modal';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import ProfileImg from '@/app/components/profile/ProfileImg';
import RoleDropdown from '@/app/components/profile/RoleDropdown';
import { getImgUrlSrc, UserRoleValue } from '@/app/constants/userRoleOptions';
import { AxiosError } from 'axios';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { overlay } from 'overlay-kit';

const MyProfileSchema = v.object({
  userId: v.number(),
  imgUrl: v.string(),
  nickName: v.pipe(
    v.string(),
    v.minLength(2, '닉네임은 최소 2자 이상이어야 합니다.'),
    v.maxLength(15, '닉네임은 15자 이하로 입력해주세요.'),
  ),
  userRole: v.string(),
});

const MyProfilePage = () => {
  const [userData, setUserData] = useRecoilState<any>(userState);
  const [isClient, setIsClient] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<IUser>({
    resolver: valibotResolver(MyProfileSchema),
    defaultValues: {
      userId: 0,
      imgUrl: '',
      nickName: '',
      userRole: '',
    },
    mode: 'onChange',
  });

  const formData = watch();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && userData) {
      console.log('Setting form data from userData:', userData);
      setValue('userId', userData.userId || 0);
      setValue('nickName', userData.nickName || '');
      setValue('userRole', userData.userRole || '');
      setValue(
        'imgUrl',
        getImgUrlSrc(userData.imgUrl, userData.userRole as UserRoleValue),
      );
    }
  }, [isClient, userData, setValue]);

  useEffect(() => {
    if (formData.userRole) {
      setValue(
        'imgUrl',
        getImgUrlSrc(formData.imgUrl, formData.userRole as UserRoleValue),
      );
    }
  }, [formData.userRole, formData.imgUrl, setValue]);

  const updateUserProfileAPI = usePutUserProfileAPI();

  if (!isClient) {
    return null;
  }

  const handleFormChange = (name: keyof IUser, value: any) => {
    setValue(name, value);
    if (name === 'userRole') {
      setValue('imgUrl', getImgUrlSrc(formData.imgUrl, value as UserRoleValue));
    }
  };

  const onSubmit = (data: IUser) => {
    console.log('onSubmit:', data);
    updateUserProfileAPI.mutate(data, {
      onSuccess: (userInfo: IUser) => {
        setUserData((currentData: IUser) => ({
          ...currentData,
          ...userInfo,
        }));
        openModal();
      },
      onError: (error: AxiosError) => {
        console.error('프로필 업데이트 실패:', error);
      },
    });
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
      <UserProfileFormWrap onSubmit={handleSubmit(onSubmit)}>
        <ProfileImg
          onValueChange={(value) => handleFormChange('imgUrl', value)}
          imgUrl={watch('imgUrl')}
        />
        <Input
          {...register('nickName')}
          label='닉네임'
          error={errors.nickName?.message}
          placeholder='닉네임을 입력하세요'
          value={watch('nickName')}
        />
        <RoleDropdown
          onValueChange={(value) => handleFormChange('userRole', value)}
          value={watch('userRole')}
        />
        <Button disabled={!isValid}>저장하기</Button>
      </UserProfileFormWrap>
      <BottomNavigation />
    </ContainerLayout>
  );
};

const UserProfileFormWrap = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 120px 0;
  & > div {
    margin-bottom: 45px;
  }

  & > button {
    margin-top: 150px;
  }
`;

export default MyProfilePage;
