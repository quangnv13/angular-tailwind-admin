import { HttpResultMetaData } from './http';

export type LoginData = {
  username: string;
  password: string;
};

export type TokenData = {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
};

export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  userFullName?: string;
  email: string;
  phoneNumber: string;
  address: string;
  userName: string;
  password: string;
  balance: number;
  memberPlanId?: string;
  memberShipExpireDate?: string;
};

export type UserCreate = User;
