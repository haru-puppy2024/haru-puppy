import { IDog } from './Dog';
import { IUser } from './User';

export interface IRequestData {
  userRequest: IUser;
  dogRequest: IDog;
  homeName: string;
}
