// src/apolloClient.js
// import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

// const client = new ApolloClient({
//   link: new HttpLink({ uri: 'http://localhost:5000/graphql' }),
//   cache: new InMemoryCache(),
// });

// export default client;


import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const getBackendUrl = () => {
  // Check if the app is running in production or locally
  const isLocalhost = window.location.hostname === "localhost";

  if (isLocalhost) {
    return 'http://localhost:5000/graphql';
  } else {
    return process.env.REACT_APP_BACKEND_URL || 'https://petpooja2.onrender.com/graphql';
  }
};

const client = new ApolloClient({
  link: new HttpLink({ uri: getBackendUrl() }),
  cache: new InMemoryCache(),
});

export default client;
