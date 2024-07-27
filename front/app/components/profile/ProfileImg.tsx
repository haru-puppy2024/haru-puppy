import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Button from '../button/Button';

interface IProfileImgProps {
  onValueChange: (imgUrl: string) => void;
  imgUrl: string;
}

const ProfileImg = ({ onValueChange, imgUrl }: IProfileImgProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImgUrl, setCurrentImgUrl] = useState(imgUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialImgUrlRef = useRef<string>(imgUrl);

  const handleImageClick = () => {
    if (currentImgUrl.startsWith('data:')) {
      setIsModalOpen(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif', 'image/bmp', 'image/tiff', 'image/x-icon'];

      if (!validImageTypes.includes(file.type)) {
        alert('이미지 형식 파일만 등록할 수 있습니다. (jpeg, png, svg, webp 등)');
        return;
      }

      const fileReader = new FileReader();

      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          setCurrentImgUrl(e.target.result);
          onValueChange(e.target.result);
          setIsModalOpen(false);
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setCurrentImgUrl(initialImgUrlRef.current); // 초기 이미지로 복원
    onValueChange(initialImgUrlRef.current);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!imgUrl.startsWith('data:')) {
      initialImgUrlRef.current = imgUrl;
    }
    setCurrentImgUrl(imgUrl);
  }, [imgUrl]);

  return (
    <Wrap>
      <ProfileImgWrap onClick={handleImageClick}>
        <input type='file' ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        <ImgWrap>
          <StyledCurrentImage src={currentImgUrl} alt='프로필 이미지' />
        </ImgWrap>
        <EditableIcon src='/svgs/editable.svg' alt='편집' width={30} height={30} />
      </ProfileImgWrap>
      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setIsModalOpen(false)}>
              <StyledCurrentImage src='/svgs/close_grey.svg' alt='닫기' />
            </CloseButton>
            <img src={currentImgUrl} alt='프로필 이미지' />
            <ButtonGroup>
              <Button onClick={handleDeleteImage} width='120px' height='32px'>
                삭제
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} width='120px' height='32px'>
                새 이미지
              </Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const ProfileImgWrap = styled.div`
  position: relative;
  cursor: pointer;
`;
const StyledCurrentImage = styled.img`
  width: 140px;
  height: 140px;
`;
const ImgWrap = styled.div`
  border-radius: 50%;
  overflow: hidden;
`;

const EditableIcon = styled.img`
  position: absolute;
  top: 9px;
  right: 5.9px;
  border-radius: 50%;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px 20px 20px;
  border-radius: 10px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;

  & > img {
    width: 28px;
    height: 28px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-top: 1.5rem;
`;

export default ProfileImg;
