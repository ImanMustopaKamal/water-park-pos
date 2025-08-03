export interface User {
  id: number;
  username: string;
  name: string;
  password: string;
  role_id: number;
  role_name: string;
}

export interface UserRequest {
  username: string;
  name: string;
  password: string;
  role_id: number;
}

export interface UserEditRequest {
  id: string;
  username: string;
  name: string;
  password: string;
  oldPassword: string;
  role_id: number;
}
