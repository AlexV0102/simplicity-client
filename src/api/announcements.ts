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
  query Announcements($limit: Int, $lastKey: String, $categories: [String!], $searchText: String) {
    announcements(
      limit: $limit
      lastKey: $lastKey
      categories: $categories
      searchText: $searchText
    ) {
      items {
        id
        title
        createdAt
        updatedAt
        categories
        content
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
  mutation UpdateAnnouncement($id: ID!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
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
  try {
    const { data } = await apolloClient.query<AnnouncementsQueryResult>({
      query: ANNOUNCEMENTS_QUERY,
      variables: {
        limit: variables?.limit ?? 20,
        lastKey: variables?.lastKey ?? null,
        categories:
          variables?.categories && variables.categories.length > 0
            ? variables.categories
            : undefined,
        searchText:
          variables?.searchText && variables.searchText.trim() !== ''
            ? variables.searchText.trim()
            : undefined,
      },
      fetchPolicy: 'network-only',
    });

    if (!data) {
      throw new Error('Failed to fetch announcements: No data returned');
    }

    return data.announcements;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch announcements: ${error.message}`);
    }
    throw new Error('Failed to fetch announcements: Unknown error');
  }
};

export const getAnnouncementById = async (id: string): Promise<Announcement | null> => {
  try {
    const { data } = await apolloClient.query<AnnouncementQueryResult>({
      query: ANNOUNCEMENT_QUERY,
      variables: { id },
      fetchPolicy: 'network-only',
    });

    if (!data) {
      throw new Error('Failed to fetch announcement: No data returned');
    }

    return data.announcement;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch announcement: ${error.message}`);
    }
    throw new Error('Failed to fetch announcement: Unknown error');
  }
};

export const createAnnouncement = async (input: CreateAnnouncementInput): Promise<Announcement> => {
  try {
    const result = await apolloClient.mutate<CreateAnnouncementMutationResult>({
      mutation: CREATE_ANNOUNCEMENT_MUTATION,
      variables: input,
    });

    if (!result.data) {
      throw new Error('Failed to create announcement: No data returned');
    }

    apolloClient.cache.evict({ fieldName: 'announcements' });
    apolloClient.cache.gc();

    return result.data.createAnnouncement;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to create announcement:', error.message);
      throw error;
    }
    throw new Error('Failed to create announcement: Unknown error');
  }
};

export const updateAnnouncement = async (input: UpdateAnnouncementInput): Promise<Announcement> => {
  try {
    const { id, ...inputData } = input;
    const result = await apolloClient.mutate<UpdateAnnouncementMutationResult>({
      mutation: UPDATE_ANNOUNCEMENT_MUTATION,
      variables: {
        id,
        input: inputData,
      },
    });

    if (!result.data) {
      throw new Error('Failed to update announcement: No data returned');
    }

    apolloClient.cache.evict({ fieldName: 'announcements' });
    apolloClient.cache.evict({ id: `Announcement:${id}` });
    apolloClient.cache.gc();

    return result.data.updateAnnouncement;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update announcement:', error.message);
      throw error;
    }
    throw new Error('Failed to update announcement: Unknown error');
  }
};

export const deleteAnnouncement = async (id: string): Promise<boolean> => {
  try {
    const result = await apolloClient.mutate<DeleteAnnouncementMutationResult>({
      mutation: DELETE_ANNOUNCEMENT_MUTATION,
      variables: { id },
    });

    if (!result.data) {
      throw new Error('Failed to delete announcement: No data returned');
    }

    apolloClient.cache.evict({ fieldName: 'announcements' });
    apolloClient.cache.evict({ id: `Announcement:${id}` });
    apolloClient.cache.gc();

    return result.data.deleteAnnouncement.success;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to delete announcement:', error.message);
      throw error;
    }
    throw new Error('Failed to delete announcement: Unknown error');
  }
};
