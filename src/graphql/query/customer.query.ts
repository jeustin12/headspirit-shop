import { gql } from '@apollo/client';

export const GET_LOGGED_IN_CUSTOMER = gql`
  query getCustumer($id: String!) {
    me(id: $id) {
      id
      name
      email
      address {
        id
        type
        name
        info
      }
      contact {
        id
        type
        number
      }
    }
  }
`;
