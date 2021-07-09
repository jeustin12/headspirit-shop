import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query getCategories{
    getAllCategories {
      id
      title
      slug
      icon
      children{
        id
        title
        slug
      }
    }
  }
`;
