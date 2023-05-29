export interface UserModel {
  id: number;
  created: Date;
  updated: Date;

  name: string;
  position: string;
  phone: string;
  email: string;
  password: string;
  isActive: boolean;
  company: string;
  role: string;
}
