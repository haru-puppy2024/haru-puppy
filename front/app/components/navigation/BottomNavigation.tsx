import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import styled from 'styled-components';
import BottomNavigationIcon from './BottomNavigationIcon';

const BottomNavigation = () => {
  return (
    <BottomNavigationWrap>
      <ul>
        <BottomNavigationIcon icon={<HomeRoundedIcon />} title='홈' route='/' />
        <BottomNavigationIcon icon={<EventAvailableRoundedIcon />} title='일정' route='/schedule' />
        <BottomNavigationIcon icon={<SettingsRoundedIcon />} title='설정' route='/setting' />
      </ul>
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

  & > ul {
    display: flex;
    justify-content: space-around;
    margin: 0;
  }

  & > ul > li {
    flex-grow: 1; /* 아이템이 균등하게 분배되도록 설정 */
    flex-shrink: 1; /* 아이템이 줄어들도록 설정 */
    text-align: center; /* 아이템 가운데 정렬 */
  }
`;

export default BottomNavigation;
