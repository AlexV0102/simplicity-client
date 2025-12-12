import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import type { GraphQLError } from 'graphql';
import { env } from '../config/env';

const httpLink = new HttpLink({
  uri: env.graphqlEndpoint,
});

const errorLink = onError((errorResponse) => {
  const graphQLErrors = (errorResponse as { graphQLErrors?: readonly GraphQLError[] })
    .graphQLErrors;
  const networkError = (errorResponse as { networkError?: Error }).networkError;

  if (graphQLErrors) {
    graphQLErrors.forEach((error: GraphQLError) => {
      console.error(
        `GraphQL error: Message: ${error.message}, Location: ${error.locations
          ?.map((loc) => `${loc.line}:${loc.column}`)
          .join(', ')}, Path: ${error.path?.join('.')}`,
      );
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError.message}`);
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
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
