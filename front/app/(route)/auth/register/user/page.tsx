'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { userState } from '@/app/_states/userState';
import { IUser } from '@/app/_types';
import { usePostInviteRegisterAPI } from '@/app/_utils/apis/user/usePostRegisterAPI';
import Button from '@/app/components/button/Button';
import Input from '@/app/components/input/Input';
import ContainerLayout from '@/app/components/layout/layout';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import ProfileImg from '@/app/components/profile/ProfileImg';
import RoleDropdown from '@/app/components/profile/RoleDropdown';
import { getUserRoleSvgPath, UserRoleValue } from '@/app/constants/userRoleOptions';
import Loading from '@/app/components/loading/loading';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';

const NewMemberSchema = v.object({
  imgUrl: v.string(),
  email: v.string(),
  nickName: v.pipe(
    v.string(),
    v.minLength(2, '닉네임은 최소 2자 이상이어야 합니다.'),
    v.maxLength(15, '닉네임은 15자 이하로 입력해주세요.'),
  ),
  userRole: v.string(),
});

const UserRegisterPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const userData = useRecoilValue(userState);
  const isInvitedUser = userData.homeId !== '';
  const { mutate: inviteRegisterAPI } = usePostInviteRegisterAPI();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<IUser>({
    resolver: valibotResolver(NewMemberSchema),
    defaultValues: {
      imgUrl: '/svgs/mate_father.svg',
      email: '',
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
    if (isClient) {
      const searchParams = new URLSearchParams(window.location.search);
      const emailParam = searchParams.get('email');
      if (emailParam) {
        setValue('email', emailParam);
      }
    }
  }, [isClient, setValue]);

  useEffect(() => {
    //1. 디폴트 이미지인지..?
    //2. role에 따라서 디폴트 이미지 바꿔주기
    //3. 이미 사용자가 업로드한 이미지가 있으면 디폴트 이미지가 되어선 안됨...
    const isDefaultImage = !formData.imgUrl?.startsWith('data');
    if (formData.userRole && isDefaultImage) {
      const defaultImage = getUserRoleSvgPath(formData.userRole as UserRoleValue);
      setValue('imgUrl', defaultImage);
    }
  }, [formData.userRole, setValue]);

  const handleFormChange = (name: keyof IUser, value: any) => {
    setValue(name, value);
    if (name === 'userRole' && !formData.imgUrl.startsWith('data')) {
      const defaultImage = getUserRoleSvgPath(value as UserRoleValue);
      setValue('imgUrl', defaultImage);
    }
  };

  const onSubmit = (data: IUser) => {
    if (isInvitedUser) {
      inviteRegisterAPI({ requestData: data, homeId: userData.homeId });
    } else {
      sessionStorage.setItem('userRequestData', JSON.stringify(data));
      router.push('/auth/register/dog');
    }
  };

  console.log('Form Data:', formData);

  return (
    <ContainerLayout>
      <TopNavigation />
      <Suspense fallback={<Loading />}>
        <UserRegisterFormWrap onSubmit={handleSubmit(onSubmit)}>
          <ProfileImg
            onValueChange={(value) => handleFormChange('imgUrl', value)}
            imgUrl={watch('imgUrl')}
          />
          <Input
            {...register('nickName')}
            label='닉네임'
            error={errors.nickName?.message}
            placeholder='닉네임을 입력하세요'
          />
          <RoleDropdown
            onValueChange={(value) => handleFormChange('userRole', value)}
            value={watch('userRole')}
          />
          <Button disabled={!isValid}>가입하기</Button>
        </UserRegisterFormWrap>
      </Suspense>
    </ContainerLayout>
  );
};

const UserRegisterFormWrap = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 7.5rem 0;
  & > div {
    margin-bottom: 45px;
  }

  & > button {
    margin-top: 150px;
  }
`;

export default UserRegisterPage;
