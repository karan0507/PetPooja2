import { gql } from '@apollo/client';

export const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $image: Upload) {
    addCategory(name: $name, image: $image) {
      id
      name
      image
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($categoryId: ID!, $name: String, $image: Upload) {
    updateCategory(categoryId: $categoryId, name: $name, image: $image) {
      id
      name
      image
    }
  }
`;
