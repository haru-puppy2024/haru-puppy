'use client';
import { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '@/app/_states/userState';
import { AxiosError } from 'axios';
import ProfileImg from '@/app/components/profile/ProfileImg';
import Input, { InputType } from '@/app/components/input/Input';
import Button from '@/app/components/button/Button';
import styled from 'styled-components';
import ContainerLayout from '@/app/components/layout/layout';
import TopNavigation from '@/app/components/navigation/TopNavigation';
import RoleDropdown from '@/app/components/profile/RoleDropdown';
import Modal from '@/app/components/modal/modal';
import { IUser } from '@/app/_types/user/User';
import { usePutUserProfileAPI } from '@/app/_utils/apis';
import BottomNavigation from '@/app/components/navigation/BottomNavigation';

const roleSvgDict = {
  DAD: '/svgs/mate_father.svg',
  MOM: '/svgs/mate_mother.svg',
  UNNIE: '/svgs/mate_sister.svg',
  OPPA: '/svgs/mate_brother.svg',
  YOUNGER: '/svgs/mate_younger.svg',
};

const MyProfilePage = () => {
  const [formData, setFormData] = useState<IUser>({
    userId: 0,
    imgUrl: '/svgs/mate_father.svg',
    nickName: '',
    userRole: '',
  });
  const [userData, setUserData] = useRecoilState<any>(userState);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isDefaultImage = !formData.imgUrl?.startsWith('data');
  console.log('수정 폼데이터 img', formData.imgUrl);

  const onSuccess = (userInfo: IUser) => {
    console.log('프로필 업데이트 성공:', userInfo);
    setUserData((currentData: IUser) => ({
      ...currentData,
      nickName: userInfo.nickName,
      userRole: userInfo.userRole,
    }));
    setIsModalVisible(true);
  };

  const onError = (error: AxiosError) => {
    console.error('프로필 업데이트 실패:', error);
  };
  const { mutate: updateUserProfileAPI } = usePutUserProfileAPI(onSuccess, onError);

  useEffect(() => {
    if (userData) {
      setFormData((currentFormData) => ({
        ...currentFormData,
        userId: userData.userId,
        nickName: userData.nickName,
        userRole: userData.userRole,
      }));
    }
  }, [userData]);

  const handleSignupForm = (name: string, value: any) => {
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    if (name === 'userRole' && isDefaultImage) {
      const defaultImage = roleSvgDict[value as keyof typeof roleSvgDict];
      setFormData((prevFormData) => ({ ...prevFormData, imgUrl: defaultImage }));
    }
  };

  const isFormIncomplete = formData.nickName === '' || formData.userRole === '';

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    updateUserProfileAPI(formData);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <ContainerLayout>
      {isModalVisible && <Modal children='성공적으로 업데이트되었습니다.' btn1='확인' onClose={handleCloseModal} />}
      <TopNavigation />
      <UserProfileFormWrap>
        <ProfileImg onValueChange={(value) => handleSignupForm('imgUrl', value)} imgUrl={formData.imgUrl} />
        <Input inputType={InputType.NickName} onInputValue={(value) => handleSignupForm('nickName', value)} value={formData.nickName} />
        <RoleDropdown onValueChange={(value) => handleSignupForm('userRole', value)} value={formData.userRole} />
        <Button onClick={handleSubmitClick} disabled={isFormIncomplete}>
          저장하기
        </Button>
      </UserProfileFormWrap>
      <BottomNavigation />
    </ContainerLayout>
  );
};

const UserProfileFormWrap = styled.form`
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

export default MyProfilePage;
