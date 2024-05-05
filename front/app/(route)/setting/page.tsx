'use client'

import React, { useState } from 'react'
import NavMenu from './components/NavMenu'
import styled from 'styled-components'
import UpperUserProfile from './components/UpperUserProfile'
import ToggleSwitch from '@/app/components/toggle/ToggleSwitch'
import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import ContainerLayout from '@/app/components/layout/layout'
import TopNavigation from '@/app/components/navigation/TopNavigation'
import { useRouter } from 'next/navigation'
import Modal from '@/app/components/modal/modal'
import BottomNavigation from '@/app/components/navigation/BottomNavigation'
import { LOCAL_STORAGE_KEYS } from '@/app/constants/api'
import { fetchNotification } from '@/app/_utils/apis/usePutAlarmApi'
import { useTerminateAccount } from '@/app/_utils/apis/useTerminateAccount'
import { useLogout } from '@/app/_utils/apis/user/useLogout'


const UserDummy = {
    userId: '11111',
    nickname: '이로',
    role: '엄마',
    profileImg: '/svgs/user_profile.svg'
}

interface UserState {
    userId: number;
    email: string;
    imgUrl: string;
    nickName: string;
    userRole: string;
    allowNotification: boolean;
    dogId: number;
    homeId: string;
}


const page = () => {
    const [isToggled, setIsToggled] = useState(false);
    const [isLogoutModal, setLogoutIsModal] = useState(false);
    const [isTerminateModal, setTerminateModal] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();
    const accessToken = localStorage.getItem('access_token');


    const { mutate: notification } = useMutation(
        (active: boolean) => fetchNotification(active, localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('notifications');
            },
        }
    );

    //알림 토글 함수
    const handelToggle = (toggled: boolean) => {
        setIsToggled(toggled)
        notification(toggled);
    }

    //매이트 초대 함수(/invite로 라우팅)
    const handleMateInvite = () => {
        router.push('/invite')
    }


    const toggleLogoutModal = () => {
        setLogoutIsModal(!isLogoutModal)
    }

    const toggleTerminateModal = () => {
        setTerminateModal(!isTerminateModal)
    }

    //로그아웃
    const { mutate: logoutMutation } = useLogout();

    const handleLogout = () => {
        logoutMutation({ accessToken });
    }

    //회원탈퇴
    const { mutate: terminateMutation } = useTerminateAccount();

    //회원 탈퇴 
    const handleTerminate = () => {
        terminateMutation({ accessToken })
    };


    return (
        <>
            <TopNavigation />
            <Wrapper>
                <UpperUserProfile user={UserDummy} />
                <MenuWrapper>
                    <NavMenu title='알림 설정' >
                        <ToggleSwitch onToggle={handelToggle} isToggled={isToggled} />
                    </NavMenu>
                    <NavMenu title='로그아웃' onClick={toggleLogoutModal} />
                    {isLogoutModal && (
                        <Modal
                            children="로그아웃하시겠습니까?"
                            btn1="취소"
                            btn2="로그아웃"
                            onClose={toggleLogoutModal}
                            onBtn2Click={handleLogout}

                        />
                    )}
                    <NavMenu title='회원 탈퇴' onClick={toggleTerminateModal} />
                    {isTerminateModal && (
                        <Modal
                            children="정말 탈퇴 하시겠습니까?"
                            btn1="취소"
                            btn2="회원 탈퇴"
                            onClose={toggleTerminateModal}
                            onBtn2Click={handleTerminate}
                        />
                    )}
                    <NavMenu title='메이트 초대하기' onClick={handleMateInvite} />
                </MenuWrapper>
            </Wrapper>
            <BottomNavigation />
        </>
    )
}


const MenuWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const Wrapper = styled.div`
    display: flex;  
    flex-direction: column;
    justify-items: center;
    align-items: center;
   margin-top: 50px;
`
export default page

