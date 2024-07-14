export const userRoleOptions = [
  { label: '아빠', value: 'DAD', svgPath: '/svgs/mate_father.svg' },
  { label: '엄마', value: 'MOM', svgPath: '/svgs/mate_mother.svg' },
  { label: '언니/누나', value: 'UNNIE', svgPath: '/svgs/mate_sister.svg' },
  { label: '오빠/형', value: 'OPPA', svgPath: '/svgs/mate_brother.svg' },
  { label: '동생', value: 'YOUNGER', svgPath: '/svgs/mate_younger.svg' },
];

export type UserRoleValue = (typeof userRoleOptions)[number]['value'];
export type UserRoleLabel = (typeof userRoleOptions)[number]['label'];

export const getUserRoleLabel = (value: UserRoleValue): UserRoleLabel => {
  const option = userRoleOptions.find((option) => option.value === value);
  return option ? option.label : value;
};

export const getUserRoleValue = (label: UserRoleLabel): UserRoleValue | undefined => {
  const option = userRoleOptions.find((option) => option.label === label);
  return option ? option.value : label;
};

export const getUserRoleSvgPath = (value: UserRoleValue): string => {
  const option = userRoleOptions.find((option) => option.value === value);
  console.log('getUserRoleSvgPath의 이미지 경로', option?.svgPath);
  return option ? option.svgPath : '';
};

export const getImgUrlSrc = (imgUrl: string | undefined, userRole: UserRoleValue): string => {
  if (imgUrl && imgUrl.startsWith('data:')) {
    console.log('getImgUrlSrc의 이미지 경로', imgUrl);
    return imgUrl;
  }

  return getUserRoleSvgPath(userRole);
};
