// src/apolloClient.js
// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// const client = new ApolloClient({
//   link: new HttpLink({ uri: 'http://localhost:5000/graphql' }),
//   cache: new InMemoryCache(),
// });

// export default client;

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({ 
    uri: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/graphql' 
  }),
  cache: new InMemoryCache(),
});

export default client;
