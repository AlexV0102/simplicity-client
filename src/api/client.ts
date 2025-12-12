import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { env } from '../config/env';

const httpLink = new HttpLink({
  uri: env.graphqlEndpoint,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          announcements: {
            keyArgs: ['limit', 'lastKey'],
            merge(existing, incoming, { args }) {
              if (!existing) {
                return incoming;
              }
              if (!args?.lastKey) {
                return incoming;
              }
              return {
                ...incoming,
                items: [...existing.items, ...incoming.items],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});
