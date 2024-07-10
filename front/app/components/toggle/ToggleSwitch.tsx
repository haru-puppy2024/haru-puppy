import styled from 'styled-components';

interface IToggleSwitchProps {
  isToggled: boolean;
  onToggle: (toggled: boolean) => void;
}

const ToggleSwitch = ({ isToggled, onToggle }: IToggleSwitchProps) => {
  return (
    <ToggleContainer onClick={() => onToggle(!isToggled)} data-toggled={isToggled}>
      <ToggleSlider data-toggled={isToggled} />
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div`
  width: 50px;
  height: 25px;
  border-radius: 25px;
  position: relative;
  cursor: pointer;
  background-color: #ccc;

  &[data-toggled='true'] {
    background-color: ${({ theme }) => theme.colors.main};
  }
`;

const ToggleSlider = styled.div`
  background-color: #fff;
  height: 20px;
  width: 20px;
  position: absolute;
  top: 2px;
  border-radius: 50%;
  transition: left 0.2s;
  left: 2px;

  &[data-toggled='true'] {
    left: 26px;
  }
`;

export default ToggleSwitch;
