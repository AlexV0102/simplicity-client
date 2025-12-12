const getEnvVar = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  graphqlEndpoint: getEnvVar('VITE_GRAPHQL_ENDPOINT'),
} as const;

