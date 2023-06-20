import { QueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

export interface ContactInterface {
  _id: number;
  name: string;
  address?: string | undefined;
  email: string;
  number?: string;
}

export const fetchContacts = async (): Promise<ContactInterface[]> => {
  const res = await axios.get('http://localhost:8000/contacts/get-all');
  return res.data.data;
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
): Promise<ContactInterface | undefined> => {
  try {
    //required fields validation
    if (!name || !email) {
      throw new Error('Please fill in the required fields');
    }
    // email validation
    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }

    const res = await axios.post('http://localhost:8000/contacts/create', {
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

export const deleteContact = async (id: string) => {
  try {
    const res = await axios.delete(
      `http://localhost:8000/contacts/delete/${id}`
    );

    // queryClient.invalidateQueries({ queryKey: ['contacts'] });
    return res.data;
  } catch (e: any) {
    console.log(e.message);
  }
};
