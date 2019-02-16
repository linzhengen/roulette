import gql from 'graphql-tag';

/* eslint-disable import/prefer-default-export */
export const createOptionMutation = gql`
  mutation ($name: String!, $weight: Int) {
    createOption(data: {
      name: $name
      weight: $weight
    }) {
      id
    }
  }
`;

export const deleteOptionMutation = gql`
  mutation ($id: String!) {
    deleteOption(data: {
      id: $id
    }) {
      id
    }
  }
`;
