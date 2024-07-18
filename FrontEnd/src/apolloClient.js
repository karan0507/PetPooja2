import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { setContext } from '@apollo/client/link/context';

// Create the upload link
const uploadLink = createUploadLink({
  uri: 'http://localhost:5000/graphql', // Ensure this is the correct URL for your GraphQL server
});

// Set up context to include authorization headers if necessary
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(uploadLink), // Combine auth link with upload link
  cache: new InMemoryCache(),
});

export default client;
