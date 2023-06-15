export type UserInterface = {
  _id: string;
  name: string;
  address?: string;
  email: string;
  contactNumber: string;
};

export type ServerResponse<T> = {
  success: boolean;
  data: T;
  error: String;
};
