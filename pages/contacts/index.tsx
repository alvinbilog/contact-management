import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  // useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import { addContacts, deleteContact, fetchContacts } from '../../api';
import React from 'react';
import { ContactInterface } from '../../api';

const queryClient = new QueryClient();
const queryKeys = { CONTACTS: 'contacts' };

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Contacts />
    </QueryClientProvider>
  );
};
export default App;

// interface

// interface ContactInterface {
//   _id: any;
//   name: string;
//   address?: string;
//   email: string;
//   contactNumber?: string;
// }

const Contacts = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  //create
  const addContactMutation = useMutation({
    mutationFn: (contactData: {
      name: string;
      address: string;
      email: string;
      number: string;
    }) =>
      addContacts(
        contactData.name,
        contactData.address,
        contactData.email,
        contactData.number
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.CONTACTS] });
    },
    onSettled: (data, error, variables, context) => {
      // I will fire second!
      setName('');
      setAddress('');
      setEmail('');
      setNumber('');
    },
  });

  //delete
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.CONTACTS] });
    },
  });

  const {
    isLoading,
    isError,
    error,
    data: contacts,
    // } = useQuery<boolean, any, any, any>({
  } = useQuery<ContactInterface[], Error>({
    queryKey: [queryKeys.CONTACTS],
    queryFn: fetchContacts,
  });

  return (
    <>
      <h1>Contacts</h1>

      <form action="">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="add">Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="num">Number:</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <button
          type="submit"
          onClick={(e: any) => {
            e.preventDefault();
            addContactMutation.mutate({ name, address, email, number });
          }}
        >
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
            // {contacts?.map((contact: ContactInterface[]) => (
            <div key={contact._id}>
              <span>{contact.name}</span>
              <span>{contact.address}</span>
              <span>{contact.email}</span>
              <span>{contact.contactNumber}</span>
              <button>Edit</button>
              <button onClick={() => deleteContactMutation.mutate(contact._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
