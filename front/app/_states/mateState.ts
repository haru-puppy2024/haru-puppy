import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { IMate } from '@/app/_types/user/Mate';

const storage = typeof window !== 'undefined' ? localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: 'mateState',
  storage: storage,
});

export const mateState = atom<IMate[]>({
  key: 'mateState',
  default: [],
  effects_UNSTABLE: [persistAtom],
});
