import gql from 'graphql-tag';

/* eslint-disable import/prefer-default-export */
export const OptionsQuery = gql`
  {
    options {
      ...option
    }
  }
  fragment option on Option {
    id
    name
  }
`;
