import axios from 'axios';

import { type UserInterface, type ServerResponse } from '../types';

export interface contactInterface {
  id: number;
  name: string;
  address?: string | undefined;
  email: string;
  number?: string;
}

export const fetchContacts = async (): Promise<
  ServerResponse<UserInterface[]>
> => {
  const res = await axios.get<ServerResponse<UserInterface[]>>(
    'http://localhost:8000/user'
  );
  return res.data;
};
// test email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const addContacts = async (
  name: string,
  address: string,
  email: string,
  number: string
): Promise<contactInterface | undefined> => {
  try {
    //required fields validation
    if (!name || !email) {
      throw new Error('Please fill in the required fields');
    }
    // email validation
    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const res = await axios.post('http://localhost:8000/contacts', {
      id: new Date(),
      name,
      address,
      email,
      number,
    });
    const newContacts = await res.data;
    return newContacts;
  } catch (err: any) {
    console.log(err.message);
    throw new Error('Failed to add contacts.');
  }
};

export const deleteContact = async (id: number) => {
  const res = await axios.delete(`http://localhost:8000/contacts/${id}`);
  return res.data;
};
