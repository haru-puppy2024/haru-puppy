import React, { useState, useRef } from 'react';
import Image from 'next/image';
import styled from 'styled-components';

interface IProfileImgProps {
  onValueChange: (imgUrl: string) => void;
  imgUrl: string;
}

const ProfileImg = ({ onValueChange, imgUrl }: IProfileImgProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileReader = new FileReader();

      fileReader.onload = (e: ProgressEvent<FileReader>) => {
        if (typeof e.target?.result === 'string') {
          onValueChange(e.target.result);
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <Wrap>
      <ProfileImgWrap onClick={handleImageClick}>
        <input type='file' ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        <ImgWrap>
          <Image src={imgUrl} alt='프로필 이미지' width={140} height={140} />
        </ImgWrap>
        <EditableIcon src='/svgs/editable.svg' alt='편집' width={30} height={30} />
      </ProfileImgWrap>
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
const ImgWrap = styled.div`
  border-radius: 50%;
  overflow: hidden;
`;

const EditableIcon = styled(Image)`
  position: absolute;
  top: 9px;
  right: 5.9px;
  border-radius: 50%;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.2);
`;

export default ProfileImg;
