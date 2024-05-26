import { IDog } from './Dog';
import { IUser } from './User';

export interface IRegisterData {
  userRequest: IUser;
  dogRequest: IDog;
  homeName: string;
}
