import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  // useQueryClient,
} from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { deleteContact } from '../../api';

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Contacts />
    </QueryClientProvider>
  );
};
export default App;

// interface

interface contactInterface {
  id: number;
  name: string;
  address?: string;
  email: string;
  contactNumber?: number;
}

const Contacts = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  // useEffect(() => {
  //   const user = async (): Promise<void> => {
  //     await getUserAPI;
  //   };
  // }, []);

  const fetchContacts = async () => {
    const res = await axios.get('http://localhost:8000/contacts/get-all');
    return res.data;
  };
  // test email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addContacts = async (): Promise<contactInterface | undefined> => {
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
        id: Date.now(),
        name,
        address,
        email,
        number,
      });
      const newContacts = await res.data;
      return newContacts;
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const {
    isLoading,
    isError,
    error,
    data: contacts,
  } = useQuery<boolean, any, any, any>({
    queryKey: ['contacts'],
    queryFn: () => fetchContacts(),
    select: (data: any) => data.sort((a: any, b: any) => b.id - a.id),
  });

  return (
    <>
      <h1>Contacts</h1>

      <form action="">
        <label htmlFor="name">Name:</label>
        <input type="text" required onChange={(e) => setName(e.target.value)} />
        <label htmlFor="add">Address:</label>
        <input type="text" onChange={(e) => setAddress(e.target.value)} />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="num">Number:</label>
        <input type="text" onChange={(e) => setNumber(e.target.value)} />
        <button type="submit" onClick={() => addContacts()}>
          Submit
        </button>
      </form>

      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          <span>Name</span>&nbsp;&nbsp;&nbsp;
          <span>Address</span>&nbsp;&nbsp;&nbsp;
          <span>Email</span>&nbsp;&nbsp;&nbsp;
          <span>Number</span>&nbsp;&nbsp;&nbsp;
          {contacts?.map((contact: any) => (
            <div key={contact.id}>
              <span>{contact.name}</span>
              <span>{contact.address}</span>
              <span>{contact.email}</span>
              <span>{contact.contactNumber}</span>
              <button>Edit</button>
              <button onClick={() => deleteContact(contact.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
