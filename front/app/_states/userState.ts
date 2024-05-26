import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'userState',
  storage: localStorage,
});
interface UserStateType {
  allowNotification: boolean | null;
  dogId: string;
  email: string;
  homeId: string;
  imgUrl: string | null;
  nickName: string;
  userId: string;
  userRole: string | null;
}

export const userState = atom<UserStateType>({
  key: 'userState',
  default: {
    allowNotification: null,
    dogId: '',
    email: '',
    homeId: '',
    imgUrl: null,
    nickName: '',
    userId: '',
    userRole: null,
  },
  effects_UNSTABLE: [persistAtom],
});
