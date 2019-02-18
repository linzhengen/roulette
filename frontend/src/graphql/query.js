import gql from 'graphql-tag';

/* eslint-disable import/prefer-default-export */
export const MembersQuery = gql`
  {
    members {
      ...member
    }
  }
  fragment member on Member {
    id
    name
    weight
  }
`;

export const ItemsQuery = gql`
  {
    items {
      ...item
    }
  }
  fragment item on Item {
    id
    name
    weight
  }
`;
