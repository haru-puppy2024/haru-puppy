export interface IHomeData {
  dogDetailResponse: IDogDetail;
  mateDto: IMate[];
  rankingDto: IRanking[];
  reportDto: IReport;
}


export interface IDogDetail {
  dogId: number;
  name: string;
  weight: number;
  gender: 'FEMALE' | 'MALE';
  birthday: string;
  imgUrl: string;
}

export interface IMate {
  userId: number;
  imgUrl?: string;
  nickName?: string;
  userRole?: string;
}

export interface IRanking {
  userId: number;
  imgUrl: string;
  nickName: string;
  userRole: string;
  count: number;
}

export interface IReport {
  todayPooCount: number;
  lastWalkCount: number;
  lastWash: string | null;
  lastHospitalDate: string | null;
}