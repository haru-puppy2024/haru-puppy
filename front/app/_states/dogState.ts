import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const storage = typeof window !== 'undefined' ? localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: 'dogState',
  storage: storage,
});

interface DogStateType {
  dogId: number | null;
  imgUrl: string | null;
  name: string;
  weight: number | null;
  gender: string;
  birthday: string;
}

export const dogState = atom<DogStateType>({
  key: 'dogState',
  default: {
    dogId: null,
    imgUrl: null,
    name: '',
    weight: null,
    gender: '',
    birthday: '',
  },
  effects_UNSTABLE: [persistAtom],
});
