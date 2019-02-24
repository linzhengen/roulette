import gql from 'graphql-tag';

/* eslint-disable import/prefer-default-export */
export const createMemberMutation = gql`
  mutation ($name: String!, $weight: Int) {
    createMember(data: {
      name: $name
      weight: $weight
    }) {
      id
    }
  }
`;

export const deleteMemberMutation = gql`
  mutation ($id: ID!) {
    deleteMember(where: {
      id: $id
    }) {
      id
    }
  }
`;

export const createItemMutation = gql`
  mutation ($name: String!, $weight: Int) {
    createItem(data: {
      name: $name
      weight: $weight
    }) {
      id
    }
  }
`;

export const deleteItemMutation = gql`
  mutation ($id: ID!) {
    deleteItem(where: {
      id: $id
    }) {
      id
    }
  }
`;
