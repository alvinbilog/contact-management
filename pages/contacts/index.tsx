import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  // useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Contacts />
    </QueryClientProvider>
  );
};
export default App;

const Contacts = () => {
  const fetchProject = async () => {
    const res = await axios.get('http://localhost:3500/contacts');
    return res.data;
  };
  const {
    isLoading,
    isError,
    error,
    data: contacts,
  } = useQuery<any, any, any, any>({
    queryKey: ['contacts'],
    queryFn: () => fetchProject(),
  });

  return (
    <>
      <h1>Contacts</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          <ul>
            {contacts?.map((contact: any) => (
              <li key={contact.id}>{contact.name}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
