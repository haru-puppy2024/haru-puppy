export const userRoleOptions = [
  { label: '아빠', value: 'DAD' },
  { label: '엄마', value: 'MOM' },
  { label: '언니/누나', value: 'UNNIE' },
  { label: '오빠/형', value: 'OPPA' },
  { label: '동생', value: 'YOUNGER' },
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
