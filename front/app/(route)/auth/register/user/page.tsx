'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { userState } from '@/app/_states/userState';
import { IUser } from '@/app/_types';
import { usePostInviteRegisterAPI } from '@/app/_utils/apis/user/usePostRegisterAPI';
import Button from '@/app/components/button/Button';
import Input, { InputType } from '@/app/components/input/Input';
import ContainerLayout from '@/app/components/layout/layout';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import ProfileImg from '@/app/components/profile/ProfileImg';
import RoleDropdown from '@/app/components/profile/RoleDropdown';
import { getUserRoleSvgPath, UserRoleValue } from '@/app/constants/userRoleOptions';
import Loading from '@/app/components/loading/loading';

const UserRegisterPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userData = useRecoilValue(userState);
  const isInvitedUser = userData.homeId !== '';
  const [isClient, setIsClient] = useState(false);

  const { mutate: inviteRegisterAPI } = usePostInviteRegisterAPI();

  const [formData, setFormData] = useState<IUser>({
    imgUrl: '/svgs/mate_father.svg',
    email: '',
    nickName: '',
    userRole: '',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && searchParams) {
      const email = searchParams.get('email');
      if (email) {
        setFormData((prevFormData) => ({ ...prevFormData, email }));
      }
    }
  }, [isClient, searchParams]);

  const [isFormIncomplete, setIsFormIncomplete] = useState(true);
  //1. 디폴트 이미지인지..?
  //2. role에 따라서 디폴트 이미지 바꿔주기
  //3. 이미 사용자가 업로드한 이미지가 있으면 디폴트 이미지가 되어선 안됨...
  const isDefaultImage = !formData.imgUrl?.startsWith('data');
  const handleSignupForm = (name: string, value: any) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);

    const formIncomplete = newFormData.nickName === '' || newFormData.userRole === '';
    setIsFormIncomplete(formIncomplete);

    if (name === 'userRole' && isDefaultImage) {
      const defaultImage = getUserRoleSvgPath(value as UserRoleValue);
      setFormData((prevFormData) => ({ ...prevFormData, imgUrl: defaultImage }));
    }
  };

  const handleSubmit = () => {
    const userRequestData = {
      email: formData.email,
      nickName: formData.nickName,
      imgUrl: formData.imgUrl,
      userRole: formData.userRole,
    };

    if (isInvitedUser) {
      inviteRegisterAPI({ requestData: userRequestData, homeId: userData.homeId });
    } else {
      sessionStorage.setItem('userRequestData', JSON.stringify(userRequestData));
      router.push('/auth/register/dog');
    }
  };

  return (
    <ContainerLayout>
      <TopNavigation />
      <Suspense fallback={<Loading />}>
        <UserProfileFormWrap>
          <ProfileImg onValueChange={(value) => handleSignupForm('imgUrl', value)} imgUrl={formData.imgUrl} />
          <Input inputType={InputType.NickName} onInputValue={(value) => handleSignupForm('nickName', value)} />
          <RoleDropdown onValueChange={(value) => handleSignupForm('userRole', value)} />
          <Button onClick={handleSubmit} disabled={isFormIncomplete}>
            가입하기
          </Button>
        </UserProfileFormWrap>
      </Suspense>
    </ContainerLayout>
  );
};

const UserProfileFormWrap = styled.div`
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
