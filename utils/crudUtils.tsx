export interface contactInterface {
  id: number;
  name: string;
  address?: string;
  email: string;
  contactNumber?: number;
}
// test email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const addContacts = async (): Promise<contactInterface | undefined> => {
  try {
    //required fields validation
    if (!name || !email) {
      throw new Error('Please fill in the required fields');
    }
    // email validation
    if (!isValidEmail(email)) {
      throw new Error('Please enter a valid email address.');
    }
    const res = await axios.post('http://localhost:3500/contacts', {
      id: Math.floor(Math.random() * 100) + 1,
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
