import React from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { TabProvider, Tab, TabList, useTabStore } from '@ariakit/react';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

const BottomNavigation = () => {
  const router = useRouter();
  const tabStore = useTabStore({
    defaultSelectedId: '0',
  });

  const tabs = [
    { icon: <HomeRoundedIcon />, title: '홈', route: '/home' },
    { icon: <EventAvailableRoundedIcon />, title: '일정', route: '/schedule' },
    { icon: <SettingsRoundedIcon />, title: '설정', route: '/setting' },
  ];

  const handleTabChange = (index: number) => {
    router.push(tabs[index].route);
  };

  return (
    <BottomNavigationWrap>
      <TabProvider store={tabStore}>
        <TabList aria-label='Bottom Navigation'>
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              className='tab-button'
              onClick={() => handleTabChange(index)}
            >
              <IconWrap>
                {tab.icon}
                <strong>{tab.title}</strong>
              </IconWrap>
            </Tab>
          ))}
        </TabList>
      </TabProvider>
    </BottomNavigationWrap>
  );
};

const BottomNavigationWrap = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffffff;
  width: 390px;
  border-top: 0.5px solid ${({ theme }) => theme.colors.black60};

  & > [role='tablist'] {
    display: flex;
    justify-content: space-around;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .tab-button {
    text-align: center;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
`;

const IconWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 84px;
  height: 60px;
  color: ${({ theme }) => theme.colors.black90};

  &:hover {
    color: ${({ theme }) => theme.colors.main};
  }

  & > strong {
    margin-top: 4px;
    font-size: 10px;
    font-weight: ${({ theme }) => theme.typo.regular};
  }

  [data-active] & {
    color: ${({ theme }) => theme.colors.main};
  }
`;

export default BottomNavigation;
