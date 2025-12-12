import { gql } from 'graphql-tag';
import { apolloClient } from './client';
import type {
  Announcement,
  AnnouncementsConnection,
  DeleteResponse,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  AnnouncementsQueryVariables,
} from './types';

export const ANNOUNCEMENTS_QUERY = gql`
  query Announcements($limit: Int, $lastKey: String) {
    announcements(limit: $limit, lastKey: $lastKey) {
      items {
        id
        title
        createdAt
        updatedAt
        categories
      }
      lastKey
      hasMore
    }
  }
`;

export const ANNOUNCEMENT_QUERY = gql`
  query Announcement($id: ID!) {
    announcement(id: $id) {
      id
      title
      createdAt
      updatedAt
      categories
      content
    }
  }
`;

export const CREATE_ANNOUNCEMENT_MUTATION = gql`
  mutation CreateAnnouncement($title: String!, $categories: [String!]!, $content: String) {
    createAnnouncement(title: $title, categories: $categories, content: $content) {
      id
      title
      createdAt
      updatedAt
      categories
      content
    }
  }
`;

export const UPDATE_ANNOUNCEMENT_MUTATION = gql`
  mutation UpdateAnnouncement($id: ID!, $title: String, $categories: [String!], $content: String) {
    updateAnnouncement(id: $id, title: $title, categories: $categories, content: $content) {
      id
      title
      createdAt
      updatedAt
      categories
      content
    }
  }
`;

export const DELETE_ANNOUNCEMENT_MUTATION = gql`
  mutation DeleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id) {
      success
    }
  }
`;

export type AnnouncementsQueryResult = {
  announcements: AnnouncementsConnection;
};

export type AnnouncementQueryResult = {
  announcement: Announcement | null;
};

export type CreateAnnouncementMutationResult = {
  createAnnouncement: Announcement;
};

export type UpdateAnnouncementMutationResult = {
  updateAnnouncement: Announcement;
};

export type DeleteAnnouncementMutationResult = {
  deleteAnnouncement: DeleteResponse;
};

export const getAnnouncements = async (
  variables?: AnnouncementsQueryVariables,
): Promise<AnnouncementsConnection> => {
  const { data, error } = await apolloClient.query<AnnouncementsQueryResult>({
    query: ANNOUNCEMENTS_QUERY,
    variables: {
      limit: variables?.limit ?? 20,
      lastKey: variables?.lastKey ?? null,
    },
    fetchPolicy: 'network-only',
  });

  if (error) {
    throw new Error(`Failed to fetch announcements: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to fetch announcements: No data returned');
  }

  return data.announcements;
};

export const getAnnouncementById = async (id: string): Promise<Announcement | null> => {
  const { data, error } = await apolloClient.query<AnnouncementQueryResult>({
    query: ANNOUNCEMENT_QUERY,
    variables: { id },
    fetchPolicy: 'network-only',
  });

  if (error) {
    throw new Error(`Failed to fetch announcement: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to fetch announcement: No data returned');
  }

  return data.announcement;
};

export const createAnnouncement = async (input: CreateAnnouncementInput): Promise<Announcement> => {
  const result = await apolloClient.mutate<CreateAnnouncementMutationResult>({
    mutation: CREATE_ANNOUNCEMENT_MUTATION,
    variables: input,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error('Failed to create announcement: No data returned');
  }

  apolloClient.cache.evict({ fieldName: 'announcements' });
  apolloClient.cache.gc();

  return result.data.createAnnouncement;
};

export const updateAnnouncement = async (input: UpdateAnnouncementInput): Promise<Announcement> => {
  const result = await apolloClient.mutate<UpdateAnnouncementMutationResult>({
    mutation: UPDATE_ANNOUNCEMENT_MUTATION,
    variables: input,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error('Failed to update announcement: No data returned');
  }

  await apolloClient.cache.evict({ fieldName: 'announcements' });
  await apolloClient.cache.evict({ id: `Announcement:${input.id}` });
  await apolloClient.cache.gc();

  return result.data.updateAnnouncement;
};

export const deleteAnnouncement = async (id: string): Promise<boolean> => {
  const result = await apolloClient.mutate<DeleteAnnouncementMutationResult>({
    mutation: DELETE_ANNOUNCEMENT_MUTATION,
    variables: { id },
  });

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error('Failed to delete announcement: No data returned');
  }

  await apolloClient.cache.evict({ fieldName: 'announcements' });
  await apolloClient.cache.evict({ id: `Announcement:${id}` });
  await apolloClient.cache.gc();

  return result.data.deleteAnnouncement.success;
};
