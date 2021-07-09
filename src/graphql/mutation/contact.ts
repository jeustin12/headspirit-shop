import { gql } from '@apollo/client';

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: String!, $input: ContactInputUpdate!){
  updateContact(id:$id,input:$input)
}
`;
export const DELETE_CONTACT = gql`
  mutation($number: String!) {
    deleteContactWithName(number:$number) 
  }
`;

export const CREATE_CONTACT = gql`
mutation CreateContact($input: ContactInput!){
  CreateContact(input:$input){
    id
    number
    type
  }
}
`
