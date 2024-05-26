'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { userState } from '@/app/_states/userState';
import { useMutation } from 'react-query';
import ProfileImg, { ProfileType } from '@/app/components/profile/ProfileImg';
import Input, { InputType } from '@/app/components/input/Input';
import Button from '@/app/components/button/Button';
import styled from 'styled-components';
import ContainerLayout from '@/app/components/layout/layout';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import { IUser } from '@/app/_types';
import RoleDropdown from '@/app/components/profile/RoleDropdown';
import { usePostInviteRegisterAPI } from '@/app/_utils/apis/user/usePostRegisterAPI';

const UserRegisterPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userData = useRecoilValue(userState);
  const isInvitedUser = userData.homeId !== '';
  console.log(userData.homeId);
  const { mutate: inviteRegisterAPI } = usePostInviteRegisterAPI();

  const [formData, setFormData] = useState<IUser>({
    imgUrl: 'src://',
    email: '',
    nickName: '',
    userRole: '',
  });

  useEffect(() => {
    const email = searchParams?.get('email');
    if (email) {
      setFormData((prevFormData) => ({ ...prevFormData, email }));
    }
  }, [searchParams]);

  const [isFormIncomplete, setIsFormIncomplete] = useState(true);

  const handleSignupForm = (name: string, value: any) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    const formIncomplete = newFormData.nickName === '' || newFormData.userRole === '';
    setIsFormIncomplete(formIncomplete);
    console.log(newFormData);
  };

  const handleSubmit = () => {
    const userRequestData = {
      email: formData.email,
      nickName: formData.nickName,
      imgUrl: formData.imgUrl,
      userRole: formData.userRole,
    };

    if (isInvitedUser) {
      console.log(userRequestData, userData.homeId);
      inviteRegisterAPI({ requestData: userRequestData, homeId: userData.homeId });
    } else {
      sessionStorage.setItem('userRequestData', JSON.stringify(userRequestData));
      router.push('/auth/register/dog');
    }
  };

  return (
    <ContainerLayout>
      <TopNavigation />
      <UserProfileFormWrap>
        <ProfileImg profileType={ProfileType.User} onValueChange={(value) => handleSignupForm('imgUrl', value)} />
        <Input inputType={InputType.NickName} onInputValue={(value) => handleSignupForm('nickName', value)} />
        <RoleDropdown onValueChange={(value) => handleSignupForm('userRole', value)} />
        <Button onClick={handleSubmit} disabled={isFormIncomplete}>
          {isInvitedUser ? '가입하기' : '저장하기'}
        </Button>
      </UserProfileFormWrap>
    </ContainerLayout>
  );
};

const UserProfileFormWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
  & > div {
    margin-bottom: 45px;
  }

  & > button {
    margin-top: 150px;
  }
`;

export default UserRegisterPage;
